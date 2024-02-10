
from rdflib import Namespace
from rdflib import Graph, URIRef, RDF, RDFS, OWL, Literal, XSD
from sqlalchemy import create_engine
from flask import Blueprint, request, Response, make_response
from flask_cors import CORS
import json
from rdflib import Graph as RDFGraph
import os
import json
import pandas as pd
import numpy as np
import openai
from sqlalchemy import create_engine, text
import uuid
import openai
from utils.get_embedding import get_embedding

# blueprint definition
create_ontology_blueprint = Blueprint("create_ontology", __name__)

# global variables
table_name = "ontology"

connection_string = os.getenv('CONNECTION_STRING')


@create_ontology_blueprint.route("/create_ontology", methods=["POST"])
def create_ontology():
    # Get the request body data
    classes = request.json['classes']
    base_iri = request.json['base_iri']
    name = request.json['name']

    # print the length of the data
    print("Length of data: ", len(classes))

    ontology = create(base_iri, classes)

    # Export the graph to an OWL file
    url = "http://" + name + '.owl'
    jsonld = ontology.serialize(
        format='json-ld', encoding='utf-8').decode('utf-8')

    print("Created jsonld", flush=True)
    print(jsonld, flush=True)

    # Create the embeddings
    # create_embeddings_internal(jsonld, url)

    # format the jsonld to be more readable
    jsonld = json.dumps(json.loads(jsonld), indent=4)

    # Return the response as JSON
    # return Response(jsonld, mimetype='application/json')
    return url


def create(base_iri, data):

    # if base_iri does not end with a #, add it
    if not base_iri.endswith('#'):
        base_iri += '#'

    # Create an empty graph
    g = RDFGraph()
    g.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    g.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    g.bind('ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')

    # Create a dictionary to store the classes
    classes = {}

    # Iterate over the classes
    for class_data in data:
        class_name = class_data['name']
        properties = class_data['properties']
        sub_class_of = class_data['subClassOf']

        # Create a class with the given name
        class_uri = URIRef(base_iri + class_name)
        g.add((class_uri, RDF.type, OWL.Class))
        classes[class_name] = class_uri

        # Iterate over the propibutes of the class
        for prop in properties:
            print(prop, flush=True)
            for prop_type, prop_value in prop.items():
                if prop_type == 'DatatypeProperty':
                    prop_name = prop_value
                    # datatype = prop['datatype']  # Get the datatype value
                    prop_uri = URIRef(base_iri + prop_name)
                    g.add((prop_uri, RDF.type, OWL.DatatypeProperty))
                    g.add((prop_uri, RDFS.domain, class_uri))
                    g.add((prop_uri, RDFS.range, RDFS.Literal))
                    # Add datatype as range
                    # g.add((prop_uri, RDFS.range, eval(f"XSD.{datatype}")))

                elif prop_type == 'ObjectProperty':
                    prop_name = prop_value
                    prop_uri = URIRef(base_iri + prop_name)
                    g.add((prop_uri, RDF.type, OWL.ObjectProperty))
                    g.add((prop_uri, RDFS.domain, class_uri))

                    if 'range' in prop:
                        range_name = prop['range']
                        range_uri = URIRef(base_iri + range_name)
                        g.add((prop_uri, RDFS.range, range_uri))

        if sub_class_of:
            # Create subclass relationship
            sub_class_uri = URIRef(base_iri + sub_class_of)
            g.add((class_uri, RDFS.subClassOf, sub_class_uri))

    return g


def create_embeddings_internal(graph, url):
    if connection_string is None:
        raise Exception("CONNECTION_STRING environment variable is not set")

    print(connection_string, flush=True)
    engine = create_engine(connection_string)

    # create empty dataframe
    df = pd.DataFrame(
        columns=['id', 'created_at', 'url', 'text', 'embedding'])

    # iterate over json-ld
    for i, triple in enumerate(json.loads(graph)):
        json_triple = json.dumps(triple)
        print("Created embedding for triple: #", i, flush=True)
        df.loc[i] = [uuid.uuid4(), pd.Timestamp.now(), url, json_triple,
                     get_embedding(json_triple, engine='text-embedding-ada-002')]

        print("Created dataframe for embeddings with {} rows".format(len(df)))

    # save the embeddings to a postgres database
    created_rows = df.to_sql(table_name, con=engine, if_exists='replace')
    print("Saved {} rows in table: ".format(
        created_rows), table_name, flush=True)

    return "OK"
