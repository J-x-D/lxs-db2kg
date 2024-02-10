

from rdflib.plugins.sparql import prepareQuery
from flask import Blueprint, request
from rdflib import Graph as RDFGraph, Namespace, URIRef, Literal, BNode, RDF, FOAF, RDFS
from rdflib.namespace import XSD
import json

update_predicate_blueprint = Blueprint(
    'update_predicate', __name__)


@update_predicate_blueprint.route("/update_predicate", methods=['POST'])
def update_predicate():
    # access the request body
    old_predicate = request.json['old_predicate']
    new_predicate = request.json['predicate']
    rml_rule = request.json['rml_rule']

    # create the RDF graph
    rg = RDFGraph()
    rg.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    rg.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    rg.bind(
        'ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')

    # parse the RML rule and add the resulting triples to the graph
    rg.parse(data=json.dumps(rml_rule), format='json-ld')

    print("rdflib Graph loaded successfully with {} triples".format(
        len(rg)), flush=True)

    new_graph = update_predicate(
        rg, old_predicate, new_predicate)

    # parse the graph to json-ld
    new_graph_json = new_graph.serialize(format='json-ld', indent=4)

    return new_graph_json


def update_predicate(graph, old_predicate, new_predicate):
    # iterate over all triples in the graph
    for s, p, o in graph:
        # if the predicate of the triple is the old predicate
        print(o, old_predicate)
        if o == URIRef(old_predicate):
            # create a new triple with the new predicate
            new_triple = (s, p, URIRef(new_predicate))
            # remove the old triple
            graph.remove((s, p, o))
            # add the new triple
            graph.add(new_triple)

    return graph
