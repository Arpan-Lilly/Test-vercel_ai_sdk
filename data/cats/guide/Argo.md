# **Argo : Declarative GitOps Tool**

Argo CD is a declarative, GitOps continuous delivery tool for Kubernetes. It automates the deployment of applications to various environments by using Git repositories as the source of truth for defining the desired application state. Argo CD follows the GitOps principles, where updates to applications are made by changing the code in Git, and the tool automatically applies these changes to the target environment, ensuring that the live state in the cluster always matches the version-controlled configuration.


## Using Argo in CATS
### Enabling Argo for Your Application
To enable Argo for your solution you will need to add an annotation to your namespace. Find more information around how to configure this annotation [HERE](/guide/Namespace#2-annotations-explained)

### Permissions by Role
*Note: For information on Argo's RBAC Config please scroll down to Argo Concepts > RBAC Configuration*

|Resource                     |Action                 |Context        |Read-Only  |Admin      |Support    |
|-----------------------------|-----------------------|:-------------:|:---------:|:---------:|:---------:|
|**Project**                  |List                   |All            |**X**      |**X**      |**X**      |
|                             |View                   |All            |**X**      |**X**      |**X**      |
|                             |Modify                 |All            |           |           |**X**      |
|*Accounts*                   |List                   |All            |**X**      |**X**      |**X**      |
|                             |View                   |All            |**X**      |**X**      |**X**      |
|                             |Modify                 |All            |           |           |**X**      |
|                             |Delete                 |All            |           |           |**X**      |
|*Accounts.Tokens*            |Get Token              |All            |           |           |**X**      |
|                             |Create Token           |All            |           |           |**X**      |
|                             |Delete Token           |All            |           |           |**X**      |
|*Clusters*                   |List                   |All            |           |           |**X**      |
|                             |View                   |All            |           |           |**X**      |
|                             |Modify                 |All            |           |           |**X**      |
|                             |Delete                 |All            |           |           |**X**      |
|*Certificates*               |List                   |All            |           |           |**X**      |
|                             |View                   |All            |           |           |**X**      |
|                             |Create                 |All            |           |           |**X**      |
|                             |Modify                 |All            |           |           |**X**      |
|                             |Delete                 |All            |           |           |**X**      |
|*GnuPG Keys*                 |List                   |All            |           |           |**X**      |
|                             |View                   |All            |           |           |**X**      |
|                             |Create                 |All            |           |           |**X**      |
|                             |Modify                 |All            |           |           |**X**      |
|                             |Delete                 |All            |           |           |**X**      |
|*Repositories*               |List                   |All            |**X**      |**X**      |**X**      |
|                             |View                   |All            |**X**      |**X**      |**X**      |
|                             |Create                 |All            |           |           |**X**      |
|                             |Modify                 |All            |           |           |**X**      |
|                             |Delete                 |All            |           |           |**X**      |

|Resource                     |Action                 |Context        |Read-Only  |Admin      |Support    |
|-----------------------------|-----------------------|:-------------:|:---------:|:---------:|:---------:|
|**Application**              |List                   |Owned Projects |**X**      |**X**      |**X**      |
|                             |View                   |Owned Projects |**X**      |**X**      |**X**      |
|                             |Delete                 |Owned Projects |           |           |**X**      |
|                             |Deployment/Restart     |Owned Projects |           |**X**      |**X**      |
|                             |DeamonSets/Restart     |Owned Projects |           |**X**      |**X**      |
|                             |Sync                   |Owned Projects |           |**X**      |**X**      |
|                             |Rollback (Redeploy)    |Owned Projects |           |**X**      |**X**      |
|                             |Refresh                |Owned Projects |           |**X**      |**X**      |
|                             |Logs                   |Owned Projects |**X**      |**X**      |**X**      |
|                             |Exec                   |Owned Projects |           |**X**      |**X**      |
|                             |List                   |All Projects   |**X**      |**X**      |**X**      |
|                             |View                   |All Projects   |**X**      |**X**      |**X**      |
|                             |Delete                 |All Projects   |           |           |**X**      |
|                             |Sync                   |All Projects   |           |           |**X**      |
|                             |Rollback (Redeploy)    |All Projects   |           |           |**X**      |
|                             |Refresh                |All Projects   |           |           |**X**      |
|                             |Logs                   |All Projects   |           |           |**X**      |
|                             |Exec                   |All Projects   |           |           |**X**      |

|Resource                     |Action                 |Context        |Read-Only  |Admin      |Support    |
|-----------------------------|-----------------------|:-------------:|:---------:|:---------:|:---------:|
|**ApplicationSet** (disabled)|List                   |Owned Projects |           |           |**X**      |
|                             |View                   |Owned Projects |           |           |**X**      |
|                             |Modify                 |Owned Projects |           |           |**X**      |
|                             |Delete                 |Owned Projects |           |           |**X**      |
|                             |List                   |All Projects   |           |           |**X**      |
|                             |View                   |All Projects   |           |           |**X**      |
|                             |Modify                 |All Projects   |           |           |**X**      |
|                             |Delete                 |All Projects   |           |           |**X**      |

#### Custom Role
Currently We do not allow custom configurations for your Argo Roles. This may come in a future release. If this is something you want to see prioritized please bring it up in CATS club! 

## Argo Dashboard

The Argo CD dashboard provides a comprehensive and user-friendly web interface that allows users to manage and monitor their applications' deployment process in Kubernetes clusters efficiently.

- [DEV Cluster Dashboard](https://argocd.apps-d.lrl.lilly.com/)
- [QA Cluster Dashboard](https://argocd.apps-q.lrl.lilly.com/)
- [PROD Cluster Dashboard](https://argocd.apps.lrl.lilly.com/)



### Views Available

#### Tree View

![Tree Icon](screenshots/treeIcon.png)

When navigating to the dashboard you will land on the "Applications" page. On this page you can see all the "applications" or namespaces that are within the cluster you are working in. Security is set so that you should only see the namespaces associated with you. 

After selecting an application tile it will open the resource tree associated with the namespace. Here you can see all the resources associated with your namespace and how they roll up to the top level "application" resource. 

On the Cards representing each of your resources you can see some visual cues that provide immediate visual feedback on the state of your resources, if they are `synced`, `OutOfSynce`, `progressing`, `healthy` or `failed` and more! Understand what each icon means by expanding the sidebar on the left. 

Click into individual resources to find more details and logs on specific resources. 

<br />

#### Pod View

![Pod Icon](screenshots/podsIcon.png)

This view displays all the pods associated with your application and allows you to group them via different filters:
 - Node
 - Parent Resource
 - Top Level Resources

To open a specific pod you should hover over the green checkbox. Details around the individual pod will appear and allow you to better understand which pod you are selecting. To look at the full description of the pod click the green checkbox.

When clicking into a pod you can see three tabs, `Summary`, `Events`, and `Logs`. 

**Summary**: Includes the latest manifest that is deployed and active in the cluster. Here you can ensure you have configured the resource correctly and that your most recent configurations are live in the cluster. 

**Events**: This section is where startup events are logged. If your resource is having trouble deploying, this is where you will see those errors. For pods you may see issues around pulling an image or node scheduling issues here. Issues on this side often indicate there is an issue on the resource configuration side of your deployment. Look through our troubleshooting Docs to see if the error you are facing has a solution documented.

**Logs**: This section includes the pod logs. These are the logs that are produced by the pod itself after starting up successfully. Errors in this section usually indicate there is an issue on the application side of your deployment.

<br />

#### Network View

![Pod Icon](screenshots/networkIcon.png)

Use this view to troubleshoot network ingresses
Ensure everything is connected as anticipated
Selecting an ingress opens up the configuration and you can ensure your host is working. 
Use this to figure out where is the missing connection. 

The Network View can be helpful to users who are troubleshooting ingress routes as they show the flow of network traffic from ingress resources through a service to the pod that the service is pointing to. Breaks in this flow likely indicate a configuration issue on one or both of the indicated resources. 

You can use this view to verify the network flow is implemented as you intend. When selecting an ingress resource card you can see two options, `Summary` and `Events`. 

**Summary**: Includes the latest manifest that is deployed and active in the cluster. Here you can ensure you have configured the ingress resource correctly and that your most recent configurations are live in the cluster. 

**Events**: This section is where start up events are logged. If your ingress is having trouble deploying this is where you will find the errors. Issues on this side often indicated there is an issue on the resource configuration side of your deployment. Look through our troubleshooting docs to see if the error you are facing has a solution documented.

<br />

#### List View

![List Icon](screenshots/listIcon.png)

This view is a basic view that lists out all of the individual resources that are a part of your application. This is a table of all your items in a single location. If you know what you are looking for this may be a fast way to jump directly to the resource you are searching for. 

<br />

### Sidebar

On the left side of the screen you can find the side bar. You may need to expand it if you do not see all of the options. 

**FILTERS**

Depending on what view you have selected you can use the filters in the Sidebar to filter what resources are displayed in your main view. You can also find the definitions for the different icons that appear on your resource cards to give you visual feedback. 

**SYNC STATUS**: 

Whether or not the live state matches the target state. Is the deployed application the same as Git says it should be? If correctly applied status is `Synced`. If not correctly applied `Out of Sync`.

<br />

**HEALTH STATUS**:
- *Healthy* - the resource is healthy
- *Progressing* - the resource is not healthy yet but still making progress and might be healthy soon
- *Degraded* - the resource is degraded
- *Suspended* - the resource is suspended and waiting for some external event to resume (e.g. suspended CronJob or paused Deployment)
- *Missing* - the resource is missing but Argo CD believes it should still exist. 
- *Unknown* - Argo does not know the health status of the resource. 

<br />

### Refresh Resources

Use the Refresh Resources button at the top of your view to get the most up-to-date manifests from github and execute a diff on manifests active in the cluster and current in github. This will allow you to know if your resources are in sync or not. 

`Refresh`: Fetches the latest manifests from git and compares diff.

`Hard Refresh`: Argo CD caches the manifests, and a hard refresh will invalidate this cache.

### Sync Resources

**Sync**: Executing a sync reconciles the current cluster state with the target state in git. 

**Out of Sync Status**: Resources become out of sync when Argo detects a difference between the active manifest in the cluster and the current manifest detected in github. 

You can fix Out of sync resources by using the Argo Dashboard's Sync function. There are two ways to sync Out of Sync resources, by either syncing individual resources that are out of sync or syncing the entire project. 

**Sync All Resources in your Project**
1. When in the Tree View and looking at all of your projects resource cards, click the Sync Button at the top

2. Depending on the issue that you are facing causing the out of synSelect one of the following options
    - `Prune`: Remove Objects that are dangling. Trim Off the stuff that should not be there anymore. Remove everything with a trash can icon. 
    - `Dry Run`: Give you a chance to try out the action before actually doing it. 
    - `Apply Only`: It will not create new objects but will only update existing options.
    - `Force`: Makes changes and disregards potential errors

3. Select a *Prune Propagation Policy*
    - `Foreground`: In this policy, when you delete an object, the deletion process enters a "foreground deletion" state. First, the object is marked as "deleting" by setting its metadata.deletionTimestamp field, which signals that the object is in the process of being deleted. The system then deletes all the dependent objects (those that specify the object as an owner in their metadata.ownerReferences). The original object is only removed after all its dependents are deleted. This policy is useful when you need to ensure that all dependent resources are cleanly and completely removed before the primary object is deleted.
    - `Background`: When using the background deletion policy, after you delete the primary object, it is immediately removed. However, the garbage collector will then asynchronously clean up all dependent objects in the background. This means the primary object gets deleted first without waiting for its dependents to be deleted. This policy is useful for quicker deletions of the primary object while not needing to manage the cleanup process yourself.
    - `Orphan`: With the orphan deletion policy, when you delete an object, its dependents are not deleted. Instead, they are "orphaned," meaning they will remain in the cluster but will no longer have an owner. This policy is useful if you want to delete an object but keep its dependents running, possibly to attach them to another parent object later.

4. Select which resources to Synchronize in the `Synchronize Resources` Section
    - All: Selecting `All` will apply the change to all of the resources in your application. 
    - Out of Sync: Selecting `Out Of Sync` will apply the change to all of the resources with the Out of Sync status. 
    - None: Selecting None will deselect all resources.
    - Manual Selection: You also have the option to scroll through and manually check the boxes for the resources you want to apply the change to. 

<br />


**Sync One Resource in your Project**

1. Expand the Resource Card that is out of sync

2. In the top right corner you will see the sync button, click it

3. Depending on the issue that you are facing causing the out of synSelect one of the following options
    - `Prune`: Remove Objects that are dangling. Trim Off the stuff that should not be there anymore. Remove everything with a trash can icon. 
    - `Dry Run`: Give you a chance to try out the action before actually doing it. 
    - `Apply Only`: It will not create new objects but will only update existing options.
    - `Force`: Makes changes and disregards potential errors

4. Select a *Prune Propagation Policy*
    - `Foreground`: In this policy, when you delete an object, the deletion process enters a "foreground deletion" state. First, the object is marked as "deleting" by setting its metadata.deletionTimestamp field, which signals that the object is in the process of being deleted. The system then deletes all the dependent objects (those that specify the object as an owner in their metadata.ownerReferences). The original object is only removed after all its dependents are deleted. This policy is useful when you need to ensure that all dependent resources are cleanly and completely removed before the primary object is deleted.
    - `Background`: When using the background deletion policy, after you delete the primary object, it is immediately removed. However, the garbage collector will then asynchronously clean up all dependent objects in the background. This means the primary object gets deleted first without waiting for its dependents to be deleted. This policy is useful for quicker deletions of the primary object while not needing to manage the cleanup process yourself.
    - `Orphan`: With the orphan deletion policy, when you delete an object, its dependents are not deleted. Instead, they are "orphaned," meaning they will remain in the cluster but will no longer have an owner. This policy is useful if you want to delete an object but keep its dependents running, possibly to attach them to another parent object later.

5. Select which resources to Synchronize in the `Synchronize Resources` Section
    - All: Selecting `All` will apply the change to all of the resources in your application. 
    - Out of Sync: Selecting `Out Of Sync` will apply the change to all of the resources with the Out of Sync status. 
    - None: Selecting None will deselect all resources.
    - Manual Selection: You also have the option to scroll through and manually check the boxes for the resources you want to apply the change to. 

### Get Logs

In order to find the logs from your pods you will need to navigate to the pod you are looking for and open it up to find the logs tab.

You can navigate to the pod via its resource card through the tree view or to the pod through the pod view outlined above

Once you have the pod resource you want opened you should see three tabs, `Summary`, `Events`, and `Logs`

Note: When you view logs from a resource that is the parent of multiple resources then all of the logs of the resources that roll up to the resource you are viewing will be included in the logs. 

### Get Events

In order to find the events on a resource navigate to your preferred view and open the desired resource. Once open navigate to the events section. 

The Events section is where start up events are logged. If your resource is having trouble deploying, this is where you will see those errors. For pods you may see issues around pulling an image or node scheduling issues here. Issues on this side often indicated there is an issue on the resource configuration side of your deployment. Look through our troubleshooting docs to see if the error you are facing has a solution documented.

### Restart Resource

The following instructions will help you restart a deployment or a deamonset. You may only restart your deployments and deamonsets. You cannot restart individual pods and must restart the parent deployment resource. 

**Option 1:** 
1. Expand the Deployment Resource Card that you would like to restart.

2. In the top right corner you will see the three dots, click the three dots and the restart button will appear. 

**Option 2:**
1. When viewing all of the resources within your project/namespace in the Tree View of the argo dashboard find the deployment resource you would like to restart. 

2. Without expanding the resource card click the three dots. In the dropdown you will find the restart button. Click it to restart. 

### Exec into Pod

The following instructions will help you exec into a pod within your namespace.

1. Expand the specific Pod Resource Card that you would like to exec into.

2. In the top right corner you will see the three dots, click the three dots and the exec button will appear. Click the button to get into the pod! 

### Delete Resource

There is a delete button. This button will delete your selected resource. We suggest you do not click this button. According to how we have permissions set, this button should not work for you anyways! 

***Use at your own risk!***

<br />

## Argo Concepts
### Project (top level element)
[Official documentation for Argo Projects](https://argo-cd.readthedocs.io/en/stable/user-guide/projects/)

Projects provide a logical grouping of applications, which is useful when Argo CD is used by multiple teams. Projects provide the following features:
- restrict what may be deployed (trusted Git source repositories)
- restrict where apps may be deployed to (destination clusters and namespaces)
- restrict what kinds of objects may or may not be deployed (e.g. RBAC, CRDs, DaemonSets, NetworkPolicy etc...)
- defining project roles to provide application RBAC (bound to OIDC groups and/or JWT tokens)

<br /> 

Projects provide a logical separation of GitOps configuration for the following elements
* Source VCS Repositories (only EliLillyCo Github repositories are in scope)
* Destinations for resource deployment, composed of:
  * a Kubernetes cluster (only the CATS cluster where Argo is deployed is in scope)
  * a Kubernetes namespace
* Project-level Roles

### Application (belongs to one Project)
[Official documentation for Argo Applications](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#applications)

Applications provide a mapping from a declared cluster state (VCS like Github) to a Kubernetes cluster's active state. They are composed of two elements:
* Destinations for resource deployment, composed of: (same as project)
  * a Kubernetes cluster (only the CATS cluster where Argo is deployed is in scope)
  * a Kubernetes namespace
* Project the application belongs to
* Source
  * What Github repo and which branch of that repo?
  * What path to locate desired files?
  * What kind of files to bring in?
* Sync Policy
  * Defines a strategy to reconcile VCS state to live cluster state
  * Defines Argo controller behavior when resources drift apart
  * Defines the lifecycle of resources after the application is removed


### RBAC Configuration
[Official documentation for Argo RBAC](https://argo-cd.readthedocs.io/en/stable/operator-manual/rbac/#policy-csv-composition)

This section describes how the Role-Based Configuration is set up in the CATS Platform's infrastructure code. Please note that application teams do not have the ability to create custom roles but must assume one of the two prebuilt roles (`Read-Only`, `Admin`) that are offered out of the box. For transparency and an enhanced understanding we have outlined the components that make up Argo Roles below:  

* Roles: a set of roles for the project to use
  * Name: logical name of the role
  * Groups: users with these AD Groups will have access to this role
  * Policies: set of statements that map the role to actions or other groups in Argo
* Policy: an action that a role can use
  * Type: either `p` (permission) or `g` (group)
  * Grantee `<role/user/group>`: the entity that is targeted by the policy, for example: `proj:<project-name>:<role-name>`
  * [Resource](https://argo-cd.readthedocs.io/en/stable/operator-manual/rbac/#rbac-resources-and-actions): the resource targeted by the policy, either an Argo resource (`applications`) or another role (`proj:<project-name>:<role-name>`)
  * [Action](https://argo-cd.readthedocs.io/en/stable/operator-manual/rbac/#rbac-resources-and-actions): the granted action, which depends on what resource is targeted 
  * Context: where this policy can be applied
  * Grant Type: either `allow` or `deny`





