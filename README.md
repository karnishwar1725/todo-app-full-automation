# To-Do App — Full DevOps Automation (Terraform + Ansible + Docker + GitHub Actions + Azure)

This project demonstrates a beginner-friendly **DevOps pipeline**:
- **Terraform** provisions Azure infrastructure (Resource Group, Service Plan, Web App)
- **Docker** containerizes the app
- **GitHub Actions** builds Docker image and **deploys automatically** to **Azure App Service** on every push
- **Ansible** demo playbook shows post-deploy checks/verification (optional)

Live app URL (after deployment):
```
https://todo-app-karnishwar1725.azurewebsites.net
```

---

## 0) Prerequisites (macOS / MacBook Air M3)

```bash
# Homebrew (if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Core tools
brew install git node terraform ansible azure-cli

# Launch Docker Desktop (install via: brew install --cask docker)
# Then keep Docker Desktop running
```

---

## 1) Run locally (optional quick test)

```bash
npm install
npm start
# open http://localhost:3000
```

## 2) Build and run with Docker (optional but great for demo)

```bash
docker build -t todo-app:local .
docker run --rm -p 3000:3000 todo-app:local
# open http://localhost:3000
```

---

## 3) Provision Azure with Terraform (Infrastructure as Code)

```bash
az login
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```
This creates:
- Resource Group: `todo-rg`
- Linux Free Plan: `todo-service-plan` (F1)
- Web App: `todo-app-karnishwar1725` (Node 18)

> You can change region in `main.tf` (default is "East US").

---

## 4) Set up CI/CD to Azure (GitHub Actions)

1. Create a GitHub repo (e.g., `todo-app-full-automation`) and push this project:

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
   - Click **Get publish profile** (Download)

3. In your **GitHub repo** → **Settings → Secrets and variables → Actions → New repository secret**
   - **Name:** `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Value:** Paste the entire XML from the publish profile

4. Trigger CI/CD by pushing any change:
```bash
git commit --allow-empty -m "Trigger deploy"
git push
```
Then watch **Actions** tab. After success, open:
```
https://todo-app-karnishwar1725.azurewebsites.net
```

---

## 5) (Optional) Verify with Ansible

```bash
# Runs locally against localhost and checks your live site URL
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

This playbook:
- Prints project info
- Checks `node -v` (local)
- Hits your Azure site (`/todo-app-karnishwar1725.azurewebsites.net`) and prints HTTP status

---

## Notes
- To persist todos, add a database (e.g., Cosmos DB) later.
- Terraform state is local; for teams, use a remote backend (e.g., Azure Storage).

