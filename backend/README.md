# LXS DB to KG - Backend

This is the backend for the LXS DB to KG application. This is a python application that is responsible for converting text to a knowledge graph.

## Getting Started - Development

To get started, you will need to install the dependencies for the project in each of the folders. You can do this by running the following commands:

```bash
# Navigate to the app folder
cd app
# Install the dependencies
pip install -r requirements.txt
# Start the application
python app.py
```

### Run Flask app

> Note: Please use the latest version of openai and instructor. A new version of openai changed chat completion function calls and their parameters. The old version is not compatible with the new one.

`python3 app/app.py`

## Local Development

For local development use docker and run `docker-compose up`.

Set environmental variables (`.env`). E.g. for backend DB `postgresql://sa:YourStrong!Passw0rd@localhost:5432/db`. Remember to change IP address.
