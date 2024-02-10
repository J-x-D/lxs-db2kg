from flask import Blueprint, render_template, abort, request
import json
from sqlalchemy import create_engine
from openai import OpenAI
import os
from rdflib import Graph as RDFGraph

fitting_ontology_classes_blueprint = Blueprint(
    'get_fitting_ontology_classes', __name__)


@fitting_ontology_classes_blueprint.route('/get_fitting_ontology_classes', methods=['POST'])
def rml_rule():
    client = OpenAI(
        api_key=os.getenv('OPENAI_API_KEY'),
        organization=os.environ.get('OPENAI_ORGANIZATION')
    )
    # access request parameters
    database = request.json['database']
    ontology = request.json['ontology']
    table = request.json['table']

    if not database or not ontology or not table:
        print("Missing parameters")
        return ""

    completionRequest = getCompletionRequest(
        database, ontology, table)

    try:
        response = client.chat.completions.create(temperature=0,
        model="gpt-4",
        messages=[
            {"role": "system",
                "content": "You are a programmer that provides only fitting classes for a database table column from the provided ontology (but not limited to that). You provide only the list in JSON of the classes but no further explanation. "},
            {"role": "user", "content": completionRequest},
        ])
        ontology_class_list = response.choices[0].message.content

        print(ontology_class_list)
        return ontology_class_list

    except Exception as e:
        print("Error: ", e)
        return ""


def getCompletionRequest(database, ontologies, table):
    template = """
    [
        {
            "class": "<class>",
            "from_ontology": <true/false>
        }
    ]
    """

    content = f"""
    database schema: {json.dumps(database)}
    ontology: {json.dumps(ontologies)}

    Provide 15 fitting classes for a RML rule for the table {table}. 
    Consider the given ontology but do not limit it to the provided ontology. 
    Indicate in the JSON which class comes from the provided ontology and which does not via the "from_ontology" property. 
    The actual class should be provided via the "class" property.
    Do only provide those two properties inside a JSON object like this: {template}
    Provide only external classes that come from well-known ontologies like "https://schema.org/" and "http://www.ontologydesignpatterns.org/".
  """

    return content
