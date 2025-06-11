# Send Emails 
CATS has a built-in email server that allows sending email from ```<app-name>-no-reply@apps.lrl.lilly.com```.

You can use this server with the below connection info:

  * server: `smtp.messaging.svc`
  * port: `1025`

No authentication is required as long as your app is running in the CATS K8s cluster.

Note: "smtp.messaging.svc:1025" is a non-ssl (non secure) service
ensure you have added `email_secure = FALSE` to your code. The service is running within the cluster (communication outside the cluster is encrypted).
<br />

## EXTERNAL tags
Steps have already been taken to remove the [EXTERNAL] tag from the subject line of the email. However, by default, emails will still have 
<br /><span style={{color: 'red', backgroundColor: '#fff7cf', fontWeight: 'bold'}}>EXTERNAL EMAIL: Use caution before replying, clicking links, and opening attachments.</span><br /> prepended to the body of the email.

To remove this tag, you will need to submit a ticket through the ServiceNow portal. The proper ticket is:
<a href="https://lilly.service-now.com/ec?id=sc_cat_item&table=sc_cat_item&sys_id=0b3f2cb61b983990e5388511604bcb10">Miscellaneous Email Requests</a>. There are two options to choose from for this use case, depending on the desired outcome. The options are:

| Email Service | Description |
|-------------------------------------- | ----------------|
| Request External Tag exemption | Completely remove the tag from the email | 
| Request Lilly Agent Tag for Sender |  Change EXTERNAL EMAIL to LILLY AGENT EMAIL |

The Lilly Agent tag is typically used by vendors or partners, such as Jira or AMEX, who are approved to send emails from non-Lilly domains. Most of the requests will be for the first option, but the second option is available, if needed.

You will need to provide the full sender email address from which you want the tag removed. If approved, the message will be removed from the email or modified. Please expect a series of follow-up emails regarding your use case.

## Send from Custom URL

*TODO: coming soon*