# **CloudBrowser : S3 UI Tool**

Interact with AWS S3 buckets effortlessly using CloudBrowser, a graphical interface that streamlines storage management.

  - [Production Environment Dashboard](https://cloud-browser.apps.lrl.lilly.com/)
  - [QA Environment Dashboard](https://cloud-browser.apps-q.lrl.lilly.com/)
  - [Dev Environment Dashboard](https://cloud-browser.apps-d.lrl.lilly.com/)



## Configuration

Lilly Cloud Browser is configured by annotations on Kubernetes namespaces.  The available annotations are listed below.


### lilly.com/cloud-browser-auth
This allows setting s3 auth roles for s3 resources associated with the associated namespace.

The value for this annotation is a JSON object in string format.  The simplest  config allows setting a list of users providing read only access to the default S3 path for this namespace.  This default bucket / S3 prefix path will be ```s3://lly-light-prod/<namespace name>/```

```yaml
annotations:
  lilly.com/cloud-browser-auth: '{"authConfigs": [{ "users": ["A123456", "B7891011"]}]}'
```

Expanding on this, you can also specify an access group(s) rather than individual users:

```yaml
annotations:
  lilly.com/cloud-browser-auth: '{"authConfigs": [{ "groups": ["group1", "group2"]}]}'
```

You can also allow `[read, write, readwrite, delete, all]` access by setting these values:

```yaml
annotations:
  lilly.com/cloud-browser-auth: '{"authConfigs": [{ "groups": ["group1", "group2"], "permission": "readwrite"}]}'
```

You can set a non default prefix by:

```yaml
annotations:
  lilly.com/cloud-browser-auth: '{"authConfigs": [{ "groups": ["group1", "group2"], "permission": "readwrite", "prefix": "customprefix"}]}'
```


### CORS Configuration

To enable access from the cloud-browser frontend to an s3 bucket, CROSS ORIGIN RESOURCE SHARING (CORS) configuration needs to be set at the bucket level.

Click on the bucket, and navigate to `permissions`. ![Permissions](/img/permissions.png)

Under permissions, find `Cross-origin resource sharing`. ![cors](/img/cors.png)

Click `edit`, paste the following configuration block and save.

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "HEAD",
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ],
        "AllowedOrigins": [
            "https://cloud-browser.apps.lrl.lilly.com"
        ],
        "ExposeHeaders": [
            "ETag",
            "x-amz-meta-custom-header",
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2",
            "date"
        ],
        "MaxAgeSeconds": 3000
    }
]

```


## References

Please navigate to the cloud-browser repository for more information: [lrl-cloud-browser](https://github.com/EliLillyCo/lrl-cloud-browser).

<br /> 

