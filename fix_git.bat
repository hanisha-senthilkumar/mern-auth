@echo off
echo ==========================================
echo 🛠️ GIT FIX & PUSH SCRIPT
echo ==========================================

echo 1. Cleaning up stuck processes...
taskkill /F /IM git.exe 2>nul
if exist .git\index.lock (
    echo Removes .git\index.lock
    del .git\index.lock
)

echo.
echo 2. Updating Git Index...
git status
git add .

echo.
echo 3. Committing changes...
git commit -m "Fix git configuration, add .gitignore, and update logs"

echo.
echo 4. Pushing to GitHub...
echo (If this hangs, you might need to enter credentials)
git push origin main

echo.
echo ==========================================
echo DONE.
echo ==========================================
