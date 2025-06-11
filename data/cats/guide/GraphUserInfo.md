# Graph User Info 

Graph User Info is information about a user that is stored and accessible through a Graph API, such as the Microsoft Graph API or any other graph-based data structure or service. Graph APIs are designed to provide a comprehensive and relational way to interact with a network of data, entities, and their interconnections, often used within platforms like social networks, directory services, and organizational data systems.


## Builtin Graph User Info Integration 

As Authentication & Authorization are first class platform constructs, basic User info
is also available to all apps hosted in the platform as a native integration.

The way this works is, you can add annotations to your app ingress resources which will
tell the platform to inject headers into each request to your app with the information
of the requesting user.



## User Info Headers 

The main way this can be done is with the ```lilly.com/user_info_headers```.

The value of the annotation is a json list of headers to pass to your app.  Each
header config is as follows ```{"attribute": "{user info attribute}", "header": "{header sent in requests to your app with the value of the user info attribute specified}"}```

The following user info attributes are allowed:

| User Info Attribute | Description | 
| :--- | :--- |
| id | Lilly System ID (e.g. c233707) |
| title | Position Title (e.g. Sr. Developer) |
| department | Lilly Department (e.g. Research IT) |
| groups | A comma separated list of the users's AD groups (e.g. group1,A second group,AnotherGroup) |
| name | Display Name. User's full name given + surname (e.g. Nathan Morin) |
| email | User's email address (e.g. morin_nathan_a@lilly.com) |

**NOTE:** In your ingress configuration, array values within the annotations MUST be enclosed in single quotes if they are single-line strings.

Example config below:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: myapp-dev
  namespace: myapp-dev
  annotations:
    lilly.com/user_info_headers: '[{"attribute": "id", "header": "X-WEBAUTH-USER"}, {"attribute": "name", "header": "X-USER-NAME"}, {"attribute": "email", "header": "X-WEBAUTH-EMAIL"}, {"attribute": "groups", "header": "X-WEBAUTH-GROUPS"}]'
spec:
  rules:
  - host: example-app.apps.lrl.lilly.com
    http:
      paths:
      ... your backend ...
```


## How to Request OAuth Token
To access the OAuth Bearer Token of the logged-in user, add the following annotation to your ingress configuration for both your frontend and backend:
#### Example of ingress.yml for frontend
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nalo-ai-chat-frontend-app
  namespace: nalo-ai-chat-dev
  annotations:
    lilly.com/security_groups: |
      [
        {
          "Route": "/",
          "ADGroups": [ "NALO_AI_Chat_Bot" ]
        }
      ]
    lilly.com/oauth_token_headers: '{"cats-app-auth": "self"}' # This annotation will allow the application to include the OAuth Token of the authenticated user in the Headers of the application URL that can retrieved with logic in the application.
    traefik.ingress.kubernetes.io/router.middlewares: ingress-entry-compression@kubernetescrd
    lilly.com/user_info_headers: '[{"attribute": "name", "header": "X-USER-NAME"}, {"attribute": "email", "header": "X-USER-EMAIL"}, {"attribute": "groups", "header": "X-USER-GROUPS"}, {"attribute": "department", "header": "X-USER-DEPARTMENT"}, {"attribute": "id", "header": "X-USER-ID"}]'
spec:
  rules:
    - host: nalo-ai-chat-dev.mq.lilly.com
      http:
        paths:
          - path: "/"
            pathType: Prefix
            backend:
              service:
                name: nalo-ai-chat-frontend-app
                port:
                  number: 8501
```

#### Example Ingress configuration for a FastAPI backend, including the ```cats-app-auth``` header to ensure the ```/docs``` page functions correctly:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nalo-ai-chat-backend-docs
  namespace: nalo-ai-chat-dev
  annotations:
    lilly.com/oauth_token_headers: '{"cats-app-auth": "self"}'
spec:
  rules:
  - host: nalo-ai-chat-backend-dev.mq.lilly.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nalo-ai-chat-backend
            port:
              number: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nalo-ai-chat-backend-api
  namespace: nalo-ai-chat-dev
  annotations:
    lilly.com/oauth_token_headers: '{"cats-app-auth": "self"}'
spec:
  rules:
  - host: nalo-ai-chat-backend-d.apps-api.lrl.lilly.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nalo-ai-chat-backend
            port:
              number: 8080
