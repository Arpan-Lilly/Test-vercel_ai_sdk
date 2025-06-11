# Makefile

A Makefile is a file used by the make utility, a standard build automation tool available on Unix/Linux systems and environments that can emulate Unix toolchains. The purpose of a Makefile is to define a set of tasks to be executed. These tasks can include compiling source code into binary executables, cleaning up temporary files, installing software to system directories, and more. It essentially allows developers to automate the repetitive aspects of the build process.

The structure of a Makefile includes rules, dependencies, and actions:

Rules: These indicate when and how to remake certain files, which are the targets of the rule. A rule specifies the dependencies of the target and the commands to execute when the target needs to be updated.

Dependencies: These are files that the target depends on; if any dependency is newer than the target, the commands associated with that target will be executed.

Actions: These are the commands that make executes in order to update the target file. Actions are usually shell commands.

## Makefile Template

Here's a an example of what a Makefile might look like:

```makefile

# =======================================
# Makefile for YOUR-APP-NAME
# =======================================

# Shell to use for running scripts
SHELL := /bin/bash

# Detect operating system
OSFLAG :=
ifeq ($(OS),Windows_NT)
	$(error Please use Windows Subsystem for Linux)
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		OSFLAG += LINUX
		MAKEFLAGS += -j$(shell nproc)
	endif
	ifeq ($(UNAME_S),Darwin)
		OSFLAG += DARWIN
	endif
endif

# Default values for variables
DOCKER_TAG ?= latest
IMAGE_NAME ?= your_app_name
ECR_REPOSITORY ?= 123456789012.dkr.ecr.us-east-2.amazonaws.com/$(IMAGE_NAME)

# =======================================
# Setup and Development Targets
# =======================================

.PHONY: setup ci_setup ci_unit_tests setup_test test dev clean refresh_dev

setup: ## Setup the project environment
	@echo Setting up the project...

# CI/CD Targets
ci_setup: ## Setup CI environment
	$(MAKE) build

ci_unit_tests: test ## Run unit tests in CI

# Testing Targets
setup_test: setup ## Prepare environment for testing
	@echo Setting up test environment...

test: setup_test ## Run tests locally
	npm run test

# Local Development Targets
dev: setup ## Prepare local development environment
	npm run dev

clean: ## Clean the local development environment
	@echo Cleaning up...

refresh_dev: clean dev ## Refresh the local development environment

# =======================================
# Docker Operations
# =======================================

.PHONY: build up down aws_login cats_dev_ecr_login cats_dev_ecr_tag cats_dev_ecr_push cats_dev_ecr_build_and_push

build: ## Build Docker image
	docker build -t $(IMAGE_NAME):$(DOCKER_TAG) .

up: ## Start Docker containers
	docker-compose up -d

down: ## Stop Docker containers
	docker-compose down

# =======================================
# CATS DEV Cluster Development
# =======================================

aws_login: ## Log in to AWS
	AWS_CONFIG_FILE=.aws/config AWS_PROFILE=default aws sso login --no-browser

cats_dev_ecr_login: ## Log in to ECR
	aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin $(ECR_REPOSITORY)

cats_dev_ecr_tag: ## Tag Docker image for ECR
	docker tag $(IMAGE_NAME):$(DOCKER_TAG) $(ECR_REPOSITORY):$(DOCKER_TAG)

cats_dev_ecr_push: cats_dev_ecr_tag ## Push Docker image to ECR
	docker push $(ECR_REPOSITORY):$(DOCKER_TAG)

cats_dev_ecr_build_and_push: build cats_dev_ecr_push ## Build and push Docker image to ECR

# =======================================
# Helper Targets
# =======================================

.PHONY: help

help: ## Display this help message
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Allow overriding of targets
%: %-default
	@true
```

## Template Breakdown

This Makefile is structured to facilitate various development, testing, CI/CD, and Docker operations for an application. It's divided into several sections, each with a specific focus. Here's a breakdown:

### Preamble and Setup

#### Shell Specification
- **SHELL := /bin/bash** sets the default shell for executing commands to Bash. This ensures that Bash-specific syntax and utilities can be used reliably.

#### Operating System Detection
- This block checks the operating system where the Makefile is running. It sets an **OSFLAG** variable based on the OS detected (**LINUX** or **DARWIN** for macOS). If Windows is detected, it errors out, suggesting the use of Windows Subsystem for Linux (WSL) instead. This section is crucial for ensuring that the Makefile behaves correctly across different environments.

#### Default Variables
- Sets default values for **DOCKER_TAG**, **IMAGE_NAME**, and **ECR_REPOSITORY** using the **?=** operator. This allows these variables to be overridden externally without modifying the Makefile.

### Targets and Phony Targets

#### .PHONY
- This special target lists other targets that are not associated with files. It ensures that the listed targets are always executed even if files with those names exist.

#### Setup and Development Targets
- **setup**: Initializes the project environment.
- **ci_setup**, **ci_unit_tests**: Define Continuous Integration (CI) setup and testing procedures.
- **setup_test**, **test**: Prepare for and run tests locally.
- **dev**, **clean**, **refresh_dev**: Targets for managing local development environments.

#### Docker Operations
- **build**, **up**, **down**: Commands for building Docker images and managing container state.

### CATS DEV Cluster Development

#### AWS and ECR Login
- Targets for authenticating with AWS and the Elastic Container Registry (ECR), necessary for pushing Docker images to AWS ECR.
  - **aws_login**: Logs in to AWS using the specified profile.
  - **cats_dev_ecr_login**: Logs in to AWS ECR to enable pushing Docker images.
  - **cats_dev_ecr_tag**, **cats_dev_ecr_push**, **cats_dev_ecr_build_and_push**: Manage tagging and pushing Docker images to ECR.

### Helper Targets

- A self-documenting feature that parses the Makefile and displays a help message detailing available targets and their descriptions. It uses awk to extract comments following the **##** marker. This target makes it easier for users to understand and use the Makefile without digging through its contents manually.

### Overriding Pattern Rule

#### %: %-default
- This rule allows for dynamic target names and is a placeholder for future extensions. It doesn't do anything by default (**@true** is a no-operation command), but it sets up a convention where targets can have **-default** versions that can be overridden.


