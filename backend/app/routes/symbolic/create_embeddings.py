
from sqlalchemy import create_engine
from flask import Blueprint, request
from flask_cors import CORS
import json
from rdflib import Graph as RDFGraph
import os
import json
import pandas as pd
from sqlalchemy import create_engine
import uuid
from openai import OpenAI
from utils.get_embedding import get_embedding

# blueprint definition
embedding_blueprint = Blueprint('create_embeddings', __name__)

# load environment variables
connection_string = os.getenv('CONNECTION_STRING')


# global variables
table_name = 'ontology'

@embedding_blueprint.route("/create_embeddings", methods=['POST'])
def create_embeddings():
    print(connection_string, flush=True)

    if connection_string is None:
        raise Exception("CONNECTION_STRING environment variable is not set")

    engine = create_engine(connection_string)

    print("Connection established via SQL Alchemy", flush=True)

    # access the urls from the request body
    urls = request.get_json()

    # create empty dataframe
    df = pd.DataFrame(
        columns=['id', 'created_at', 'url', 'text', 'embedding'])

    # iterate over the urls and create embeddings
    for index, url in enumerate(urls):
        print("Creating embedding for url #", url, flush=True)
        create_embedding_for_url(df, url)

        # save the embeddings to a postgres database
        created_rows = df.to_sql(table_name, con=engine, if_exists='replace')
        print("Saved {} rows in table: ".format(
            created_rows), table_name, flush=True)

        # reset the dataframe
        df = pd.DataFrame(
            columns=['id', 'created_at', 'url', 'text', 'embedding'])

    return "OK"


def create_embedding_for_url(df, url):
    print("loading graph from url: ", url, flush=True)
    # load the graph from the url
    rg = RDFGraph()
    rg.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    rg.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    rg.bind('ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
    rg.parse(url, format='xml')
    print("rdflib Graph loaded successfully with {} triples".format(
        len(rg)), flush=True)

    # serialize the graph to JSON-LD
    jsonld = rg.serialize(format='json-ld', encoding='utf-8').decode('utf-8')

    # iterate over json-ld
    for i, triple in enumerate(json.loads(jsonld)):
        json_triple = json.dumps(triple)
        df.loc[i] = [uuid.uuid4(), pd.Timestamp.now(), url, json_triple,
                     get_embedding(json_triple, engine='text-embedding-ada-002')]
        print("Created embedding for triple: #", i, flush=True)

        print("Created dataframe for embeddings with {} rows".format(len(df)))

    return df

def create_embeddings_for_all_predicates(df, url):
    rg = RDFGraph()
    rg.parse(url, format='xml')

    predicates = []

    # interate over the triples in the graph
    for subj, pred, obj in rg:
        print("subject", subj)
        print("predicate", pred)
        print("object", obj)
        print("")

        if str(pred) == "http://www.w3.org/2000/01/rdf-schema#range" or str(pred) == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":
            # keep in mind that we remove the context here...
            # should possibly be changed in the future
            # another way of creating the embeddings would be: "Course isPartOfStudy Study"
            property = str(subj).split("#")[1]
            predicates.append(property)

    predicates = list(set(predicates))
    print(predicates)

    # TODO: create embeddings for all predicates
