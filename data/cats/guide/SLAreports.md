# SLA Reports

Below are detailed uptime metrics for each CATS environment, including outage dates and times, the core functionalities impacted, and additional relevant information.

## Uptime Metrics 2025

- Total PRD Downtime: 10 Min
- PRD Uptime Percentage: 99.999%

## Monthly Production Report

| Month        |      Date    | Outage Time                                              | Priority LVL  | SNOW ID   | Core Functionality Impacted    | Outage Details |
|--------------|--------------|----------------------------------------------------------|---------------|-----------|--------------------------------|----------------|
| January      | 22           | 9:52&nbsp;AM&nbsp;EST&nbsp;-&nbsp;10:02&nbsp;AM&nbsp;EST | P1            | N/A       |External&nbsp;Auth&nbsp;Route   | We experienced a temporary issue with the CATS platform related to all external authentication routes today from 9:52 AM EST to 10:02 AM EST. This issue occurred due to the Bouncer External Authentication Service being unintentionally deleted and replaced during a sync operation we executed in the Argo Dashboard. We initially believed this action would be a “graceful restart” with no downtime. However, we have now learned that the sync and replace process deletes the existing component before recreating it, leading to a brief service disruption. Upon identifying the problem, we manually recreated the Bouncer service to restore functionality as quickly as possible. To prevent a recurrence, we are implementing measures to disable the “replace” option during syncs to ensure uninterrupted service. |
| January      | ----         | -----                                                     | -----        |  ----      |  ----                         | -----         |


## Quarterly QA Report

| Quarter      |      Date    | Outage Time                                              | Priority LVL  | SNOW ID   | Core Functionality Impacted    | Outage Details |
|--------------|--------------|----------------------------------------------------------|---------------|-----------|--------------------------------|----------------|
| One          | -----        | -----                                                    | -----         | -----     | -----                          |  ----          |
| Two          | -----        | -----                                                    | -----         | -----     | -----                          |  ----          |
| Three        | -----        | -----                                                    | -----         | -----     | -----                          |  ----          |
| Four         | -----        | -----                                                    | -----         | -----     | -----                          |  ----          |


## Quarterly DEV Report

| Quarter      |      Date    | Outage Time                                              | Priority LVL  | SNOW ID   | Core Functionality Impacted    | Outage Details |
|--------------|--------------|----------------------------------------------------------|---------------|-----------|--------------------------------|----------------|
| One          | -----        | -----                                                    | -----         | -----     | -----                          |  ----          |
| Two          | -----        | -----                                                    | -----         | -----     | -----                          |  ----          |
| Three        | -----        | -----                                                    | -----         | -----     | -----                          |  ----          |
| Four         | -----        | -----                                                    | -----         | -----     | -----                          |  ----          |