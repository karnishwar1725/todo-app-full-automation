terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.5.0"
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "todo_rg" {
  name     = "todo-rg"
  location = "westeurope"
}

# App Service Plan (Free Tier)
resource "azurerm_service_plan" "todo_plan" {
  name                = "todo-service-plan"
  location            = azurerm_resource_group.todo_rg.location
  resource_group_name = azurerm_resource_group.todo_rg.name
  os_type             = "Linux"
  sku_name            = "B1" # Free Tier (no cost)
}

# Web App (Linux)
resource "azurerm_linux_web_app" "todo_app" {
  name                = "todo-app-karnishwar1725"
  location            = azurerm_resource_group.todo_rg.location
  resource_group_name = azurerm_resource_group.todo_rg.name
  service_plan_id     = azurerm_service_plan.todo_plan.id

  site_config {
    always_on = true
    
    application_stack {
      node_version = "18-lts"
    }

    # 'always_on' is not allowed on F1 plan, so we skip it
  }

  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "0"
  }
}
