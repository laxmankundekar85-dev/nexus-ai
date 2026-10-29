@echo off
echo ========================================================
echo       Nexus AI - Android APK / AAB Builder (TWA)
echo ========================================================
echo.

echo Checking Node.js environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is required to build the Android package.
    pause
    exit /b 1
)

echo [1/3] Checking @bubblewrap/cli...
call npx --yes @bubblewrap/cli --version

echo.
echo [2/3] Generating Android Studio project and Gradle build...
if not exist "build.gradle" (
    call npx --yes @bubblewrap/cli init --manifest=https://nexus-ai-ecru-nine.vercel.app/manifest.webmanifest
)

echo.
echo [3/3] Compiling signed Android APK and AAB for Google Play...
call npx --yes @bubblewrap/cli build

echo.
echo ========================================================
echo  Build Complete! Check the 'android' folder for app-release-signed.apk
echo ========================================================
pause
