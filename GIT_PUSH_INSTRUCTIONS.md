# 🚀 How to Push Your Code to GitHub

Since I cannot directly authenticate with your GitHub account or input your credentials, you will need to run the following commands in your terminal to push your code.

## 1️⃣ Verify Remote Repository
First, check that your local repository is linked to the correct remote URL:

```bash
git remote -v
```

It should show:
```
origin  https://github.com/hanisha-senthilkumar/mern-auth.git (fetch)
origin  https://github.com/hanisha-senthilkumar/mern-auth.git (push)
```

## 2️⃣ Stage and Commit Changes
If you have modified files that haven't been committed yet, run:

```bash
git add .
git commit -m "Update application code"
```

## 3️⃣ Push to GitHub
Now, try pushing your changes:

```bash
git push origin main
```

---

## ⚠️ Common Errors and Fixes

### ❌ Error: "Permission denied" or "Authentication failed"
**Reason:** GitHub requires a Personal Access Token (PAT) instead of a password for HTTPS authentication, or your credentials are not cached.
**Fix:**
1. When prompted for a password, you might need to use a **Personal Access Token**.
2. Generate one in GitHub Settings -> Developer Settings -> Personal access tokens -> Tokens (classic).
3. Ensure the token has `repo` scope permissions.
4. Paste the token when asked for the password.

### ❌ Error: "Updates were rejected because the remote contains work that you do not have locally"
**Reason:** The GitHub repository has commits (e.g., a README or License) that you don't have locally.
**Fix:**
Pull the changes first:

```bash
git pull origin main --rebase
```

Then push again:

```bash
git push origin main
```

### ❌ Error: "src refspec main does not match any"
**Reason:** Your branch might be named `master` instead of `main`, or you haven't made any commits yet.
**Fix:**
Check your branch name:
```bash
git branch
```
If it says `master`, use:
```bash
git push origin master
```
If you have no commits, make sure you ran the `git commit` step above.
