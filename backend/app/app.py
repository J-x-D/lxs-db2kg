from flask import Flask
from flask_cors import CORS
import openai
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# import declared routes
from routes.neural.rml_rule import rml_rule_blueprint
from routes.symbolic.get_ontology_class import get_ontology_class_blueprint
from routes.symbolic.get_fitting_ontology_classes import fitting_ontology_classes_blueprint
from routes.symbolic.get_semantically_closest import semantically_closest_blueprint
from routes.symbolic.create_embeddings import embedding_blueprint
from routes.symbolic.update_ontology_class import update_ontology_class_blueprint
from routes.symbolic.get_rml_rule_triples import get_rml_rule_triples_blueprint
from routes.symbolic.get_mapped_predicates import mapped_predicates_blueprint
from routes.symbolic.update_triple import update_triple_blueprint
from routes.symbolic.add_triple import add_triple_blueprint
from routes.symbolic.delete_triple import delete_triple_blueprint
from routes.symbolic.create_ontology import create_ontology_blueprint
from routes.symbolic.json_to_turtle import json_to_turtle_blueprint
from routes.symbolic.run_rml_mapper import run_rml_mapper_blueprint
from routes.symbolic.update_predicate import update_predicate_blueprint
from routes.symbolic.verify_predicate import verify_predicate_blueprint
from routes.symbolic.pdf_create_triples import pdf_create_triples_blueprint
from routes.symbolic.is_backend_running import is_backend_running_blueprint
from routes.neural.solve_coreferences import solve_coref_blueprint
from routes.neural.solve_not_in_text import solve_not_in_text_blueprint
from routes.symbolic.process_ontology import process_ontology_blueprint
from routes.symbolic.get_ontology_class import get_classes_blueprint
from routes.neural.topics import topics_blueprint
from routes.neural.execute import execute_blueprint
from routes.symbolic.calc_confidence_score import calc_confidence_score_blueprint

load_dotenv()

# load environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_ORGANIZATION = os.environ.get("OPENAI_ORGANIZATION")

# set openai api key and organization

# TODO: The 'openai.organization' option isn't read in the client API. You will need to pass it when you instantiate the client, e.g. 'OpenAI(organization=OPENAI_ORGANIZATION)'
# openai.organization = OPENAI_ORGANIZATION

# create flask app
app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

# register blueprints
app.register_blueprint(rml_rule_blueprint)
app.register_blueprint(get_ontology_class_blueprint)
app.register_blueprint(fitting_ontology_classes_blueprint)
app.register_blueprint(semantically_closest_blueprint)
app.register_blueprint(embedding_blueprint)
app.register_blueprint(update_ontology_class_blueprint)
app.register_blueprint(get_rml_rule_triples_blueprint)
app.register_blueprint(mapped_predicates_blueprint)
app.register_blueprint(update_triple_blueprint)
app.register_blueprint(add_triple_blueprint)
app.register_blueprint(delete_triple_blueprint)
app.register_blueprint(create_ontology_blueprint)
app.register_blueprint(json_to_turtle_blueprint)
app.register_blueprint(run_rml_mapper_blueprint)
app.register_blueprint(update_predicate_blueprint)
app.register_blueprint(verify_predicate_blueprint)
app.register_blueprint(pdf_create_triples_blueprint)
app.register_blueprint(is_backend_running_blueprint)
app.register_blueprint(solve_coref_blueprint)
app.register_blueprint(solve_not_in_text_blueprint)
app.register_blueprint(process_ontology_blueprint)
app.register_blueprint(topics_blueprint)
app.register_blueprint(execute_blueprint)
app.register_blueprint(calc_confidence_score_blueprint)

connection_string = os.getenv("CONNECTION_STRING")
mode = os.getenv("MODE")


@app.route("/")
def hello():
    print("Verifying connection to database:", connection_string, flush=True)
    engine = create_engine(connection_string)

    # verify connection
    with engine.connect() as con:
        rs = con.execute(text("select * from information_schema.schemata"))
        print(rs.fetchone())

    print("Connection established via SQL Alchemy", flush=True)

    return "OK"


# /etc/letsencrypt/live/lxs.germanywestcentral.cloudapp.azure.com/fullchain.pem
# /etc/letsencrypt/live/lxs.germanywestcentral.cloudapp.azure.com/privkey.pem

# run the app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
# if mode == "dev":
# else:
#     app.run(host='0.0.0.0', port=80, debug=True, ssl_context=("fullchain.pem", "privkey.pem"))
