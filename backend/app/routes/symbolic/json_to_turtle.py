from flask import Blueprint, request
from rdflib import Graph as RDFGraph
import re
import json
from pyshacl import validate

# blueprint definition
json_to_turtle_blueprint = Blueprint(
    'getTurtle', __name__)


@json_to_turtle_blueprint.route('/getTurtle', methods=['POST'])
def getTurtle():
    # access rules from request body
    json_ld = request.json

    graph = RDFGraph()
    graph.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    graph.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    graph.bind('ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
    graph.parse(data=json.dumps(json_ld), format='json-ld')

    # return the serialized the graph in turtle
    return graph.serialize(format='turtle')
