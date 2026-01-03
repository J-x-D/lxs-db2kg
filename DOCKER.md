# LXS DB2KG - Docker Setup Guide

Diese Anleitung erklärt, wie Sie die gesamte LXS DB2KG-Anwendung mit Docker Compose starten können.

## Voraussetzungen

- Docker Engine 20.10 oder höher
- Docker Compose V2 oder höher
- Mindestens 4 GB RAM verfügbar

## Schnellstart

### 1. Umgebungsvariablen konfigurieren

Kopieren Sie die `.env.example` Datei zu `.env`:

```bash
cp .env.example .env
```

Bearbeiten Sie die `.env` Datei und fügen Sie Ihre API-Keys und Credentials ein:

```bash
OPENAI_API_KEY=sk-...
OPENAI_ORGANIZATION=org-...
MY_PASSWORD=your-app-password
MY_EMAIL=your-email@example.com
```

### 2. Anwendung starten

Starten Sie alle Services mit einem Befehl:

```bash
docker compose up -d
```

Oder mit Build-Flag, wenn Sie Änderungen vorgenommen haben:

```bash
docker compose up -d --build
```

### 3. Zugriff auf die Anwendung

Nach dem Start sind folgende Services verfügbar:

- **Frontend (Next.js)**: http://localhost:3000
- **Backend (Flask)**: http://localhost:8000
- **PostgreSQL Database**: localhost:5433

## Services

### PostgreSQL Database
- **Container**: lxs-db2kg-postgres
- **Port**: 5433 (extern) → 5432 (intern)
- **Credentials**:
  - User: `sa`
  - Password: `YourStrong!Passw0rd`
  - Database: `db`
- **Volumes**: 
  - Persistente Daten in `postgres_data` volume
  - Init-Script: `./backend/app/scripts/init.sql`

### Backend (Flask/Python)
- **Container**: lxs-db2kg-backend
- **Port**: 8000 (extern) → 80 (intern)
- **Features**:
  - Flask REST API
  - OpenAI Integration
  - RML Mapping
  - Ontology Processing

### Frontend (Next.js)
- **Container**: lxs-db2kg-frontend
- **Port**: 3000
- **Features**:
  - React-basierte UI
  - Material UI Components
  - Database Schema Visualization
  - RML Rule Editor

## Nützliche Befehle

### Logs anzeigen
```bash
# Alle Services
docker compose logs -f

# Spezifischer Service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Services neu starten
```bash
# Alle Services
docker compose restart

# Spezifischer Service
docker compose restart backend
```

### Services stoppen
```bash
docker compose stop
```

### Services stoppen und Container entfernen
```bash
docker compose down
```

### Services stoppen, Container und Volumes entfernen
```bash
docker compose down -v
```

### In einen Container wechseln
```bash
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh

# Database
docker compose exec postgres psql -U sa -d db
```

## Entwicklungsmodus

Für die lokale Entwicklung können Sie die Services auch einzeln starten:

### Frontend Development
```bash
cd frontend
pnpm install
pnpm dev
```

### Backend Development
```bash
cd backend/app
pip install -r requirements.txt
python app.py
```

### Nur Database starten
```bash
docker compose up -d postgres
```

## Troubleshooting

### Port bereits belegt
Wenn ein Port bereits belegt ist, können Sie die Ports in der `docker-compose.yml` ändern:
```yaml
ports:
  - "3001:3000"  # Frontend auf Port 3001 statt 3000
```

### Database Connection Fehler
Stellen Sie sicher, dass:
- Der PostgreSQL Container läuft: `docker compose ps`
- Der Health Check erfolgreich ist: `docker compose exec postgres pg_isready -U sa`
- Die CONNECTION_STRING korrekt ist

### Backend startet nicht
Prüfen Sie:
- OpenAI API Keys sind korrekt in `.env` gesetzt
- Logs für Fehlermeldungen: `docker compose logs backend`
- Python Dependencies sind installiert

### Frontend Build Fehler
- Löschen Sie Node Modules und bauen Sie neu:
  ```bash
  docker compose down
  docker compose build --no-cache frontend
  docker compose up -d
  ```

## Health Checks

Überprüfen Sie den Status aller Services:

```bash
docker compose ps
```

Oder testen Sie die Endpoints direkt:

```bash
# Backend Health Check
curl http://localhost:8000/api/is-backend-running

# Frontend
curl http://localhost:3000
```

## Produktions-Deployment

Für Produktion sollten Sie:

1. **Sichere Passwörter** in `.env` setzen
2. **SSL/TLS** für HTTPS konfigurieren (z.B. mit Traefik oder Nginx Reverse Proxy)
3. **Environment Variables** über Docker Secrets oder andere sichere Methoden verwalten
4. **Logging** zu einem zentralen Service weiterleiten
5. **Backups** für die PostgreSQL Datenbank einrichten
6. **Resource Limits** in docker-compose.yml definieren

## Weitere Informationen

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Haupt README](./README.md)
