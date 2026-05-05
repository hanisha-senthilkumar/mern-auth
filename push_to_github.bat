@echo off
echo Cleaning up git history and pushing to GitHub...
git checkout --orphan temp_branch
git add .
git commit -m "Cleaned initial commit"
git branch -D main
git branch -m main
git push -f origin main
echo Done!
pause
