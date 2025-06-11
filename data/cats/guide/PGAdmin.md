
# PGAdmin 

pgAdmin is an open-source, web-based administration and development platform for PostgreSQL, the advanced open-source relational database system. It provides a graphical interface that allows database administrators and developers to interact with PostgreSQL databases through their browser. With pgAdmin, users can manage, maintain, and monitor PostgreSQL databases from anywhere, without the need for command-line tools.


## Option 1 

The same credentials used by your CATS application to connect to your database (DB) can also be used in the PGAdmin app running here: http://pgadmin.apps.lrl.lilly.com/


### Expectation 
If you follow this guide you will be able to go to http://pgadmin.apps.lrl.lilly.com/ and automatically log in to a a PGAdmin session connected to one or more database servers.


### Get AD group access for your users 
Users must belong to one of the AD groups found in the ingress defined in LRL_light_k8s_infra_apps/projects/system_services/pgadmin.yml.


### Configure pgadmin.yml 
Connecting PGAdmin to your DB requires some configuration under the db_access_rules of the ConfigMap: LRL_light_k8s_infra_apps/projects/system_services/pgadmin.yml. To create a new connection from PGAdmin to your DB you need to get your application's namespace, your Kubernetes secret, and your secret keys. You will also need a list of user emails that you want to grant access to the database.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: db-config
  namespace: db-management-prd
data:  
  db-config.yaml: |
    db_access_rules:
    - namespace: <app-namespace>
      secret: <secret-name>
      fields:
        user: <user-key>
        password: <password-key>
        host: <host-key>
        port: <port-key>
        database: <database-name-key>
      users:
      - user1@lilly.com
      - user2@lilly.com
