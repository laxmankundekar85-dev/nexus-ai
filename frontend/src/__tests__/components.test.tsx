import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

describe('Button component', () => {
  it('renders button with text label', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeDefined();
  });

  it('renders in disabled state when loading', () => {
    render(<Button loading>Processing</Button>);
    const btn = screen.getByRole('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });
});

describe('StatusBadge component', () => {
  it('renders completed status correctly', () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByText('completed')).toBeDefined();
  });

  it('renders planning status correctly', () => {
    render(<StatusBadge status="planning" />);
    expect(screen.getByText('planning')).toBeDefined();
  });
});
