# Introduction

Welcome to the **Cloud Applications and Technology as a Service (CATS)** platform documentation. CATS serves as a pivotal tool for accelerating the development and migration of web applications to the cloud. Spearheaded by the SPE Tech and Platform team, CATS is built using Open Source and AWS services that are designed to make your job as a developer as easy as possible. This platform is tailored to modernize operational workflows, reduce costs, and significantly diminish deployment timelines. 

Want to get to know more about the CATS Platform? Ask [Cats Agent](https://chat.lilly.com/cortex/chat/spe-platforms-model) or [CatsBot](https://chat.lilly.com/cortex/chat/catsbot)!

## Why CATS?

CATS integrates a GitOps CI/CD methodology to create a seamless operational pipeline from development to production. It is not just a platform but a strategic ally in your cloud-native journey. Here are some of the key features that CATS brings to your development lifecycle:

- **Azure AD Single Sign-On**: CATS streamlines your authentication process by offering seamless access management across your applications through integration with Azure Active Directory. This ensures a frictionless sign-on experience, enhancing productivity and security.

- **Active Directory Authorization**: With CATS, you gain simple and fine-tuned control over user permissions, ensuring secure and appropriate access to resources. Our platform enables precise management of access rights, bolstering your security posture.

- **Opinionated Automation**: Transform your deployment cycles from weeks to hours with CATS's highly opinionated automation strategies. Our platform automates your workflows, allowing for swift and efficient application deployment.

- **Centralized Operations**: Monitor and manage all operational aspects from a single vantage point with CATS. Our centralized operations dashboard ensures peak performance, providing visibility into your entire infrastructure.

- **Robust Security**: CATS is committed to safeguarding your applications with multi-level vulnerability scanning and robust security protocols. Our comprehensive security measures protect your infrastructure from evolving threats.

- **Auto DNS Provisioning**: Enjoy automated DNS setup with CATS for all deployed solutions. Our platform automatically provisions DNS, simplifying domain management and enhancing your application's accessibility.

- **Managed Certificates**: CATS automatically provides and manages certificates for all deployed solutions, ensuring secure connections and data integrity without the manual hassle.

- **Integrated S3**: Application teams can leverage AWS S3 buckets for storage out of the box with CATS. Our integrated S3 solution offers scalable and secure storage options, easily accessible to your applications.

- **Integrated RDS**: Utilize Amazon RDS instances seamlessly with CATS. Our integrated RDS feature allows application teams to deploy relational databases efficiently, supporting scalable and reliable data management.

- **EDB Native integration**: CATS offers native integration with EnterpriseDB, providing advanced database capabilities and optimizations for your applications. Leverage this integration for high-performance database solutions.

- **RED Data Ready**: CATS is fully qualified to host applications handling red data, ensuring compliance and security for sensitive information.

- **GxP Qualified**: CATS has been qualified as GxP compliant, with related quality documentation readily available in our Quality Docs. Trust in our platform to meet your compliance needs effectively.


## CATS Components

CATS is an opinionated platform with a complex architecture, designed with components that aims to streamline your development and deployment workflows. At the heart of the platform are key components essential for hosting applications and overseeing authentication and permissions management. Below is a detailed diagram illustrating the CATS architecture and how each component work with one another.

![CATS Architecture](/img/architecture.png)


### Major Components at a Glance

- **EKS**: Orchestrates the deployment and scaling of containerized applications within our Kubernetes cluster.
- **EC2/Fargate**: Provides the flexible compute resources needed to power your applications.
- **GitHub Repository**: A secure repository for your source code, integrated into the CI/CD pipeline.
- **Azure Active Directory**: Manages user authentication, ensuring secure access to the platform.
- **Bouncer**: Handles nuanced authorization processes to keep your operations smooth and secure.
- **Amazon ECR**: Stores and manages container images, facilitating continuous deployment within the Kubernetes ecosystem.

For a deeper dive into each component and how they interlace to empower your cloud applications, continue to the respective sections of our documentation. 
