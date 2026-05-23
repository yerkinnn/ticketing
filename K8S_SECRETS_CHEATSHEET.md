# Kubernetes Secrets Cheat Sheet

Quick reference for creating and using secrets in this project.

## Required secrets in this project

- `jwt-secret` with key `JWT_KEY` (used by `auth`, `orders`, `tickets`, `payments`)
- `stripe-secret` with key `STRIPE_KEY` (used by `payments`)

## 1) Create a secret (literal)

```bash
kubectl create secret generic jwt-secret \
  --from-literal=JWT_KEY=your_jwt_key_here

kubectl create secret generic stripe-secret \
  --from-literal=STRIPE_KEY=your_stripe_secret_key_here
```

## 2) Create a secret from `.env` file

Example `jwt.env`:

```env
JWT_KEY=abc123
```

Command:

```bash
kubectl create secret generic jwt-secret --from-env-file=jwt.env
```

Example `stripe.env`:

```env
STRIPE_KEY=sk_test_xxx
```

Command:

```bash
kubectl create secret generic stripe-secret --from-env-file=stripe.env
```

## 3) Verify secret exists

```bash
kubectl get secrets
kubectl describe secret jwt-secret
kubectl describe secret stripe-secret
```

## 4) Use secret in a Deployment

```yaml
env:
  - name: JWT_KEY
    valueFrom:
      secretKeyRef:
        name: jwt-secret
        key: JWT_KEY
  - name: STRIPE_KEY
    valueFrom:
      secretKeyRef:
        name: stripe-secret
        key: STRIPE_KEY
```

## 5) Update secret value

Simplest approach: delete and recreate.

```bash
kubectl delete secret jwt-secret
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=new_value

kubectl delete secret stripe-secret
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=new_value
```

After update, restart deployments if needed:

```bash
kubectl rollout restart deployment auth-deployment
kubectl rollout restart deployment orders-deployment
kubectl rollout restart deployment tickets-deployment
kubectl rollout restart deployment payments-deployment
```

## 6) Delete secret

```bash
kubectl delete secret jwt-secret
kubectl delete secret stripe-secret
```

## Notes

- Do not commit real secret values to git.
- Keep `.env` files in `.gitignore`.
- For this ticketing setup, both `jwt-secret`/`JWT_KEY` and `stripe-secret`/`STRIPE_KEY` are used.
