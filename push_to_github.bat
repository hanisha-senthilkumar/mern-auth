@echo off
echo ==============================================
echo 🚀 GIT PUSH HELPER
echo ==============================================
echo.
echo 1. Checking Git Status...
git status
echo.
echo 2. Checking Remote URL...
git remote -v
echo.
echo 3. Adding all changes...
git add .
echo.
echo 4. Committing changes (if any)...
git commit -m "Update from Antigravity"
echo.
echo 5. Pushing to GitHub...
echo ----------------------------------------------
echo NOTE: If prompted, enter your GitHub Username and Personal Access Token (Password).
echo ----------------------------------------------
git push origin main
echo.
echo ==============================================
echo DONE!
echo If there was an error, please copy it and share it with me.
echo ==============================================
pause
