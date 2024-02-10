
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
from utils.get_embedding import  get_sbert_embedding


calc_confidence_score_blueprint = Blueprint(
    'calc_confidence_score', __name__)


@calc_confidence_score_blueprint.route("/calc_confidence_score", methods=['GET'])
def calc_confidence_score():
    # access query parameters 'class' and 'label'
    class_name = request.args.get('class')
    label = request.args.get('label')

    # prepare class_name so do only use the last part of the url
    if('#' in class_name):
        class_name = class_name.split('#')[-1]
    elif('/' in class_name):
        class_name = class_name.split('/')[-1]

    # create embedding for both class and label
    embedding_class = get_sbert_embedding(class_name)
    embedding_label = get_sbert_embedding(label)

    # calculate confidence score using tensorflow dot score function
    confidence_score = np.dot(embedding_class, embedding_label)

    # round confidence score to 2 decimal places and parse from float32 to float
    confidence_score = float(np.round(confidence_score, 2))

    # return parsed confidence score as json
    return json.dumps({'confidence_score': confidence_score})