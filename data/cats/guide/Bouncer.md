# **Bouncer : Authentication Service**:

Secure your applications with Bouncer, providing robust authentication services to safeguard access.

Bouncer is authorization service that uses Microsoft Graph & K8s to provide easy authorization for microservice applications. All documentation around bouncer and how it works is located within the bouncer repository itself. 

- Bouncer Repository Source Code located: [HERE](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer)


<br />

## Authenticated Patterns

There are five different authentication patterns available for developers implementing an authenticated route. All route authentication is enabled via the [Bouncer](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer) system service. Head on over to the [Bouncer](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer) repository for more information on these different authentication patterns. 

- [Standard Web Pattern](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---standard-web-pattern-on-behalf-of-user)
- [Azure APIM and Entra ID](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---azure-apim)
- [Client Credentials](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---client-credentials)
- [On Behalf of User (API)](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---on-behalf-of-user-api)
- [AWS STS](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---aws-sts)

## Using Bouncer with Entra ID and Azure APIM

Application teams can use bouncer to pass Entra ID tokens. Please see full instructions and documentation on how to implement this pattern by navigating to the [README.md](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#azure-ad-setup) on the bouncer repository. 

## Bouncer Logs

Logs from bouncer are stored in AWS CloudWatch and can be referenced and searched. See below details for the logs location and query instructions. 

### Logs Location

Some users may want to query the Bouncer Service's logs during troubleshooting. To find the logs you will require having a [CA account](https://elilillyco.stackenterprise.co/articles/481).

1. Log into the Cluster you want to get the logs from. Dev / QA / PRD
2. Navigate to the S3 service page
3. Go to Buckets
4. Go to the correct bucket that has the `bouncer-access-logs` prefix. In Dev Cluster the bucket is `lly-light-access-logs-dev`
5. Navigate to the `bouncer-access-logs` prefix.
6. Navigate to the year you are targeting
7. Navigate to the month in that year you are targeting
8. Navigate to the day in that month you are targeting

If you want to get meaningful information from these logs you will need to run Athena queries against them.

### Query Against Bouncer Logs

Note: For Extensive Documentation on how to use Amazon Athena you can go here: https://docs.aws.amazon.com/athena/latest/ug/getting-started.html

1. To execute queries against the bouncer logs you will need to navigate to the AWS Service "Amazon Athena" 

2. Once there you will see the Query Editor

3. Before you run your first query, you need to set up a query result location in Amazon S3.

4. For Data Source you will select `AwsDataCatalog`

5. For database you will select `cats_access_logs`

6. Now you can write your Query via SQL