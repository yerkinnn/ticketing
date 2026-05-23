# Ticketing Microservices Project

This is a local Kubernetes-based microservices app for a ticket marketplace workflow.
Services communicate through NATS Streaming and each core service owns its own MongoDB.

## What this project includes

- `auth` - user signup/signin/signout and auth state
- `tickets` - ticket creation and updates
- `orders` - create/cancel orders for tickets
- `expiration` - background expiration handling (Redis-backed queue)
- `payments` - payment processing (Stripe key required)
- `client` - frontend app served through ingress
- `common` - shared library used by services

Infrastructure from `infra/k8s`:

- NGINX Ingress (`ingress-srv.yaml`)
- NATS Streaming (`nats.depl.yaml`)
- Redis for expiration service (`expiration-redis.depl.yaml`)
- One MongoDB per core service

## Architecture at a glance

- External traffic enters through Ingress host `ticketing.dev`
- Path routing:
  - `/api/users/*` -> `auth`
  - `/api/tickets/*` -> `tickets`
  - `/api/orders/*` -> `orders`
  - `/api/payments/*` -> `payments`
  - `/*` -> `client`
- Internal service-to-service communication uses NATS at `nats-cluster-ip-service:4222`

## Prerequisites

- Docker running
- A local Kubernetes cluster running
- `kubectl` configured to that cluster
- `skaffold` installed
- Ingress controller available (NGINX)
- `ticketing.dev` mapped to localhost

Hosts file entry:

```text
127.0.0.1 ticketing.dev
```

## First-time setup

1. Go to project root:

```bash
cd "/Users/yerkinnn/Desktop/udemy/microservices | Stephen Grider/ticketing"
```

2. Create required Kubernetes secrets:

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your_stripe_secret
```

See `K8S_SECRETS_CHEATSHEET.md` for more secret examples.

3. Install dependencies in each service (run once or when lockfiles change):

```bash
cd auth && npm install
cd ../tickets && npm install
cd ../orders && npm install
cd ../expiration && npm install
cd ../payments && npm install
cd ../nats-test && npm install
```

4. Return to root before running Skaffold:

```bash
cd ..
```

## Run the full project

From project root:

```bash
skaffold dev
```

Then open:

- [http://ticketing.dev](http://ticketing.dev)

Stop with `Ctrl + C`.

## Useful commands

Check pods/services:

```bash
kubectl get pods
kubectl get svc
```

Watch logs for one service:

```bash
kubectl logs -f deployment/payments-deployment
```

Port-forward service MongoDBs for Compass (from root):

```bash
make help
make pf-auth-mongo
make pf-tickets-mongo
make pf-orders-mongo
make pf-payments-mongo
```

## Common issues and fixes

### 1) Service crashes with NATS `ECONNREFUSED`

Cause: NATS pod not ready yet while dependent service starts.

Check:

```bash
kubectl get pods
kubectl logs deployment/nats-deployment
kubectl get endpoints nats-cluster-ip-service
```

Wait for NATS readiness, then let pods restart (Deployments restart automatically).

### 2) Secret missing errors (`JWT_KEY` or `STRIPE_KEY`)

Recreate secrets:

```bash
kubectl delete secret jwt-secret stripe-secret
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your_stripe_secret
```

Then restart deployments:

```bash
kubectl rollout restart deployment auth-deployment
kubectl rollout restart deployment tickets-deployment
kubectl rollout restart deployment orders-deployment
kubectl rollout restart deployment payments-deployment
```

## Development notes

- `skaffold.yaml` syncs TypeScript/JS source changes directly into containers for fast feedback.
- Service images use `imagePullPolicy: Never`, so local image builds are expected.
- Always run `skaffold dev` from the project root.