```


## Option 2 

***This option is used to run your own PGAdmin instance in your namespace, using an AD Group for authentication.***

### Replace angle brackets and variable names with corresponding values in the template, below.

| Variable | Description | Occurrences  |
| :----- | :-----------| ------: |
| <b>&lt;namespace-name></b> | Your namespace name. | 6 |
| <b>&lt;server-name></b> | The name you want your databases listed under in the Servers group.  | 1 |
| <b>&lt;pod-name></b> | The name you want to give your pod. | 7 |
| <b>&lt;rds-secret-name></b> | The name you assigned under writeConnectionSecretToRef for your RDS instance. | 4 |
| <b>&lt;email-address-for-login></b> | Email address used for web UI login. | 1 |
| <b>&lt;password-for-login></b> | Assigns a default password for web UI login. | 1 |
| <b>&lt;container-name></b> | A name for the PGAdmin container in your pod. | 1 |
| <b>&lt;modified-login-email></b> | This is the same email address provided above with the '@' replaced by a '_'. | 3 |
| <b>&lt;AD-group-name></b> | The name of the AD group with all approved users to give access to the ingress URL. | 1 |
| <b>&lt;unique-subdomain></b> | DNS safe subdomain that will precede .apps.lrl.lilly.com in the ingress URL. | 1 |

*** Tip: Use find and replace to make sure all values are filled out
<br /><br />
Place this file in your namespace's folder with your other configuration files. You can make changes to some of the other variables in the template, below, but the variables above should be the only ones required. This template assumes you used Crossplane in your namespace to create you RDS Instance and your credentials are saved as a K8s secret in your namespace.
<br /><br />
Once your pod is running, visit your ingress address and log in using the email address and password for login you provided. You RDS databases should be listed and you should not be prompted for a password. If/when your database password is rotated, delete your pod and recreate it. This should update the password based on the updated secret.
<br /><br />
Only users in the AD Group will be able to access the URL. All others will see a 404 message. All users will need to use the email address and password in the config file to access PGAdmin unless individual user accounts are created using the admin account.
<br /><br />
See [example here] (https://github.com/EliLillyCo/LRL_light_k8s_infra_apps/blob/main/projects/dev/backstage-dev/pgadmin.yaml)


### Template 

`projects/\<env>/\<namespace>/pgadmin.yaml`

Template:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
 name: pgadmin-config
 namespace: <namespace-name> # first of 6 replacements of <namespace-name>
data:
  # change the MaintenanceDB if you have provided a different value when creating your RDS Instance
  # contains the only replacement of <server-name>
  temp-servers.json: |
    {
      "Servers": {
        "1": {
          "Name": "<server-name>",
          "Group": "Servers",
          "Port": $PORT,
          "Username": "$USER",
          "Host": "$HOST",
          "SSLMode": "prefer",
          "MaintenanceDB": "postgres",
          "PassFile": "/.pgpass"
        }
      }
    }
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: <pod-name> # first of 7 replacements of <pod-name>
  namespace: <namespace-name>
  annotations:
    wave.pusher.com/update-on-config-change: "true"
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: <pod-name>
  template:
    metadata:
      labels:
        app.kubernetes.io/name: <pod-name>
        app.lrl.lilly.com/compute: serverless
    spec:
      initContainers:
      - args:
        - sh
        - -c
        - cat /temp-config/temp-servers.json | envsubst > /config/servers.json
        image: bhgedigital/envsubst:latest # this image needs added to Artifactory and the image updated here
        name: envsubst
        env:
          - name: PORT
            valueFrom:
              secretKeyRef:
                name: <rds-secret-name> # first of 4 replacements of <rds-secret-name>
                key: port
          - name: USER
            valueFrom:
              secretKeyRef:
                name: <rds-secret-name>
                key: username
          - name: HOST
            valueFrom:
              secretKeyRef:
                name: <rds-secret-name>
                key: endpoint
        volumeMounts:
        - mountPath: "/temp-config"
          name: temp-storage
          readOnly: true
        - mountPath: "/config"
          name: configuration
          readOnly: false
      containers:
      - name: <container-name> # the only replacement of <container-name>
        image: elilillyco-lilly-docker.jfrog.io/dpage/pgadmin4:6.17
        ports:
        - containerPort: 80
        env:
        - name: PGADMIN_CONFIG_ENHANCED_COOKIE_PROTECTION 
          value: "False"
        - name: PGADMIN_SERVER_JSON_FILE
          value: "/config/servers.json"
        - name: PGADMIN_DEFAULT_EMAIL 
          value: <email-address-for-login> # only replacement of <email-address-for-login>
        - name: PGADMIN_DEFAULT_PASSWORD 
          value: <password-for-login> # only replacement of <password-for-login>
          # adjust the variable below for session duration, in days, to avoid having to login to the web portal each time
          # you will still be authenticated through AD
          # this appears to be saved as a cookie and is per-browser, not per user. default is 1 day.
        - name: PGADMIN_CONFIG_SESSION_EXPIRATION_TIME 
          value: "1"
        envFrom:
        - prefix: "rds_"
          secretRef:
            name: <rds-secret-name>
        resources:
          limits:
            memory: "0.5Gi"
            cpu: "0.25"
          requests:
            memory: "0.5Gi"
            cpu: "0.25"
        lifecycle:
          postStart:
            exec:
              # the <modified-login-email> used in this section requires '@' in <email-address-for-login> to be replaced with '_', i.e. 'user@domain.com' becomes 'user_domain.com'
              # all three replacements of <modified-login-email> are in this command
              command:
                - "/bin/sh"
                - "-c"
                - |                  
                  mkdir -p /var/lib/pgadmin/storage/<modified-login-email>;
                  echo "${rds_endpoint}:${rds_port}:*:${rds_username}:${rds_password}" > /var/lib/pgadmin/storage/<modified-login-email>/.pgpass;
                  chmod 600 /var/lib/pgadmin/storage/<modified-login-email>/.pgpass;
        volumeMounts:
          - name: configuration
            mountPath: "/config"
            readOnly: false
      volumes:
        - name: temp-storage
          configMap:
            name: pgadmin-config
        - name: configuration
          emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: <pod-name>
  namespace: <namespace-name>
spec:
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  type: ClusterIP
  selector:
    app.kubernetes.io/name: <pod-name>
---
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: pgadmin-header
  namespace: <namespace-name>
spec:
  headers:
    customRequestHeaders:
      x-forwarded-proto: "https"
      x-forwarded-port: "443"
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: <pod-name>
  namespace: <namespace-name>
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: <namespace-name>-pgadmin-header@kubernetescrd
    lilly.com/user_info_headers: '[{"attribute": "email", "header": "X-Forwarded-User"}]'
    # contains the only replacement of <AD-group-name>
    lilly.com/security_groups: |
      [
        {
          "Route": "/.*",
          "ADGroups": [ "<AD-group-name>" ]
        }
      ]
spec:
  rules:
  # the only replacement of <unique-subdomain>
  - host: <unique-subdomain>.apps.lrl.lilly.com # i.e. namespace-pgadmin.apps.lrl.lilly.com
    http:
      paths:
      - path: '/'
        pathType: Prefix
        backend:
          service:
            name: <pod-name>
            port:
              number: 80
```

<br />
