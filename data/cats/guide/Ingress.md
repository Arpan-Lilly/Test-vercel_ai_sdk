
# Ingress

An API object that manages external access to the services in a cluster, typically HTTP.

Ingress may provide load balancing, SSL termination and name-based virtual hosting.

Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. Traffic routing is controlled by rules defined on the Ingress resource.

Here is a simple example where an Ingress sends all its traffic to one Service:

![ingress diagram](/img/ingress_diagram.png)

An Ingress may be configured to give Services externally-reachable URLs, load balance traffic, terminate SSL / TLS, and offer name-based virtual hosting. An Ingress controller is responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.

An Ingress does not expose arbitrary ports or protocols. Exposing services other than HTTP and HTTPS to the internet typically uses a service of type Service.Type=NodePort or Service.Type=LoadBalancer.


## Overview

There are three types of ingress routes available on the CATS Platform

1. `apps.lrl.lilly.com` - This is a **browser based route** that allows a user to be on or off the lilly network and requires the user to authenticate upon accessing.

2. `apps-internal.lrl.lilly.com` - This is a **browser based route** that requires a user to be on the lilly network but does not force the user to authenticate. 

3. `apps-api.lrl.lilly.com` - This is a **programmatic / script based route**. If you are accessing an endpoint in CATS via a script, you will need to target this route. This route is not set up for browser based access. If you access an endpoint on this route via your browser, you will get an "invalid token" response. 

## CATS Ingress Template 
```yaml
# Define an Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: <ingress-name>
  namespace: <namespace-name>
spec:
  rules:
    - host: <ingress-host>
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: <service-name>
                port:
                  number: <service-port>

```
You need to replace the placeholder values with your desired configurations. Here's an explanation of the placeholders:

| Placeholder | Description |
|-------------|-------------|
| `<namespace-name>` | The namespace where your ingress will be created. |
| `<ingress-name>` | The name of your ingress resource. |
| `<ingress-host>` | The host/domain associated with your ingress (e.g., `example.com`). |
| `<service-name>` | The name of the service to which the ingress routes traffic. |
| `<service-port>` | The service port to which the ingress routes traffic. |



## Ingress Routes in CATS

CATS Supports three different ingress routes:
1. Authenticated route : `*.apps.lrl.lilly.com`
2. Unauthenticated route : `*.apps-internal.lrl.lilly.com`
3. Script Based Access route : `*.apps-api.lrl.lilly.com`


### Authenticated Route

For more details see Authorization section below


### Unauthenticated Route

For more details see Authorization section below


### Script Based Access Route

If users want to access data from apps hosted in CATS from a Notebook / script environment / CLI, there is a built-in way of securely providing this access.


#### How to add a API access endpoint?

In addition to the regular apps.lrl.lilly.com domain which is intended for browser based app access, CATS has a apps-api.lrl.lilly.com domain.

This domain is designed to allow programmatic access & is available only on the Lilly Network.  All the authorization "lilly groups" headers available in the main domain are available in this domain.

To configure your app, add an Ingress resource with a apps-api.lrl.lilly.com domain.


```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: example-app
  namespace: example
  annotations:
    lilly.com/security_groups: |
      [
        {
          "Route": "/",
          "ADGroups": [ "ad_group1", "ad_group2" ]
        }
      ]
spec:
  rules:
  - host: example-app.apps-api.lrl.lilly.com
    http:
      paths:
      - path: '/'
        backend:
          serviceName: example-backend-service
          servicePort: 80
```

#### How to access your API endpoint?

You can access these API endpoints using one of the client libraries.  See supported languages below.

