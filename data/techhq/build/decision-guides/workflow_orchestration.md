---
hide_table_of_contents: true
tags:
  - decision-guide
  - workflow-and-orchestration
---

# Workflow & Orchestration

:::info Guide Status

- Lifecycle: Living Document
- Last Update: 2025-04-04
- Capability Leads: Sumit Bhardwaj, Alex Wasik
- EBA Lead: Greg Graf
- Contributors & Reviewers:

:::

A decision guide with common automation use cases for Workflow and Orchestration, using services that can handle up to
Red Lilly information.

Workflow and ochestration technologies enable automation of business processes, system integrations, and task management
across the enterprise. Our approach aligns technologies to specific use cases based on complexity, scale, and
requirements.

## Key Areas

- **Task Automation**: Focuses on automating discrete, repeatable tasks to improve efficiency and reduce manual effort
- **Business Process Automation (BPA)**: Coordinates multiple tasks into complete business processes with defined
  workflows
- **System Orchestration**: Manages interactions between multiple systems and services in a cohesive flow

| Use Case                                                                  | Complexity[^1] | Tech Recommendation        | Description                                                                                                          | Integrations & Interop[^2]                                     | Owning Org/Team                                      | Next Step                                                                                                       |
| ------------------------------------------------------------------------- | -------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Task Based / Orchestration / Business Process Automation, Low Complexity  | 2              | PowerAutomate              | Low Complexity, Small User Base, Short Running Tasks, Low Code/No Code, Low UI Customization                         | Pre-made built-in connectors                                   | [Enterprise Automation](https://automate.lilly.com/) | [Submit Request](https://collab.lilly.com/sites/AutomationEnablementTeam/SitePages/Automation-Intake-Form.aspx) |
| Orchestration/Choreography, Low Complexity                                | 3              | Automation Anywhere        | Small Scale Single System Orchestration, Low Complexity, Small User Base, Short Running Processes                    | Generic platform-provided connectors                           | [Enterprise Automation](https://automate.lilly.com/) | [Submit Request](https://collab.lilly.com/sites/AutomationEnablementTeam/SitePages/Automation-Intake-Form.aspx) |
| RPA, Business Process Automation, Any Complexity                          | 3              | AWS Lambda & StepFunctions | Any Complexity, Short Running Processes, Large User Base, High UI Customization, Full Custom Development Required    | Self-provided connectors                                       | [Enterprise Automation](https://automate.lilly.com/) | [Submit Request](https://collab.lilly.com/sites/AutomationEnablementTeam/SitePages/Automation-Intake-Form.aspx) |
| Pro Code Business Process Orchestration, High Complexity                  | 4              | Temporal                   | Pro Code High Complexity, Long Running Workflows, Small User Base, High UI Customization                             | Generic platform-provided connectors                           | [Enterprise Automation](https://automate.lilly.com/) | [Submit Request](https://collab.lilly.com/sites/AutomationEnablementTeam/SitePages/Automation-Intake-Form.aspx) |
| Task Based / Orchestration / Business Process Automation, High Complexity | 4              | IBM BAW                    | High Complexity, Large Scale, Long Running Multi System Tasks/Orchestrations, Large User Base, High UI Customization | Self-provided connectors, legacy system integrations available | [Enterprise Automation](https://automate.lilly.com/) | [Submit Request](https://collab.lilly.com/sites/AutomationEnablementTeam/SitePages/Automation-Intake-Form.aspx) |

[^1]: (0) Ready-to-use, (1) Configurable, (2) Customizable, (3) Requires integration, (4) High-complexity

[^2]: Only the most significant integrations & interoperability are listed.
