# **Prerequisites**

The following prerequisites will need to be configured to get started. 

<br /> 

## Repository Access
First of all, you will need write access to the repository you are working with, so you can add your app's Kubernetes config.  You can request access in GitHub [here](https://github.com/orgs/EliLillyCo/teams/lrl_light_k8s_infra_write).

Before you can have your application deployed, we will need to create a image repository for your GitHub repository. We have automated this process so all you need to do is add the team `light_apps` to your GitHub repository with `admin` privileges.

  1. Navigate to the Settings tab of your GitHub repository

  2. Click on the Collaborators and teams button under Access section

  3. Click on the Add teams button and search for "light_apps" and be sure to select Admin as the role.

  4. Click the button on the bottom of the pop-up "Add EliLillyCo/light_apps to this repository"
     
<!-- Admin Role selection page.png -->
![Access Role](/img/access_role.jpg)

If all went well you should see your Manage Access settings option look similar to this

<!-- ![access](https://user-images.githubusercontent.com/26599502/96202446-39a52000-0f2d-11eb-8af2-7620b536c08d.png) -->
![Manage Access](/img/manage_access.jpg)

The next step is to wait for our credential service to run and create an ECR repository for your GitHub repository and send the login credentials to your GitHub repository's secrets.

**Note:** Our credential service runs every two hours, so you may not get your Light ECR credentials immediately.

To check if you have received your ECR credentials, navigate to the Security section in the Settings tab of your GitHub repository and go to Actions under Secrets and variables. You should see 3 secrets created with the names `LIGHT_DOCKER_REPOSITORY_URL`, `LIGHT_DOCKER_TOKEN`, and `LIGHT_DOCKER_USER`.

<!-- ![secrets](https://user-images.githubusercontent.com/26599502/96593676-c6e2ce80-12b7-11eb-95fc-77333f7ad0f5.png) -->
![Actions Secrets](/img/actions_secrets.jpg)

Once you see those three secrets you are all set to start publishing your docker images to that ECR repository.

<br /> 

## Automated Security Scanning

Not only does the credential service send out Tokens for you to access your new ECR repository which is setup with image scanning, but it also turns on GitHub's vulnerability scanning and alerting for your repository automatically.

<!-- ![image](https://user-images.githubusercontent.com/26599502/105541995-a23b3000-5cc6-11eb-93bd-181199a52393.png) -->
![code security](/img/code_security.jpg)

You can see that your repository will have these settings automatically turned on so that you can be alerted for any vulnerabilities in your codebase that GitHub might find. For more information please visit [GitHub Security](https://github.com/features/security) to learn more.

**Note:** GitHub repository owners will receive email notifications when GitHub has detected a vulnerability in your repository. Typically they will also create a pull request for you automatically to update your dependencies to the latest version where the bug has been fixed.

<br />
