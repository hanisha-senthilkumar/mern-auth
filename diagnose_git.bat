@echo off
echo DIAGNOSIS START > git_diagnosis.txt
echo ---GIT STATUS--- >> git_diagnosis.txt
git status >> git_diagnosis.txt 2>&1
echo. >> git_diagnosis.txt
echo ---GIT REMOTE--- >> git_diagnosis.txt
git remote -v >> git_diagnosis.txt 2>&1
echo. >> git_diagnosis.txt
echo ---GIT CONFIG--- >> git_diagnosis.txt
git config --list >> git_diagnosis.txt 2>&1
echo. >> git_diagnosis.txt
echo ---GIT PUSH DRY RUN--- >> git_diagnosis.txt
git push origin main --dry-run >> git_diagnosis.txt 2>&1
echo DIAGNOSIS END >> git_diagnosis.txt