```

## Retrieving Headers
To retrieve these headers within a streamlit application run the following line:
```python
headers = _get_websocket_headers()
```

The headers should look something like this:
```Json
{
  "Host": "nalo-ai-chat-dev.apps.lrl.lilly.com",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Cats-App-Auth": "<Auth Token>",
  "Connection": "Upgrade",
  "Cookie": "_ga_TS73L2KX2T=GS1.1.1719493790.1.1.1719495178.0.0.0; _ga_C7J840KQ0S=GS1.1.1720807459.1.0.1720807502.0.0.0; _gid=GA1.2.1089996773.1721046313; _ga_WKTRG6FDF2=GS1.1.1721148600.41.1.1721148619.41.0.0; _ga=GA1.1.1545315391.1719358932; _ga_F4QPGPB1JD=GS1.1.1721165301.17.1.1721165305.0.0.0;",
  "Origin": "https://nalo-ai-chat-dev.apps.lrl.lilly.com",
  "Pragma": "no-cache",
  "Sec-Websocket-Extensions": "permessage-deflate; client_max_window_bits",
  "Sec-Websocket-Key": "+Xw37oq+yAJlEYIsJ5eeAA==",
  "Sec-Websocket-Protocol": "streamlit, PLACEHOLDER_AUTH_TOKEN",
  "Sec-Websocket-Version": "13",
  "Upgrade": "websocket",
  "X-Amzn-Oidc-Accesstoken": "<Auth Token>",
  "X-Amzn-Trace-Id": "Root=1-6696ec2c-0bc0cdfe36eb784c7f18cf12",
  "X-Forwarded-For": "40.36.4.112, 10.121.223.83, 10.121.235.77",
  "X-Forwarded-Host": "nalo-ai-chat-dev.apps.lrl.lilly.com",
  "X-Forwarded-Port": "443",
  "X-Forwarded-Proto": "https",
  "X-Forwarded-Server": "traefik-ingress-controller-5f8d7b65c8-82f8n",
  "X-Real-Ip": "10.121.235.77",
  "X-User-Department": "GSP and NALO Tech@Lilly",
  "X-User-Email": "nikhilanand.dhoka@lilly.com",
  "X-User-Groups": "Microsoft365_Licensing_Copilot,_IAM_USE_ONLY-Employees,aws_nalo_read,CA_Rings_NewAccounts,FIM_MDM_PRD_INTUNE_AS_PRIMARY,IAM_AAD_StagedRollout_Standard,CertAE,Lilly_Employees,OPSD_General_User,FIM_MDM_PRD_AW_ManagedUsers,ProofPoint-PSATv2 ...",
  "X-User-Id": "L074473",
  "X-User-Name": "Nikhil Anand Dhoka"
}
```

To retrieve the OAuth Token, run the following command:
```python
auth_token = headers.get("Cats-App-Auth")
```

## Calling Cortex API

To call the Cortex API within your application on CATS, follow these steps:

1. Retrieve the OAuth Token as outlined [above](#retrieving-headers).

2. If your frontend retrieves this token from the header, send the OAuth Token to the backend before hitting the Cortex API. Example of Calling backend from Streamlit Application:
   ```python
   url = f"http://nalo-ai-chat-backend:8080/sendQuery" #The url for your backend be constructed via following pattern: http:/<Backend Service Name>:<Port on which the service is running>/sendQuery
   rq = requests.Session()
   response = rq.post(url, data=data, headers={"auth-token": auth_token})
   ```

3. On the backend, retrieve this bearer token to call the Cortex API. FAST API example:
   ```python
   from fastapi import Request, Form
   import requests

   @app.post("/sendQuery")
   async def send_query(request: Request, query: str = Form(...), chatThreadSessionId: str = Form(...), modelConfig: str = Form(...)):
       auth_token = request.headers.get('auth-token')
       CORTEX_BASE = "https://api.cortex.lilly.com"
       rq = requests.Session()
       MODELS = {
           "gpt4-turbo": {
               "model_class": "lilly-openai",
               "model_iteration": 4
           }
       }
       params = MODELS.get("gpt4-turbo")
       json_data = {
           "q": query,
           "model_session_id_param": chatThreadSessionId,
           "stream": False
       }
       result = rq.post(f"{CORTEX_BASE}/ask/{modelConfig}", params=params, json=json_data, headers={"Authorization": f'{auth_token}'})
   ```