+ [R](https://client-r.apps.lrl.lilly.com/)
+ [Python](https://client-python.apps.lrl.lilly.com/)



<br />

## Routing and Middleware

### Ingress naming conventions

For every environment (dev, qa, prd) you can have separate DNS names (`xxx.apps.lrl.lilly.com`). It is recommended to distinguish the environments by modifying the DNS names with appropriate suffixes (dev: -d, qa: -q, prd: NOTHING). So for an application `xxx` you will get `xxx-d.apps.lrl.lilly.com` in dev and `xxx.apps.lrl.lilly.com` in production.



### Custom Routing Middleware

If some specific request manipulation is required, use [middlewares](https://doc.traefik.io/traefik/middlewares/overview/). Please note how the middleware is referenced - `{middleware-namespace}-{middleware-name}@{traefik-configuration-provider}`. You can always check the [dashboard](https://traefik-dashboard.apps.lrl.lilly.com/dashboard/#/) for any potential issues.


Example Middleware that adds custom headers
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: pgadmin-header
  namespace: indigo-dev
spec:
  headers:
    customRequestHeaders:
      x-forwarded-proto: "https"
      x-forwarded-port: "443"
---
apiVersion: extensions/v1
kind: Ingress
metadata:
  name: indigo-pgadmin
  namespace: indigo-dev
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: indigo-dev-pgadmin-header@kubernetescrd
spec:
  rules:
  - host: indigo-pgadmin-d.apps.lrl.lilly.com
    http:
      paths:
      - path: '/'
        pathType: Prefix
        backend:
          service
            name: indigo-pgadmin
            port:
              number: 80
```


### Default Middleware Available

### Compression (applies gzip compression to your route)

Example definition
```yaml
apiVersion: extensions/v1
kind: Ingress
metadata:
  name: indigo-pgadmin
  namespace: indigo-dev
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: [if you have other custom middleware, they can go here],ingress-entry-compression@kubernetescrd
spec:
  rules:
  - host: indigo-pgadmin-d.apps.lrl.lilly.com
    http:
      paths:
      - path: '/'
        pathType: Prefix
        backend:
          service:
            name: indigo-pgadmin
            port:
              number: 80
```


### Rate Limit Middleware

If you would like to implement rate limiting you can do so via a middleware. 

Steps to add rate limit:

1. Create custom rate limit middleware Kubernetes resource. Full Instructions [HERE](./RateLimit.md). Simple template to get started:

```yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: ratelimit-middleware
  namespace: your-namespace-name
spec:
  rateLimit:
    average: 100
    burst: 200

```

<br />

2. Attach your new rate limit middleware resource to your ingress via the following annotation. Be sure to update the name of your middleware to match the name defined in your middleware resource created in step 1. 


```yaml
annotations:
    traefik.ingress.kubernetes.io/router.middlewares: ratelimit-middleware
```

### Redirect Middleware

If you would like to implement a traffic redirection from one host to another, you can do so via a middleware. 

Steps to add traffic host redirect:

1. Create a `Middleware` using the following template to get started:

```yaml
  apiVersion: traefik.containo.us/v1alpha1
  kind: Middleware
  metadata:
    name: userfacing-base-redirect
    namespace: <your-namespace>
  spec:
    redirectRegex:
      regex: .* # a regex pattern that matches the host(s) that you want to redirect
      replacement: https://kubecost.apps.lrl.lilly.com # the new host that you want to redirect to 
```

<br />

2. Attach your new redirect middleware resource to your ingress via the following annotation. Be sure to update the name of your middleware to match the name defined in your middleware resource created in step 1. 


```yaml
annotations:
  traefik.ingress.kubernetes.io/router.middlewares: kubecost-userfacing-base-redirect@kubernetescrd
```

## Authorization

### Authenticated Route
Authenticated Route
```yaml
apiVersion: extensions/v1
kind: Ingress
metadata:
  name: example-app
  namespace: example
  annotations:
    lilly.com/security_groups: |
      [
        {
          "Route": "/",
          "ADGroups": [ "ad_group1", "ad_group2" ]
        }
      ]
spec:
  rules:
  - host: example-app.apps.lrl.lilly.com
    http:
      paths:
      - path: '/'
        pathType: Prefix
        backend:
          service:
            name: example-backend-service
            port:
              number: 80
```

**NOTE:** See [Bouncer](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer) application for authentication/authorization implementation. In the example above see the `lilly.com/security_groups` annotation and its syntax. The group name matching is CASE SENSITIVE. 

#### Authenticated Bouncer Patterns. 

There are five different authentication patterns available for developers implementing an authenticated route. All route authentication is enabled via the [Bouncer](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer) system service. Head on over to the [Bouncer](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer) repository for more information on these different authentication patterns. 

- [Standard Web Pattern](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---standard-web-pattern-on-behalf-of-user)
- [Azure APIM and Entra ID](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---azure-apim)
- [Client Credentials](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---client-credentials)
- [On Behalf of User (API)](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---on-behalf-of-user-api)
- [AWS STS](https://github.com/EliLillyCo/LRL_light_k8s_infra_go_bouncer?tab=readme-ov-file#diagram---aws-sts)

### No Authentication

***(accessible only on Lilly Network)***

To skip authentication altogether, use the annotation below (`kubernetes.io/ingress.class: ingress-noauth`) on your Ingress. The DNS name is now `apps-internal` as opposed to just `apps`.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example
  namespace: example
  annotations:
    kubernetes.io/ingress.class: ingress-noauth
spec:
  rules:
    - host: <app name>.apps-internal.lrl.lilly.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service
                name: <service name>
                port: 
                  number: 5601
```


### Authentication with AWS Roles Ingress Routes
In some cases, users may want to leverage Bouncer's authorization of ingress routes for AWS Roles. In this case, no OAuth headers should be requested for the ingress. An example of this is available to test against in the CATS DEV cluster for the `admin-testing-<main|hybrid|onprem>` echo services ([main example](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test/blob/9c59212e05c7044c7a0df4819da931fd1e87efc8/projects/dev/admin-testing-main-dev/echo.yaml#L105-L126), [hybrid example](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test/blob/9c59212e05c7044c7a0df4819da931fd1e87efc8/projects/dev/admin-testing-hybrid-dev/echo.yaml#L115-L136), [onprem example](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps_test/blob/9c59212e05c7044c7a0df4819da931fd1e87efc8/projects/dev/admin-testing-onprem-dev/echo.yaml#L106-L127)). An example ingress is provided below:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example
  namespace: example-ns
  annotations:
    lilly.com/security_groups: '[{"Route": "/.*", "Method": "GET", "AWSRoles": ["arn:aws:sts::408787358807:role/AWSReservedSSO_aws_light_devs_be5dfdb952b1974e"], "AWSAccountIds": ["408787358807"]}]'
    lilly.com/oauth_token_headers: '{}'
spec:
  rules:
  - host: example.apps-api-d.lrl.lilly.com
    http:
      paths:
      - path: '/'
        pathType: Prefix
        backend:
          service:
            name: example-svc
            port:
              number: 80
```

In order to call such an endpoint, developers will need to implement AWS STS signing for requests sent to the endpoint. To do this, a set of signed headers must first be obtained from STS and then applied to the request submitted to the CATS-hosted endpoint. Example implementations are provided below for the CATS DEV `admin-testing-main` namespaced echo service. Developers with access to `aws_light_devs` can use this endpoint for testing. If obtaining credentials via the `aws sso login --sso-session lilly --no-browser` method, environment variables can be stashed to the current shell via:

Example `$HOME/.aws/config`:
```txt
[profile light-d-sso]
output = json
region = us-east-2
sso_session = lilly
sso_account_id = 408787358807
sso_role_name = aws_light_devs

[sso-session lilly]
sso_start_url = https://lilly-aws-login.awsapps.com/start/
sso_region = us-east-2
sso_registration_scopes = sso:account:access
```

Example command to export AWS environment variables:
```shell
eval "$(aws configure export-credentials --profile light-d-sso --format env)"
```

Python example using `LightClient` library:

```python
import json
import requests
from light_client import LIGHTClient

#DEV | QA | PROD Clusters
# PROD: LRL_Light_k8s_infra_apps
# QA: LRL_light_k8s_infra_apps_qa
# DEV: LRL_light_k8s_infra_apps_test
client = LIGHTClient(env="DEV")

url = "https://admin-testing-main-aws.apps-api-d.lrl.lilly.com/echo'"
headers = {
    "Content-Type": "application/json"
}

try:
    response = client.get(url=url, headers=headers, timeout=10)
except requests.exceptions.ConnectTimeout as e:
    response = requests.Response()
    response._content = e
    response.status_code = 503
if response.status_code != 200:
    print(response.status_code)
    print(response.json())
else:
    print(response.status_code)
    print(response.json())
```

Javascript example using `aws-sdk-v3`:
```javascript
const { HttpRequest } =             require('@aws-sdk/protocol-http');
const { SignatureV4 } =             require('@aws-sdk/signature-v4');
const { Sha256 } =                  require('@aws-crypto/sha256-universal');
const { fromEnv } =                 require('@aws-sdk/credential-provider-env');
const { fromNodeProviderChain } =   require('@aws-sdk/credential-providers');

// const credentialProvider = fromNodeProviderChain({
//   //...any input of fromEnv(), fromSSO(), fromTokenFile(), fromIni(),
//   // fromProcess(), fromInstanceMetadata(), fromContainerMetadata()
//   // Optional. Custom STS client configurations overriding the default ones.
//   clientConfig: { region: 'us-east-2' },
// });

const credentialProvider = fromEnv(
    {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
);

var sts_request = new HttpRequest({
    hostname: "sts.amazonaws.com/",
    protocol: "https:",
    body: "Action=GetCallerIdentity&Version=2011-06-15",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Host': 'sts.amazonaws.com',
    },
    method: 'POST',
  });

let credentials = credentialProvider();
credentials.then(
    (cred)=>{
        var signer = new SignatureV4({credentials: cred, region: 'us-east-1', sha256: Sha256, service: 'sts'});
        signer.sign(
            sts_request, 
            {unsignableHeaders: new Set(['x-amz-content-sha256'])}
        ).then(
            (signed_sts_request)=>{
                var headers = {
                    ...signed_sts_request.headers,
                    'User-Agent': 'javascript client example with aws-sdk-js-v3',
                }
                delete headers['Host'];
                console.log(headers)
                fetch('https://admin-testing-main-aws.apps-api-d.lrl.lilly.com/echo', {headers: headers}).then(response => {
                    if (!response.ok) {
                        throw new Error('CATS response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data:', data);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                }); 
            });
        },
    (err)=>{
        console.error(err);
    }
);
```

Javascript example using the `aws4` library:
```javascript
const AWS = require('aws-sdk');
const aws4 = require('aws4');

class LightClient {
    constructor() {
      this.headers = this.getSession();
    }
  
    /**
     * @name - getSession
     * @description - get temporary session from STS
     */
    async getSession() {
      AWS.config.update({ region: 'us-east-2' });
      const credentials = new AWS.EnvironmentCredentials('AWS');
      await credentials.getPromise();
  
      const requestData = {
        host: 'sts.amazonaws.com',
        path: '/',
        service: 'sts',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: 'Action=GetCallerIdentity&Version=2011-06-15',
      };
      const signedRequest = aws4.sign(requestData, {
        accessKeyId: credentials.accessKeyId,
        sessionToken: credentials.sessionToken,
        secretAccessKey: credentials.secretAccessKey,
      });
      return Promise.resolve(signedRequest.headers);
    }
}

async function buildHeader() {
    try {
      const ll = new LightClient();
      const authHeaders = await ll.getSession();
      return {
        'User-Agent': 'javascript client example',
        'X-Amz-Security-Token': authHeaders['X-Amz-Security-Token'],
        'X-Amz-Date': authHeaders['X-Amz-Date'],
        Authorization: authHeaders.Authorization,
      };
    } catch (error) {
      console.log('Error in buildHeader');
      console.log(error);
    }
    
}

buildHeader().then(headers => {
    console.log(headers)
    fetch('https://admin-testing-main-aws.apps-api-d.lrl.lilly.com/echo', {headers: headers}).then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response body as JSON
        })
        .then(data => {
            console.log('Data:', data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});
```


### Privileged accounts
If you need to protect your service with a privileged account access, you need to use your `-CA` accounts. Create an AD group with `-CA` account members only (e.g. `Indigo_infrastructure`).

Request to have this group added to `GAT_Private_Groups`, otherwise neither Bouncer, nor the user of MS Graph API will be able to see your group membership ([-CA accounts](https://elilillyco.stackenterprise.co/articles/481)' membership is protected, hence it is not visible by default). See RITM2885602 for details.

When accessing the protected service use a different browser to the one you use regularly (e.g. FireFox) to avoid any clashes (anonymous mode might work too) and as your email / User Principal Name (UPN) enter `systemid-CA@llynet.com` (e.g. `xh01053-CA@llynet.com`).


### Routing across multiple application (CORS avoidance) 

By default each host name defined in Ingress resources can only be used once per namespace (i.e. application). Validation of the PR will fail should one namespace want to use a host name that is being used in a different namespace.

If one application (i.e. namespace) needs to expose its api to a web UI of another (i.e. to avoid CORS issues in a browser), it needs to allow the use of its host name in a different namespace.

This is performed in `app_integrations.yml.config` file in the namespace that is permitting the use of the host name.

E.g. Indigo wants to use GeneKB's API. Two things need to happen:
1) Indigo needs to allow GeneKB to use one of Indigo's hostnames: `dev/indigo-dev/app_integrations.yml.config`

```yaml
genekb-dev:
  ingress:
    reference: allowed
    host: indigo-d.apps.lrl.lilly.com
```

2) GeneKB (`genekb-dev`) can now expose its service on Indigo's host (`indigo-d.apps.lrl.lilly.com`). Do note the use of middleware.\
**Authentication needs to be set separately to any existing Ingresses**\
See [GeneKB example](https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/tree/main/projects/dev/genekb-dev/indigo-integration.yml)


<br />

### Streamlit App Routes

When application teams are deploying a streamlit application on the CATs Platform there is a manual step required involving some additional configuration in route53 involving a CNAME record entry.

#### Streamlit Config Instructions

1. Modify the annotations field in the Ingress metadata to include traefik.ingress.kubernetes.io/router.middlewares for making socket connections and lilly.com/user_info_headers for security as shown below: 

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: <project-name>
  namespace: <namespace>
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: ingress-entry-compression@kubernetescrd
    lilly.com/user_info_headers: '[{"attribute": "name", "header": "X-USER-NAME"}, {"attribute": "email", "header": "X-USER-EMAIL"}, {"attribute": "groups", "header": "X-USER-GROUPS"}, {"attribute": "department", "header": "X-USER-DEPARTMENT"}, {"attribute": "id", "header": "X-USER-ID"}]'
```

<br />
<br />

2. Ensure to configure livenessProbe and readinessProbe for maintaining a stable socket connection. The resource allocations can be adjusted based on your application's requirements. 
<br />
Port can be according to your deployment configuration.

```yaml
spec:
  containers:
  - image: <image-name>
    name: <application-name>
    resources:
      limits:
        memory: "2Gi"
        cpu: "4.0"
      requests:
        memory: "2Gi"
        cpu: "4.0"
    ports:
    - containerPort: 8080
    livenessProbe:
      tcpSocket:
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 20
    readinessProbe:
      tcpSocket:
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 20
```
<br />
<br />

3. The Dockerfile commands below are used to prepare a Streamlit application for a production-ready solution. **Ensure to replace app.py with the correct path to your Streamlit application file**. 
<br />
Port can be according to your deployment configuration.

```dockerfile
RUN mkdir -p ~/.streamlit && echo "[browser]\ngatherUsageStats = false" > ~/.streamlit/config.toml

# Run app.py when the container launches
CMD ["python", "-m", "streamlit", "run", "--server.enableCORS", "true", "--server.enableXsrfProtection", "true", "--server.address", "0.0.0.0", "--server.port", "8080", "app.py"]
```

<br />
<br />

4. Application developers may not have the necessary permissions to modify the CNAME configuration in the CATS account. In such cases, **Please liaise with the CATS team to create a *CNAME* entry in *Route53*. This entry will enable and route WebSocket connections to the application**

> You can view a sample CNAME entry configuration in Route53 for the sub-domain: `aads-document-processing-dev.apps.lrl.lilly.com`.

Here are the details of the sample configuration:

- **Record name:** aads-document-processing-dev.apps.lrl.lilly.com
- **Record type:** CNAME
- **Value:** system-alias.apps.lrl.lilly.com
- **Alias:** No
- **TTL (seconds):** 300
- **Routing policy:** Simple

<br />
<br />

## Customizing URLs

You do have the ability to customize your solutions URL if deployed on CATS. We have many options available out of the box that should fit your use case. The patterns provided are outlined below. If the team you are developing an application for does not roll up through one of our provided patterns we are open to adding more patterns. Reach out to the CATS team to explain your proposed use case. Use cases must be reusable patterns and not domains for individual solutions. 


### Out-Of-The-Box Options

**The effort to expand the available patterns is currently on going. This section displays our current offerings.**

As you know, there are three routes in the CATS cluster. Authenticated Route, Internal Route, API route. When it comes to customizing the url you want to use for each of these routes you can use the below tables to configure your URL. We have prioritized getting the Authenticated Routes (Apps) routes prioritized and into production so that application teams have access to patterns that are more suitable for the end users. 

If you need to use an **Internal Route** or **API Route** you will need to continue using the lrl pattern until the new routes are available. 

<br />

**CURRENT OFFERINGS**

| Description                     | Domain Available         |
|---------------------------------|--------------------------|
| Lilly Research Laboratories     | lrl.lilly.com            |
| Global Services                 | gs.lilly.com             |
| Information Security            | is.lilly.com             |
| Business Unit                   | bu.lilly.com             |
| Manufacturing and Quality       | mq.lilly.com             |
| Digital Core                    | dc.lilly.com             |
| Digital Health                  | dh.lilly.com             |
| CATS Platform                   | cats.lilly.com           |
| Cortex Initiative Backend       | cortex.lilly.com         |
| Cortex Initiative Frontend      | chat.lilly.com           |


#### Lilly Research Laboratories Services
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| lrl.lilly.com        |  Authenticated    |  *.apps-d.lrl.lilly.com            |  *.apps-q.lrl.lilly.com            |  *.apps.lrl.lilly.com            |
| lrl.lilly.com        |  Un-Authenticated |  *.apps-internal-d.lrl.lilly.com   |  *.apps-internal-q.lrl.lilly.com   |  *.apps-internal.lrl.lilly.com   |
| lrl.lilly.com        |  API Route        |  *.apps-api-d.lrl.lilly.com        |  *.apps-api-q.lrl.lilly.com        |  *.apps-api.lrl.lilly.com        |

<br />

#### Global Services
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| gs.lilly.com        |  Authenticated    |  *.dev.gs.lilly.com          |  *.qa.gs.lilly.com           |  *.gs.lilly.com            |


<br />

#### Information Security
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| is.lilly.com        |  Authenticated    |  *.dev.is.lilly.com          |  *.qa.is.lilly.com           |  *.is.lilly.com            |

<br />

#### Business Units
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| bu.lilly.com        |  Authenticated    |  *.dev.bu.lilly.com          |  *.qa.bu.lilly.com           |  *.bu.lilly.com            |

<br />

#### Manufacturing and Quality 
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| mq.lilly.com        |  Authenticated    |  *.dev.mq.lilly.com          |  *.qa.mq.lilly.com           |  *.mq.lilly.com            |

<br />

#### Digital Core
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| dc.lilly.com        |  Authenticated    |  *.dev.dc.lilly.com          |  *.qa.dc.lilly.com           |  *.dc.lilly.com            |

<br />

#### Digital Health
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| dh.lilly.com        |  Authenticated    |  *.dev.dh.lilly.com          |  *.qa.dh.lilly.com           |  *.dh.lilly.com            |

<br />

#### CATS Platform Services
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| cats.lilly.com        |  Authenticated    |  *.dev.cats.lilly.com          |  *.qa.cats.lilly.com           |  *.cats.lilly.com            |

<br />

#### Cortex Platform's Backend Routes
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| cortex.lilly.com        |  Authenticated    |  *.dev.cortex.lilly.com          |  *.qa.cortex.lilly.com           |  *.cortex.lilly.com    |

<br />

#### Cortex Platform's Frontend Routes
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| chat.lilly.com        |  Authenticated    |  *.dev.chat.lilly.com          |  *.qa.chat.lilly.com           |  *.chat.lilly.com            |

<br />
<br />

---
**FUTURE OFFERINGS**

***The following information relates to development effort that is currently in progress. Once completed we will make an announcement in cats club and update our docs.***

Some of the below patterns are live in their respective environments but the tables below outline all the patterns that will be available once this effort is completed. Please see the section above for the patterns that are currently available. 

When configuring your host within your ingress resource you simply need to follow our provided patterns. See some examples below for an explanation on how customizing urls works.


<br /> 

#### Lilly Research Laboratories  

| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| lrl.lilly.com        |  Authenticated    |  *.dev.lrl.lilly.com          |  *.qa.lrl.lilly.com           |  *.lrl.lilly.com            |
| lrl.lilly.com        |  Un-Authenticated |  *.internal-d.lrl.lilly.com   |  *.internal-q.lrl.lilly.com   |  *.internal.lrl.lilly.com   |
| lrl.lilly.com        |  API Route        |  *.api-d.lrl.lilly.com        |  *.api-q.lrl.lilly.com        |  *.api.lrl.lilly.com        |

<br /> 

#### Global Services
| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| gs.lilly.com        |  Authenticated    |  *.dev.gs.lilly.com          |  *.qa.gs.lilly.com           |  *.gs.lilly.com            |
| gs.lilly.com        |  Un-Authenticated |  *.internal-d.gs.lilly.com   |  *.internal-q.gs.lilly.com   |  *.internal.gs.lilly.com   |
| gs.lilly.com        |  API Route        |  *.api-d.gs.lilly.com        |  *.api-q.gs.lilly.com        |  *.api.gs.lilly.com        |

<br /> 

#### Information Security


| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| is.lilly.com        |  Authenticated    |  *.dev.is.lilly.com          |  *.qa.is.lilly.com           |  *.is.lilly.com            |
| is.lilly.com        |  Un-Authenticated |  *.internal-d.is.lilly.com   |  *.internal-q.is.lilly.com   |  *.internal.is.lilly.com   |
| is.lilly.com        |  API Route        |  *.api-d.is.lilly.com        |  *.api-q.is.lilly.com        |  *.api.is.lilly.com        |

<br /> 

#### Business Units


| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| bu.lilly.com        |  Authenticated    |  *.dev.bu.lilly.com          |  *.qa.bu.lilly.com           |  *.bu.lilly.com            |
| bu.lilly.com        |  Un-Authenticated |  *.internal-d.bu.lilly.com   |  *.internal-q.bu.lilly.com   |  *.internal.bu.lilly.com   |
| bu.lilly.com        |  API Route        |  *.api-d.bu.lilly.com        |  *.api-q.bu.lilly.com        |  *.api.bu.lilly.com        |

<br /> 

#### Manufacturing and Quality 


| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| mq.lilly.com        |  Authenticated    |  *.dev.mq.lilly.com          |  *.qa.mq.lilly.com           |  *.mq.lilly.com            |
| mq.lilly.com        |  Un-Authenticated |  *.internal-d.mq.lilly.com   |  *.internal-q.mq.lilly.com   |  *.internal.mq.lilly.com   |
| mq.lilly.com        |  API Route        |  *.api-d.mq.lilly.com        |  *.api-q.mq.lilly.com        |  *.api.mq.lilly.com        |

<br /> 

#### Digital Core


| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| dc.lilly.com        |  Authenticated    |  *.dev.dc.lilly.com          |  *.qa.dc.lilly.com           |  *.dc.lilly.com            |
| dc.lilly.com        |  Un-Authenticated |  *.internal-d.dc.lilly.com   |  *.internal-q.dc.lilly.com   |  *.internal.dc.lilly.com   |
| dc.lilly.com        |  API Route        |  *.api-d.dc.lilly.com        |  *.api-q.dc.lilly.com        |  *.api.dc.lilly.com        |

<br /> 

#### Digital Health


| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| dh.lilly.com        |  Authenticated    |  *.dev.dh.lilly.com          |  *.qa.dh.lilly.com           |  *.dh.lilly.com            |
| dh.lilly.com        |  Un-Authenticated |  *.internal-d.dh.lilly.com   |  *.internal-q.dh.lilly.com   |  *.internal.dh.lilly.com   |
| dh.lilly.com        |  API Route        |  *.api-d.dh.lilly.com        |  *.api-q.dh.lilly.com        |  *.api.dh.lilly.com        |

<br /> 

#### CATS Platform Services


| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| cats.lilly.com        |  Authenticated    |  *.dev.cats.lilly.com          |  *.qa.cats.lilly.com           |  *.cats.lilly.com            |
| cats.lilly.com        |  Un-Authenticated |  *.internal-d.cats.lilly.com   |  *.internal-q.cats.lilly.com   |  *.internal.cats.lilly.com   |
| cats.lilly.com        |  API Route        |  *.api-d.cats.lilly.com        |  *.api-q.cats.lilly.com        |  *.api.cats.lilly.com        |

<br /> 

#### Cortex Platform's Backend Routes


| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| cortex.lilly.com        |  Authenticated    |  *.dev.cortex.lilly.com          |  *.qa.cortex.lilly.com           |  *.cortex.lilly.com            |
| cortex.lilly.com        |  Un-Authenticated |  *.internal-d.cortex.lilly.com   |  *.internal-q.cortex.lilly.com   |  *.internal.cortex.lilly.com   |
| cortex.lilly.com        |  API Route        |  *.api-d.cortex.lilly.com        |  *.api-q.cortex.lilly.com        |  *.api.cortex.lilly.com        |
| cortex.lilly.com        |  API Route        |  api.dev.cortex.lilly.com        |  api.qa.cortex.lilly.com        |  api.cortex.lilly.com        |

<br /> 

#### Cortex Platform's Frontend Routes


| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| chat.lilly.com        |  Authenticated    |  *.dev.chat.lilly.com          |  *.qa.chat.lilly.com           |  *.chat.lilly.com            |
| chat.lilly.com        |  Un-Authenticated |  *.internal-d.chat.lilly.com   |  *.internal-q.chat.lilly.com   |  *.internal.chat.lilly.com   |
| chat.lilly.com        |  API Route        |  *.api-d.chat.lilly.com        |  *.api-q.chat.lilly.com        |  *.api.chat.lilly.com        |

<br /> 

#### VaHub 


| top domain           |  Route            |        DEV                    |        QA                     |              PROD           |
|----------------------|-------------------|-------------------------------|-------------------------------|-----------------------------|
| apps.vahub.lilly.com        |  Authenticated    |  *.dev.apps.vahub.lilly.com          |  *.qa.apps.vahub.lilly.com           |  *.apps.vahub.lilly.com            |
| apps.vahub.lilly.com        |  Un-Authenticated |  *.internal-d.apps.vahub.lilly.com   |  *.internal-q.apps.vahub.lilly.com   |  *.internal.apps.vahub.lilly.com   |
| apps.vahub.lilly.com        |  API Route        |  *.api-d.apps.vahub.lilly.com        |  *.api-q.apps.vahub.lilly.com        |  *.api.apps.vahub.lilly.com        |

### Request New Custom Domain 

If the team you are developing an application for does not roll up through one of our provided patterns we are open to adding more patterns. Reach out to the CATS team to explain your proposed use case. Use cases must be reusable patterns and not domains for individual solutions. 

1. Reach out to a member of the CATS platform team with the domain you would like created. He will then create a new Route53 Hosted-Zone and provide you with four nameservers.

2. The Requestor will submit this service request, [Telecom DDI - Global Zones and Delegated Zones](https://lilly.service-now.com/ess/view_content_search.do?v=1&uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3Dd010f3f20fcf790028ed6509b1050e52%26sysparm_link_parent%3Dc0aafa126f431500fe289be44b3ee409%26sysparm_catalog%3De0d08b13c3330100c8b837659bba8fb4&sysparm_document_key=sc_cat_item,d010f3f20fcf790028ed6509b1050e52), utilizing the nameservers provided by the platform team. 

3. Once completed and approved please let the Platform Team know and we will do some backend work to enable the new domain! 


