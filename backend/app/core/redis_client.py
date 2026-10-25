import asyncio
import json
import logging
from typing import AsyncGenerator, Dict, Set
import redis.asyncio as aioredis
from app.core.config import settings

logger = logging.getLogger(__name__)

# In-memory pub/sub fallback when Redis is not running
class InMemoryEventBus:
    def __init__(self):
        self._subscribers: Dict[str, Set[asyncio.Queue]] = {}

    def subscribe(self, channel: str) -> asyncio.Queue:
        if channel not in self._subscribers:
            self._subscribers[channel] = set()
        queue = asyncio.Queue()
        self._subscribers[channel].add(queue)
        return queue

    def unsubscribe(self, channel: str, queue: asyncio.Queue):
        if channel in self._subscribers:
            self._subscribers[channel].discard(queue)
            if not self._subscribers[channel]:
                del self._subscribers[channel]

    async def publish(self, channel: str, message: str):
        if channel in self._subscribers:
            for q in list(self._subscribers[channel]):
                await q.put(message)

in_memory_bus = InMemoryEventBus()

class RedisManager:
    def __init__(self):
        self.client = None
        self._is_connected = False

    async def connect(self):
        try:
            self.client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            await self.client.ping()
            self._is_connected = True
            logger.info("Connected to Redis successfully.")
        except Exception as e:
            logger.warning(f"Redis not available ({e}). Using in-memory fallback for real-time events.")
            self._is_connected = False

    async def disconnect(self):
        if self.client and self._is_connected:
            await self.client.close()

    async def publish_event(self, channel: str, event_data: dict):
        message = json.dumps(event_data)
        # Always publish to in-memory bus for local SSE subscribers
        await in_memory_bus.publish(channel, message)
        if self._is_connected and self.client:
            try:
                await self.client.publish(channel, message)
            except Exception as e:
                logger.error(f"Error publishing to Redis channel {channel}: {e}")

    async def subscribe_events(self, channel: str) -> AsyncGenerator[str, None]:
        queue = in_memory_bus.subscribe(channel)
        try:
            while True:
                # wait for event with timeout to send keepalive
                try:
                    msg = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield msg
                except asyncio.TimeoutError:
                    yield json.dumps({"event_type": "ping", "safe_metadata": {}})
        finally:
            in_memory_bus.unsubscribe(channel, queue)

redis_manager = RedisManager()
