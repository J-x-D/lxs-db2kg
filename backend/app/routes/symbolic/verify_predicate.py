from flask import Blueprint, request
import os
from sqlalchemy import create_engine, text
import pandas as pd
import json

verify_predicate_blueprint = Blueprint('verify_predicate', __name__)


connection_string = os.getenv('CONNECTION_STRING')


@verify_predicate_blueprint.route("/verify_predicate")
def verify_predicate():
    # access the url param
    predicate = request.args.get('predicate')

    # access the db
    if connection_string is None:
        raise Exception("CONNECTION_STRING environment variable is not set")

    engine = create_engine(connection_string)

    query_embeddings = """
        SELECT text
        FROM ontology
    """

    texts = pd.read_sql_query(
        sql=text(query_embeddings), con=engine.connect())
    print("Loaded {} JSON-LD elements from database".format(len(texts)))

    for _, row in texts.iterrows():
        print("Checking if {} is in {}".format(predicate, row['text']))
        if predicate in row['text']:
            return {
                "is_in_texts": True,
            }

    # return json response
    return {
        "is_in_texts": False,
    }
