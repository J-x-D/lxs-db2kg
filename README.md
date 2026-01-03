DB2KG is an application developed by my students and me during my PhD. More details will follow soon.

# LXS DB to KG (MonoRepo)

Welcome to the home of the LXS DB to KG application.

We have split the application into three parts:

- [Frontend](./frontend/README.md) - A Next.js application that is built using React and Typescript and Material UI.
- [Backend](./backend/README.md) - A python application that is responsible for converting a db to a knowledge graph.
- [External](./db/README.md) - We have included the database in here and a few examples for ontologies.

## Quick Start with Docker (Recommended)

The easiest way to run the entire application is using Docker Compose:

```bash
# 1. Copy environment variables template
cp .env.example .env

# 2. Edit .env file and add your API keys
# OPENAI_API_KEY=your-key-here
# OPENAI_ORGANIZATION=org-your-org-here

# 3. Start all services
docker compose up -d

# 4. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Database: localhost:5433
```

For detailed Docker instructions, troubleshooting, and advanced configuration, see [DOCKER.md](./DOCKER.md).

## Getting Started - Development

To get started, you will need to install the dependencies for the project in each of the folders. You can do this by running the following commands:

### Frontend

```bash
# Navigate to the frontend folder
cd frontend
# Install the dependencies
pnpm install
# Start the application
pnpm dev
```

### Backend

```bash
# Navigate to the backend folder
cd backend
# Navigate to the app folder
cd app
# Install the dependencies
pip install -r requirements.txt
# Start the application
python app.py
```