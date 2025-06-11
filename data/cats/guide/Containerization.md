# Containerization and Dockerfiles

Containerization is a lightweight, efficient form of virtualization. It allows you to package your application and its dependencies into a 'container' that can run consistently across any environment. This process eliminates the "it works on my machine" problem by providing a clear separation between your application and the underlying system. Containers are portable, easy to deploy, and less resource-intensive compared to traditional virtual machines.

For example, to containerize a simple web application using Docker, you would create a `Dockerfile`: 

```Dockerfile
# Use an official Python runtime as a parent image
FROM python:3.8

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```

With the Dockerfile created, you build the container image and run it:

```bash
docker build -t my-python-app .
docker run -p 4000:80 my-python-app
```

This Dockerfile defines an environment based on a Python 3.8 image, installs dependencies, and specifies how to run your app. The docker run command then runs the app in a new container, mapping port 4000 on your host to port 80 in the container.


## Building From Artifactory 

Some teams may want to connect to artifactory in order to build their container based off of packages hosted there. The following code helps you get connected in order to utilize those packages or images. 

Ensure you have completed the prerequisite section and the light_apps github account has been added to your repository. This will ensure you have the following organization secrets available 

- GITHUBREADONLY
- JF_ARTIFACTORY_AUTH
- JF_ARTIFACTORY_DEPLOY_TOKEN
- JF_ARTIFACTORY_EMAIL
- JF_ARTIFACTORY_TOKEN
- JF_ARTIFACTORY_VERSION_TOKEN
- SPE_ROSA_ARGOCD_PAT
- TEST_IOS_CERT_DECRYPT_KEY
- TEST_IOS_CERT_PASSWD

These secrets can be verified by going to your repository's settings -> secrets and variables -> actions page

### Dockerfile for logging into Artifactory via secrets

Here is an example of containerizing a simple api application where the application is utilizing 

```dockerfile
FROM public.ecr.aws/sam/build-nodejs18.x:latest AS builder

ENV PORT=5000
ENV NEXTAUTH_URL='http://localhost:3000'
ENV CLIENT_ID=''
ENV CLIENT_SECRET=''
ENV TENANT_ID=''
ENV NEXTAUTH_SECRET=''
ENV NODE_ENVIRONMENT='development'

WORKDIR /app
COPY .npmrc package.json package-lock.json ./ 
RUN --mount=type=secret,id=JF_ARTIFACTORY_EMAIL,uid=1000 \
    --mount=type=secret,id=JF_ARTIFACTORY_AUTH,uid=1000 \
    JF_ARTIFACTORY_EMAIL=$(cat /run/secrets/JF_ARTIFACTORY_EMAIL) \
    JF_ARTIFACTORY_AUTH=$(cat /run/secrets/JF_ARTIFACTORY_AUTH) \
    npm ci --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 5000

CMD npm run start
```
#### Dockerfile Template Explained

**Base Image Selection:**

`FROM public.ecr.aws/sam/build-nodejs18.x:latest AS builder`
This line specifies the base image for the build stage. It uses Node.js 18.x from the AWS public Elastic Container Registry (ECR), labeling this stage as builder.

**Environment Variables:**

ENV lines define environment variables within the Docker image. 

These include:
`PORT` for the application port (set to 5000).

`NEXTAUTH_URL`, `CLIENT_ID`, `CLIENT_SECRET`, `TENANT_ID`, `NEXTAUTH_SECRET` for authentication and authorization purposes.

`NODE_ENVIRONMENT` set to development to specify the Node environment.

**Working Directory:**

`WORKDIR /app` Sets the working directory inside the container to /app. Future commands will run in this directory.

**Copying Files:**

`COPY .npmrc package.json package-lock.json ./`

Copies the .npmrc file (used for npm configuration), package.json, and package-lock.json (which list package dependencies) into the /app directory.

**Running npm ci:**

Utilizes Docker's --mount=type=secret,id=...,uid=1000 syntax to securely use secrets during the build process, avoiding the secrets being stored in the image layers.

`JF_ARTIFACTORY_EMAIL` and `JF_ARTIFACTORY_AUTH` are read from Docker secrets and used to authenticate against a JFrog Artifactory registry, to fetch private npm packages.

`npm ci --legacy-peer-deps` command is used to install dependencies, ensuring a clean, repeatable installation by deleting node_modules and installing exactly what's in package-lock.json.

**Copying Application Files:**

`COPY . .`

Copies the rest of the application's files and directories into the /app directory in the container.
Building the Application:

`RUN npm run build`

Runs the build script defined in package.json, which typically compiles the application or prepares it for production.
Exposing Ports:

`EXPOSE 5000`

Informs Docker that the container listens on port 5000 at runtime. This is more of documentation; to map ports, you need to do so when running the container.

**Starting the Application:**

`CMD npm run start`

Specifies the command to run when the container starts. In this case, it starts the application using the start script defined in package.json.

note: This is the key part of connecting to artifactory and you must have the organization secrets available via your repository's settings -> secrets and variables -> actions page. Then ensure you alter your workflow file to get the secrets to be usable variables in your dockerfile. See next section for that. 


```dockerfile
RUN --mount=type=secret,id=JF_ARTIFACTORY_EMAIL,uid=1000 \
    --mount=type=secret,id=JF_ARTIFACTORY_AUTH,uid=1000 \
    JF_ARTIFACTORY_EMAIL=$(cat /run/secrets/JF_ARTIFACTORY_EMAIL) \
    JF_ARTIFACTORY_AUTH=$(cat /run/secrets/JF_ARTIFACTORY_AUTH) \
    npm ci --legacy-peer-deps
```



### Workflow File change

Ensure you declare your secrets needed in your workflow file as seen below.

```yaml
- name: Build and Push Images
      uses: docker/build-push-action@v4
      with:
        secrets: |
          JF_ARTIFACTORY_EMAIL=${{ secrets.JF_ARTIFACTORY_EMAIL }}
          JF_ARTIFACTORY_AUTH=${{ secrets.JF_ARTIFACTORY_AUTH }}
        push: true
        provenance: false
        tags: ${{ steps.meta.outputs.tags }}
```

