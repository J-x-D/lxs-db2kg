DB2KG is an application developed by my students and me during my PhD. More details will follow soon.

# LXS DB to KG (MonoRepo)

Welcome to the home of the LXS DB to KG application.

We have split the application into three parts:

- [Frontend](./frontend/README.md) - A Next.js application that is built using React and Typescript and Material UI.
- [Backend](./backend/README.md) - A python application that is responsible for converting a db to a knowledge graph.
- [External](./db/README.md) - We have included the database in here and a few examples for ontologies.

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

### Database

#### Start the database

```bash
# Navigate to the db folder
cd db
# Navigate to the database folder
cd database
# Start the database
docker compose up
```

#### Start the examples

```bash
# Navigate to the db folder
cd db
# Navigate to the examples folder
cd examples
# Host the examples
python3 -m http.server 8001
```

## Ontology example

Here is an example of an ontology that you can use:

`https://raw.githubusercontent.com/owlcs/pizza-ontology/master/pizza.owl`
