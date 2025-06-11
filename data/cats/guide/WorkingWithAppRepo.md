
# Working with the Deployment Repositories

Here are some of the basic guidelines for how application teams should work with the Apps Deployment Repos to get their solutions deployed. This section includes details around where you should put your files and who will need to approve those files. 

Remember there are three different Apps Deployment Repositories that correspond with three different Kubernetes Clusters and AWS Accounts! 

**Different Cluster Details:**

|Cluster | App Deployment Repo | AWS Account Name | AWS Account ID |  VPCE Access |
|--------------------|--------------------------------------------------------------------------------|-------------------------------------|--------------|------------------------|
|Production Cluster  | [infra_apps](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps)           | prod-igw-dx-researchit-light        | 283234040926 | vpce-03bee17f69c9802b9 |
|QA Cluster          | [infra_apps_qa](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_qa)     | qa-igw-dx-researchit-light          | 474366589702 | vpce-058757a9c034d181c |
|Development Cluster | [infra_apps_test](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test) | dev-igw-dx-researchit-light         | 408787358807 | vpce-069388414a9f87f40 |
|Sandbox Cluster     | [infra_apps_sbx](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_sbx)   | dev-igw-dx-lrl-researchit-light-sbx | 891377229906 | vpce-069388414a9f87f40 |

## **Set Up Project Workspace**

Regardless of which environment you are working in you should see a /projects folder. Within this folder you will see a breakdown of /dev, /qa, and /prd. These folders handle applications that are segregated by their namespaces. 

To set up a dev workspace in the Production Cluster's app deployment  repo navigate to [/projects/dev](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/tree/main/projects/dev) and create a new folder. 

Name the new folder `<project-name>-dev`. This is the location where you will do all of your development work. 

When you are ready to move on to QA you will create a new folder in the [/projects/qa](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/tree/main/projects/qa) folder named `<project-name>-qa`. 

When you are ready to move to production you will create a new folder in the [/projects/prd](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/tree/main/projects/prd) folder named `<project-name>-prd`

**Note**: The name that you give your folder MUST match the name that you use as your namespace within the folder. 

<br /> 


## **Merging to Main**

The changes on your branch will not go live in the cluster until you have merged them to the `main` branch. In order to merge you changes into this branch you will need to raise a Pull Request. Pull Requests are required as we have validation that will run on your changes and protect you from merging in code that will result in a failed build. If your build fails you should go into the GitHub actions file and see what went wrong. There will be a message that will point you in the right direction and provide some details on how to fix your error. 

If you are creating a new namespace or making changes to an existing namespace the `lrl_light_infra_approvers` group will need to approve your pull request. This group is made up of individuals on the CATS Platform team. Approvals from the group are not needed for any other files other than on namespace.yaml files, though we are still happy to provide a review of your code. 

If you do need an approval from the `lrl_light_infra_approvers` group you can reach out to one of them on Teams and send a link to your PR. This will allow them to jump in quickly, complete their review, and provide their approval. There are many PRs live at all times, so it is difficult for us to find your PR without a link to it directly. 

We highly suggest you update the CODEOWNERS file so that you can control the groups that are automatically selected and required for approvals on your namespace's files. Further details on the CODEOWNERS file can be found [here](./Codeowners.md). 

Note: there are many people working in this repository on a daily basis so you need to update your base branch in order to get your changes to merge in. **Watch your PR until it merges!**

## Using Codespaces

CATS makes it simple to use codespaces with the same docker images you use in CATS.

You will see three new environment variables in codespaces created from github repos onboarded to CATS as described in the readme:

+ LIGHT_DOCKER_REPOSITORY_URL
+ LIGHT_DOCKER_TOKEN
+ LIGHT_DOCKER_USER

You can use these to login to docker with:
```bash
echo $LIGHT_DOCKER_TOKEN | docker login -u $LIGHT_DOCKER_USER $LIGHT_DOCKER_REPOSITORY_URL --password-stdin
```

Once logged in, you will have read only (pull) permissions on any CATS docker images.

If you want to auto login, you can add the following file to your github repo ```.devcontainer/devcontainer.json```:

```json
{
    "postCreateCommand": "echo $LIGHT_DOCKER_TOKEN | docker login -u $LIGHT_DOCKER_USER $LIGHT_DOCKER_REPOSITORY_URL --password-stdin",
}
```

<br /> 

## Merge Queue Process
 
 This repository uses GitHub's merge queues to manage pull request merges, which ensures:
 
 1. Changes are integrated in a fair, sequential manner
 2. Automated validation runs on each change before merging
 3. Conflicts are reduced by handling one merge at a time
 
 ### Protected Branch Naming Convention
 
 We maintain protected branches with the naming convention:
 
 ```
 automation/<namespace-name>
 ```
 
 These branches have special automation that handles auto-committed image updates from the Flux controllers. These updates manage image tag changes and are added to the merge queue to maintain fairness in processing.
 
 ### Best Practices for Pull Requests
 
 1. Create a new branch for your changes
 2. Make your changes and submit a pull request
 3. Once approved, your PR will be added to the merge queue
 4. Wait for the automated processes to complete before your changes are merged
 5. For image updates, use the appropriate automation branch