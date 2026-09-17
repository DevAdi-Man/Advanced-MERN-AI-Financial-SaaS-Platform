DB_NAME     = finora_db
DB_USER     = finora_user
DB_PASS     = finora_pass
DB_PORT     = 27017
CONTAINER   = finora-mongo

.PHONY: db-start db-stop db-logs install-backend install-frontend install backend frontend dev clean

## ── Database ──────────────────────────────────────────────────────────────────

db-start:
	@if podman ps -a --format '{{.Names}}' | grep -q '^$(CONTAINER)$$'; then \
		podman start $(CONTAINER) 2>/dev/null || true; \
		echo "MongoDB container already exists — started at localhost:$(DB_PORT)"; \
	else \
		podman run -d \
			--name $(CONTAINER) \
			-p $(DB_PORT):27017 \
			-v finora-mongo-data:/data/db \
			docker.io/library/mongo:7 --replSet rs0 --bind_ip_all; \
		echo "Waiting for MongoDB to be ready..."; \
		sleep 4; \
		podman exec $(CONTAINER) mongosh --eval \
			"rs.initiate({_id:'rs0',members:[{_id:0,host:'localhost:27017'}]})" || true; \
		echo "MongoDB replica set running at localhost:$(DB_PORT)"; \
	fi

db-stop:
	podman stop $(CONTAINER) && podman rm $(CONTAINER)

db-logs:
	podman logs -f $(CONTAINER)

## ── Install ───────────────────────────────────────────────────────────────────

install-backend:
	cd backend && npm install

install-frontend:
	cd client && npm install

install: install-backend install-frontend

## ── Run ───────────────────────────────────────────────────────────────────────

backend:
	cd backend && npm run dev

frontend:
	cd client && npm run dev

# Run backend and frontend in parallel (requires a terminal that supports &)
dev: db-start
	$(MAKE) backend & $(MAKE) frontend

seed:
	cd backend && npx ts-node --files src/seed.ts

## ── Clean ─────────────────────────────────────────────────────────────────────

clean: db-stop
	podman volume rm finora-mongo-data || true
