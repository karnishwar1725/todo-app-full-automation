# Ansible 

This playbook runs **locally** to verify your deployment of `todo-app-karnishwar1725`:
- Prints project info
- Checks `node -v` locally
- Calls `https://todo-app-karnishwar1725.azurewebsites.net/` until it returns HTTP 200

Run:
```bash
ansible-playbook -i inventory.ini playbook.yml
```
