# Rate Limit

To Control the Number of Requests Going to a Service

The RateLimit middleware ensures that services will receive a fair amount of requests, and allows one to define what fair is.

It is based on a token bucket implementation. In this analogy, the average parameter (defined below) is the rate at which the bucket refills, and the burst is the size (volume) of the bucket.

## Configuration Template

```yaml
# Here, an average of 100 requests per second is allowed.
# In addition, a burst of 200 requests is allowed.
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: ratelimit-middleware-name
  namespace: your-namespace-name
spec:
  rateLimit:
    average: 100
    burst: 200
```

## Configuration Options

1. Average

`average` is the maximum rate, by default in requests per second, allowed from a given source.

It defaults to 0, which means no rate limiting.

The rate is actually defined by dividing average by period. So for a rate below 1 req/s, one needs to define a period larger than a second.

```yaml
# 100 reqs/s
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: ratelimit-middleware-name
  namespace: your-namespace-name
spec:
  rateLimit:
    average: 100
```

<br />

2. Period

`period`, in combination with `average`, defines the actual maximum rate, such as:

```
r = average / period
```

```yaml
# 6 reqs/minute
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: ratelimit-middleware-name
  namespace: your-namespace-name
spec:
  rateLimit:
    period: 1m
    average: 6
```

<br />

3. Burst

`burst` is the maximum number of requests allowed to go through in the same arbitrarily small period of time.

It defaults to `1`.

```yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: ratelimit-middleware-name
  namespace: your-namespace-name
spec:
  rateLimit:
    burst: 100
```

## Advanced Rate Limit Configs

For more advanced rate limit configuration options please navigate to the full documentation here: https://doc.traefik.io/traefik/middlewares/http/ratelimit/

## Attach Rate Limit Middleware to Ingress

Attach your new rate limit middleware resource to your ingress via the following annotation. Be sure to update the name of your middleware to match the name defined in your middleware resource created in step 1. 


```yaml
annotations:
    traefik.ingress.kubernetes.io/router.middlewares: ratelimit-middleware-name
```