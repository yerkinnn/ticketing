# .PHONY is a special make directive that declares the listed targets as "phony", meaning they are not actual files.
# This ensures that running 'make <target>' will always execute the recipe, even if a file with the same name exists.
.PHONY: help pf-auth-mongo pf-tickets-mongo pf-orders-mongo pf-payments-mongo

help:
	@echo "Available targets:"
	@echo "  make pf-auth-mongo       # Port-forward auth Mongo to localhost:27020"
	@echo "  make pf-tickets-mongo    # Port-forward tickets Mongo to localhost:27021"
	@echo "  make pf-orders-mongo     # Port-forward orders Mongo to localhost:27022"
	@echo "  make pf-payments-mongo   # Port-forward payments Mongo to localhost:27023"
	@echo ""
	@echo "MongoDB Compass examples:"
	@echo "  mongodb://127.0.0.1:27020"
	@echo "  mongodb://127.0.0.1:27021"
	@echo "  mongodb://127.0.0.1:27022"
	@echo "  mongodb://127.0.0.1:27023"

pf-auth-mongo:
	kubectl port-forward svc/auth-mongo-cluster-ip-service 27020:27017

pf-tickets-mongo:
	kubectl port-forward svc/tickets-mongo-cluster-ip-service 27021:27017

pf-orders-mongo:
	kubectl port-forward svc/orders-mongo-cluster-ip-service 27022:27017

pf-payments-mongo:
	kubectl port-forward svc/payments-mongo-cluster-ip-service 27023:27017
