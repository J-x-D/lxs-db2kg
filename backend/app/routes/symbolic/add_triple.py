
from flask import Blueprint, request
from rdflib import Graph as RDFGraph, Namespace, URIRef, Literal, BNode, RDF, FOAF
from rdflib.namespace import XSD
import json

add_triple_blueprint = Blueprint(
    'add_triple', __name__)


@add_triple_blueprint.route("/add_triple", methods=['POST'])
def add_triple():

    # get the triple and the rml rule from the request
    triple = request.json['triple']
    rml_rule = request.json['rml_rule']

    # create the RDF graph
    rg = RDFGraph()
    rg.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    rg.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    rg.bind('ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')

    # parse the RML rule and add the resulting triples to the graph
    rg.parse(data=json.dumps(rml_rule), format='json-ld')

    print("rdflib Graph loaded successfully with {} triples".format(
        len(rg)), flush=True)

    # define the rr namespace
    rr = Namespace("http://www.w3.org/ns/r2rml#")

    # get all the subjects of the subject maps defined in the RML rule
    subjects = set(rg.subjects(predicate=rr.subjectMap))

    # print the subjects
    for s in subjects:
        print("Get triples for subject: {}".format(s), flush=True)
        new_graph = add(rg, s, triple)

    return new_graph


def debug(graph):
    # iterate over all the triples in the graph
    for s, p, o in graph:
        print("s: {}, p: {}, o: {}".format(s, p, o), flush=True)


def get_base_uri(graph):
    # iterate over all the triples in the graph
    for s, p, o in graph:
        if p == RDF.type and o == URIRef("http://www.w3.org/ns/r2rml#TriplesMap"):
            # split the subject to get the base uri
            s = s.split("#")[0]
            return s

    return None


def add(graph, subject_map_template, new_triple):
    rr = Namespace("http://www.w3.org/ns/r2rml#")
    NS0 = Namespace("http://semweb.mmlab.be/ns/rml#")

    # new blank node for the predicate-object map
    pom_node = BNode()

    # create a new object map
    new_object_map = BNode()

    # get the base uri
    base_uri = get_base_uri(graph)

    if 'reference' in new_triple:
        # add the ns0:reference property to the new object map
        graph.add((new_object_map, NS0.reference,
                  Literal(new_triple['reference'])))

    elif 'join' in new_triple:
        join = new_triple['join']
        child = join['child']
        parentTriplesMap = base_uri + "#" + join['parentTriplesMap']
        # add the rr:parentTriplesMap property to the new object map
        graph.add((new_object_map, rr.parentTriplesMap,
                  URIRef(parentTriplesMap)))

        # create a new join condition
        join_condition = BNode()
        # add the rr:child property to the join condition
        graph.add((join_condition, rr.child, Literal(child)))
        # add the rr:parent property to the join condition
        graph.add((join_condition, rr.parent, Literal("id")))

        # add the join condition to the subject map template
        graph.add((new_object_map, rr.joinCondition, join_condition))

    # add the rr:objectMap property to the new predicate-object map
    graph.add((pom_node, rr.objectMap, new_object_map))

    # add the rr:predicate property to the new predicate-object map
    graph.add((pom_node, rr.predicate, URIRef(new_triple['predicate'])))

    # add the pom_node to the subject map template
    graph.add((subject_map_template, rr.predicateObjectMap, pom_node))

    return graph.serialize(format='json-ld')
