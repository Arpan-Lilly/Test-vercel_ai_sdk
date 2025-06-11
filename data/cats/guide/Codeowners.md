# CODEOWNERS

[Official GitHub CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

You can use a CODEOWNERS file to define individuals or teams that are responsible for code in a repository.

The people you choose as code owners must have write permissions for the repository. When the code owner is a team, that team must be visible and it must have write permissions, even if all the individual members of the team already have write permissions directly, through organization membership, or through another team membership.

Code owners are automatically requested for review when someone opens a pull request that modifies code that they own. Code owners are not automatically requested to review draft pull requests.

## Using CODEOWNERS with CATS

In the Infra_Apps repository, the `dev` folder is open for anyone to approve pull requests, unless editing restricted files. First time additions to the `qa` and `prd` folders by default require an approval by an administrator of this GitHub repository.  This qa/prd approval can be delegated for individual app directories to an app Github team that has approval to merge changes to an individual app(s) [Code Owners](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/about-code-owners).

Location of [CODEOWNERS](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/blob/main/CODEOWNERS) file in infra_apps repo.

<br />

**CODEOWNERS File Example:**
```yaml
# Global Code Owners (changes must be approved by this group)
* @EliLillyCo/lrl_light_infra_approvers

projects/prd/   @EliLillyCo/lrl_light_infra_approvers
projects/qa/   @EliLillyCo/lrl_light_infra_approvers
projects/dev/   @EliLillyCo/lrl_light_k8s_infra_write
projects/system_services/   @EliLillyCo/lrl_light_infra_approvers
.github/   @EliLillyCo/lrl_light_infra_approvers
CODEOWNERS @EliLillyCo/lrl_light_infra_approvers

# Backstage specific
/projects/dev/backstage-dev/ @EliLillyCo/gis-eip-backstagepilot-admin
/projects/qa/backstage-qa/ @EliLillyCo/gis-eip-backstagepilot-admin
/projects/prd/backstage-prd/ @EliLillyCo/gis-eip-backstagepilot-admin
```

In the above code block you can see that approvals on specific files and locations are locked down. Only the groups designated can approve changes on the designated locations or file. From here you can see which files and locations require approvals from lrl_light_infra_approvers (CATS Platform Team).

<br />

**How To Update CODEOWNERS**:

1. Ensure you have a github group that can be used for approvals on your namespaces code. 
2. Draft a change to the CODEOWNERS file that follows the provided pattern. Replace `<your-namespace>` with the namespace you have defined. Replace `<your-group-name>` with the name of the group you want to delegate your approvals to.

    ```yaml
    # Your Project Name
    /projects/dev/<your-namespace>-dev/ @EliLillyCo/<your-group-name>
    /projects/qa/<your-namespace>-qa/ @EliLillyCo/<your-group-name>
    /projects/prd/<your-namespace>-prd/ @EliLillyCo/<your-group-name>
    ```
3. Raise a Pull Request. The lrl_light_infra_approvers group will be automatically assigned as approvers on your PR. There will be an error on your PR that says your file is not valid. Ignore this error as someone in the lrl_light_infra_approvers group will add the group you specified in `<your-group-name>` to the repository with "write" access. 
4. After both the approval is granted and the designated group is added with write access the error will go away and you will be free to merge the PR. 