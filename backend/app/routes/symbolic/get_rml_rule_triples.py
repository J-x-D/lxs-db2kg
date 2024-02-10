from rdflib import Graph, Namespace
from rdflib.namespace import RDF
from flask import Blueprint, request
from rdflib import Graph as RDFGraph, Namespace, URIRef, Literal
import json
import re

get_rml_rule_triples_blueprint = Blueprint('get_rml_rule_triples', __name__)


@get_rml_rule_triples_blueprint.route("/get_rml_rule_triples", methods=['POST'])
def get_rml_rule_triples():
    # get the RML rule from the request
    rml_rule = request.get_json()

    # create an RDF graph
    g = RDFGraph()
    g.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    g.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    g.bind('ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')

    # parse the RML rule and add the resulting triples to the graph
    g.parse(data=json.dumps(rml_rule), format='json-ld')

    print("rdflib Graph loaded successfully with {} triples".format(
        len(g)), flush=True)

    # define the namespaces used in the RML rule
    rr = Namespace("http://www.w3.org/ns/r2rml#")
    table = None

    for s, p, o in g:
        print("s: {}, p: {}, o: {}".format(s, p, o), flush=True)
        if p == rr.tableName:
            table = o.split(".")[1]  # schema.table

    print("table: {}".format(table), flush=True)

    # get all the subjects of the subject maps defined in the RML rule
    subjects = set(g.subjects(predicate=rr.subjectMap))

    triples = []

    # print the subjects
    for s in subjects:
        print("Get triples for subject: {}".format(s), flush=True)
        t = get_subject_map_triples(g, s, table)
        # remove triples that contain empty values
        t = [x for x in t if x['object'] != None]
        triples.extend(t)

    return json.dumps(triples)


def get_subject_map_triples(graph, subject_map_template, table):
    # define the namespaces used in the RML rule
    rr = Namespace("http://www.w3.org/ns/r2rml#")
    rml = Namespace("http://semweb.mmlab.be/ns/rml#")

    # create a list to hold the dictionaries
    triples = []

    # get the subject map node that matches the subject map template
    subject_map_node = graph.value(
        predicate=rr.subjectMap, subject=subject_map_template)

    print("subject_map_node: {}".format(subject_map_node), flush=True)

    # get the subject from the subject map node
    subject = graph.value(subject=subject_map_node, predicate=rr.template)

    print("subject: {}".format(subject), flush=True)

    # get all the predicate-object maps for the subject map node
    pom_nodes = graph.objects(subject=subject_map_template,
                              predicate=rr.predicateObjectMap)

    # iterate over the predicate-object maps
    for pom_node in pom_nodes:

        parent_triples_map = None

        # get the predicate
        predicate = graph.value(subject=pom_node, predicate=rr.predicate)

        print("predicate: {}".format(predicate), flush=True)

        # get the object node or column
        object_node = graph.value(subject=pom_node, predicate=rr.objectMap)

        if object_node:
            print("object_node: {}".format(object_node), flush=True)
            # get parentsTriplesMap
            object = graph.value(
                subject=object_node, predicate=rr.parentTriplesMap)

            print("parentTriplesMap: {}".format(object), flush=True)
            parent_triples_map = object

            # if parentTriplesMap is null, get the value of the object node
            if object == None:
                # if the object is a node, get its value
                object = graph.value(
                    subject=object_node, predicate=rml.reference)
        else:
            object = graph.value(
                subject=pom_node, predicate=rml.parentTriplesMap)
            if object == None:
                # if the object is a column, get its name
                object = graph.value(
                    subject=pom_node, predicate=rml.reference)

        # add the triple to the list of triples
        triples.append({"subject": subject,
                        "predicate": predicate, "object": object, "table": table, "parentTriplesMap": parent_triples_map})

    # return the list of triples
    return triples
