# **To-Do App Automation using Terraform, Ansible, Docker, GitHub Actions, Azure**

This project demonstrates a beginner-friendly **DevOps pipeline**:
- **Terraform** provisions Azure infrastructure (Resource Group, Service Plan, Web App)
- **Docker** containerizes the app
- **GitHub Actions** builds Docker image and **deploys automatically** to **Azure App Service** on every push
- **Ansible** demo playbook shows post-deploy checks/verification (optional)

app URL (after deployment):

https://todo-app-karnishwar1725.azurewebsites.net

---

## 0) Prerequisites (for macOS)

```bash
# Homebrew 
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Tools Required
brew install git node terraform ansible azure-cli

# Launch Docker Desktop (install with the command: brew install --cask docker)
# Then keep Docker Desktop running
```

---

## 1) Checking whether the app runs locally

```bash
npm install
npm start
# open http://localhost:3000
```

## 2) Building and running it with docker locally to check whther docker contains it properly

```bash
docker build -t todo-app:local .
docker run --rm -p 3000:3000 todo-app:local
# open http://localhost:3000
```

---

## 3) Linking Azure account with Terraform to make changes in cloud infrastructure(Infrastructure as code)

```bash
az login
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```
These commands create:
- Resource Group: `todo-rg`
- Linux Free Plan: `todo-service-plan` (default free plan is F1)
- Web App: `todo-app-karnishwar1725` (Node 18 as it is stable and has long term supports)

> region can be changed in terraform "main.tf" file. I have selected West Europe as region since some regions have restrictions on free plans.

---

## 4) Set up CI/CD workflows using Github Actions to Azure

1. Create a GitHub repo and push this project:

```bash
git init
git add .
git commit -m "Full automation: Terraform + Ansible + Docker + CI/CD"
git branch -M main
git remote add origin https://github.com/karnishwar1725/todo-app-full-automation.git
git push -u origin main
```

2. In the Azure Portal:
   - Go to your **Web App** `todo-app-karnishwar1725`
   - Click **Get publish profile**, Download the publish profile file 

3. In your **GitHub repo** → **Settings → Secrets and variables → Actions → New repository secret**
   - **Name the secret as:** `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Value:** Paste the entire content in the publish profile under secret. 

4. Trigger CI/CD by pushing any change:
```bash
git commit --allow-empty -m "Trigger deploy"(allow emoty is used as it allows github to save files again even if there is no changes)
git push
```
Then watch the **Actions tab** in your Github Repository . After the deployment is completed, open:
```
https://todo-app-karnishwar1725.azurewebsites.net
```

---

## 5) Verify with Ansible

```bash
# Runs the below command on your system locally
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

This playbook:
- Prints project info
- Checks `node -v` (local)
- Hits your Azure site and prints HTTP status which will be **200** if it is successful.

---
