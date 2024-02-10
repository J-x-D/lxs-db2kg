
from sqlalchemy import create_engine
from flask import Blueprint, request
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
from utils.get_embedding import get_embedding, get_sbert_embedding
import owlready2
from utils.get_embedding import test_sbert_embedding

process_ontology_blueprint = Blueprint(
    'process_ontology', __name__)

# load environment variables
connection_string = os.getenv('CONNECTION_STRING')

@process_ontology_blueprint.route("/process_ontology", methods=['POST'])
def process_ontology():
    # access request body with list of ontologies
    ontologies = request.json['ontologies']

    # process classes
    print("Processing ontology classes...", flush=True)
    process_ontology_classes(ontologies)

    # process properties
    print("Processing ontology properties...", flush=True)
    process_ontology_properties(ontologies)

    return "OK"


def process_ontology_classes(ontologies):
    # create dataframe with labels and ontology_url and embedding
    df = pd.DataFrame(columns=['class', 'ontology_url', 'embedding'])

    # get all classes from all ontologies and their labels and save them in the dataframe
    for ontology in ontologies:
        print("Processing ontology:", ontology, flush=True)
        # load the ontology
        onto = owlready2.get_ontology(ontology).load()

        # get all classes
        classes = list(onto.classes())

        # get all subclasses
        subclasses = []
        for cls in classes:
            subclasses.extend(list(cls.subclasses()))

        # get all classes and subclasses
        all_classes = classes + subclasses
        print("Found", len(all_classes), "classes", flush=True)

        # drop duplicates
        all_classes = list(set(all_classes))

        
        # iterate over all labels
        for cls in all_classes:
            label = str(cls.name)
            # get the embedding of the label
            embedding = get_sbert_embedding(label).tolist()
            print("Created embedding for class:", label, flush=True)
            # add the class to the dataframe
            row = {'class': label, 'ontology_url': ontology, 'embedding': embedding}
            df.loc[len(df.index)] = row

    # # save the dataframe to database
    engine = create_engine(connection_string)
    df.to_sql('ontology_classes', con=engine, if_exists='replace')
    print("Saved to database...", flush=True)

def process_ontology_properties(ontologies):
    # create dataframe with labels and ontology_url and embedding
    df = pd.DataFrame(columns=['property', 'ontology_url', 'embedding'])

    # get all classes from all ontologies and their labels and save them in the dataframe
    for ontology in ontologies:
        print("Processing ontology:", ontology, flush=True)
        # load the ontology
        onto = owlready2.get_ontology(ontology).load()

        # get all properties
        properties = list(onto.properties())

        # get all classes and subclasses
        print("Found", len(properties), "properties", flush=True)

        # drop duplicates
        all_properties = list(set(properties))

        
        # iterate over all labels
        for prop in all_properties:
            label = str(prop.name)
            # get the embedding of the label
            embedding = get_sbert_embedding(label).tolist()
            print("Created embedding for property:", label, flush=True)
            # add the class to the dataframe
            row = {'property': label, 'ontology_url': ontology, 'embedding': embedding}
            df.loc[len(df.index)] = row

    # # save the dataframe to database
    engine = create_engine(connection_string)
    df.to_sql('ontology_properties', con=engine, if_exists='replace')
    print("Saved to database...", flush=True)
