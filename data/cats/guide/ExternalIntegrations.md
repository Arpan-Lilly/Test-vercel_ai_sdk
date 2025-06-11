# External Integrations 

Integrating with External AWS Accounts is possible. See our examples below.


## Research Data & EDB API (DWS) 

Research Data & EDB APIs can always be accessed from app backends by passing the ```Lilly-Authorization``` header provided by CATS with every request to the Research Data & EDB APIs in the ```Authorization``` header.

If your app has no backend or you would rather call these APIs directly from the frontend, CATS has a direct integration with these APIs.

Each app has a reserved path `_apps_system` which is used for system APIs.  

Within this reserved path is the Research Data & EDB API integration `https://<YOUR APP HOST>/_apps_system/researchdata/prd/<API PATH>`

E.g. https://indigo-d.apps.lrl.lilly.com/_apps_system/researchdata/prd/chembl/v3.0/version
The request will be proxied to https://api.data.lrl.lilly.com/chembl/v3.0/version with the current users credentials.

This is achieved by Bouncer service: https://github.com/EliLillyCo/LRL_light_k8s_infra_bouncer/blob/main/routes/researchData.js


<br />

## Legacy Heroku Pattern

CATS runs within the VPC of an AWS DX account and is therefore an endpoint on Lilly's private network. See the below table to understand how each CATS Cluster maps to an AWS Account and how each AWS Account maps to a VPC. 

|Cluster | App Deployment Repo | AWS Account Name | AWS Account ID |  VPC Access |
|--------------------|--------------------------------------------------------------------------------|-------------------------------------|--------------|------------------------|
|Production Cluster  | [infra_apps](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps)           | prod-igw-dx-researchit-light        | 283234040926 | vpc-03bee17f69c9802b9 |
|QA Cluster          | [infra_apps_qa](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_qa)     | qa-igw-dx-researchit-light          | 474366589702 | vpc-058757a9c034d181c |
|Development Cluster | [infra_apps_test](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test) | dev-igw-dx-researchit-light         | 408787358807 | vpc-069388414a9f87f40 |


**Heroku is external to Lilly and therefore can't reach CATS.** 

When deploying routes on the apps-api route in cats (example: aads-edb-fapi-qa.apps-api-q.lrl.lilly.com) this route is an RFC 1918 10.x private IP that isn't routable on the public Internet.

You can have a public-Internet facing endpoint published for your API in [Enterprise Data's Azure API Management service](https://collab.lilly.com/sites/ApiManagement), allowing your app to reach your APIs with Cybersecurity-approved controls for the public Internet via the Lilly private network bridge.

<br />

## Cross AWS Account Resource connections

See documentation [here](/guide/ExternalResourceConnection) on connecting to AWS resources that are housed in a non-CATS AWS account. 

<br />



