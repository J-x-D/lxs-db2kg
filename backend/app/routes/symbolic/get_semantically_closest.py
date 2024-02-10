from flask import Blueprint, request
from flask_cors import CORS
import json
from rdflib import Graph as RDFGraph, OWL
import os
import json
import pandas as pd
import numpy as np
import openai
from sqlalchemy import create_engine, text
import uuid
import openai
from sklearn import metrics

from utils.get_embedding import get_embedding

# blueprint definition
semantically_closest_blueprint = Blueprint(
    'get_semantically_closest', __name__)

connection_string = os.getenv('CONNECTION_STRING')

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

@semantically_closest_blueprint.route("/get_semantically_closest", methods=['POST'])
def get_semantically_closest():

    # access the search parameter
    search = request.get_json()['search']
    urls = request.get_json()['urls']

    # get embeddings for urls and search
    embeddings = get_semantically_closest_texts(search, urls);
    return parse_embeddings(embeddings)



def get_embeddings_for_url(engine, url):
    print("Loading embeddings for url: {}".format(url))
    # load the embeddings from the database based on the meta id via sql
    query_embeddings = """
        SELECT embedding, text
        FROM ontology
        WHERE url = '{}'
    """.format(url)

    embeddings = pd.read_sql_query(
        sql=text(query_embeddings), con=engine.connect())
    print("Loaded {} embeddings from database".format(len(embeddings)))

    # parse the embeddings
    embeddings["embedding"] = embeddings["embedding"].apply(
        lambda x: np.fromstring(x[1:-1], sep=','))
    print("Parsed embeddings to numpy arrays")

    return embeddings


def get_semantically_closest_texts(search, urls):
    print("connection_string", connection_string, flush=True)
    # check if the connection string is set
    if connection_string is None:
        raise Exception("CONNECTION_STRING environment variable is not set")

    # create a postgres engine
    engine = create_engine(connection_string, echo=False)

    # get embedding for the search term
    search_embedding = get_embedding(search, engine='text-embedding-ada-002')
    print("Created embedding for search term: {}".format(search))

    # get the embeddings for the urls
    embeddings = pd.concat(
        [get_embeddings_for_url(engine, url) for url in urls])
    print("Loaded {} embeddings from database".format(len(embeddings)))

    # calculate the cosine similarity between the search term and all embeddings
    embeddings['similarities'] = embeddings["embedding"].apply(
        lambda x: cosine_similarity(x, search_embedding))
    print("Calculated cosine similarity for all ({}) embeddings".format(len(embeddings)))

    return embeddings

def parse_embeddings(embeddings):
    # sort the embeddings by similarity
    embeddings = embeddings.sort_values(by=['similarities'], ascending=False)
    print("Sorted embeddings by similarity")

    # parse the text column (string containing json) to json
    embeddings['text'] = embeddings['text'].apply(
        lambda x: json.loads(x))

    # return the text of the top 10 results as json
    return embeddings['text'].head(15).tolist()


@semantically_closest_blueprint.route("/get_semantically_closest_properties", methods=['POST'])
def get_semantically_closest_properties():
    # access the search parameter
    search = request.get_json()['search']
    urls = request.get_json()['urls']

    print("Fetching properties for search term: ", search, flush=True)

    embeddings = get_semantically_closest_texts(search, urls)
    suggestions = parse_embeddings(embeddings)

    print("length of suggestions: ", len(suggestions), flush=True)

    # iterate over the suggestions and extract the properties
    properties = []
    for suggestion in suggestions:
        print("suggestion: ", suggestion, flush=True)
        # check if the @type property is ObjectProperty or DatatypeProperty
        if "@type" in suggestion and str(OWL.ObjectProperty) in suggestion["@type"]:
            # acccess the @id property
            properties.append(suggestion["@id"])

        # check if the @type property is ObjectProperty or DatatypeProperty
        if "@type" in suggestion and str(OWL.DatatypeProperty) in suggestion["@type"]:
            # acccess the @id property
            properties.append(suggestion["@id"])

    # return the properties
    return properties

def parse_embeddings_and_similarity_level(embeddings):
     # sort the embeddings by similarity
    embeddings = embeddings.sort_values(by=['similarities'], ascending=False)
    print("Sorted embeddings by similarity")

    # parse the text column (string containing json) to json
    embeddings['text'] = embeddings['text'].apply(
        lambda x: json.loads(x))
    
    # iterate over the embeddings['text'] 
    for index, row in embeddings.iterrows():
        # extract the @type property or @id property -> check OWL.ObjectProperty || OWL.DatatypeProperty

        if "@type" in row['text'] and str(OWL.ObjectProperty) in row['text']['@type']:
            embeddings.at[index, 'text'] = row['text']['@type']
        if "@type" in row['text'] and str(OWL.DatatypeProperty) in row['text']['@type']:
            embeddings.at[index, 'text'] = row['text']['@id']
        else:
            embeddings.at[index, 'text'] = row['text']['@id']

    # format to {text: embeddings['text'], similarity: similarities['similarities']}
    return embeddings[['text', 'similarities']].head(15).to_dict('records')

@semantically_closest_blueprint.route("/get_semantically_closest_properties_with_similarity_level", methods=['POST'])
def get_semantically_closest_properties_with_similarity_level():
    # access the search parameter
    search = request.get_json()['search']
    urls = request.get_json()['urls']

    print("Fetching properties for search term: ", search, flush=True)

    embeddings = get_semantically_closest_texts(search, urls)
    suggestions = parse_embeddings_and_similarity_level(embeddings)

    print("length of suggestions: ", len(suggestions), flush=True)

    return suggestions