
from flask import Blueprint, request
from rdflib import Graph as RDFGraph, Namespace, URIRef, Literal, BNode, RDF, FOAF
from rdflib.namespace import XSD
import json

delete_triple_blueprint = Blueprint(
    'delete_triple', __name__)


@delete_triple_blueprint.route("/delete_triple", methods=['POST'])
def delete_triple():

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

    print("Check ParentTriplesMap", triple["parentTriplesMap"], flush=True)

    if triple["parentTriplesMap"] is not None:
        new_graph = remove_join(rg, triple)
    else:
        new_graph = remove(rg, triple)

    return new_graph


def remove(graph, triple):
    # define the rr namespace
    rr = Namespace("http://www.w3.org/ns/r2rml#")

    print("Deleting object:", triple['object'], flush=True)

    # define the query to delete the object map
    query = f"""
        PREFIX rr: <http://www.w3.org/ns/r2rml#>
        PREFIX rml: <http://semweb.mmlab.be/ns/rml#>

        DELETE {{
            ?s ?p ?o .
        }}
        WHERE {{
            ?s rr:objectMap ?om .
            ?om rml:reference "{triple['object']}" .
            ?s ?p ?o .
        }}
    """

    # execute the query
    graph.update(query)

    # delete all the triples that match the object of the triple
    graph.remove((None, None, Literal(triple['object'])))

    # remove all the triples that match the predicate of the triple
    graph.remove((None, URIRef(triple['predicate']), None))

    return graph.serialize(format='json-ld')


def remove_join(graph, triple):

    # define the rr namespace
    rr = Namespace("http://www.w3.org/ns/r2rml#")

    triples_to_delete = []

    subject = None

    # iterate over all the triples in the graph
    for s, p, o in graph:
        print("s: {}, p: {}, o: {}".format(s, p, o), flush=True)
        # find the subject that matches the parent triples map
        if p == rr.parentTriplesMap and str(o) == triple['parentTriplesMap']:
            print("parent triples map found", flush=True)
            # find the subject that matches the join condition
            subject = s

    # iterate over all the triples in the graph and find all node based on the subject
    for s, p, o in graph:
        # find all the triples that match the subject
        if s == subject:
            print("s: {}, p: {}, o: {}".format(s, p, o), flush=True)
            triples_to_delete.append((s, p, o))

    # delete all the triples that match one of the triples in triples_to_delete
    for s, p, o in triples_to_delete:
        print("DELETE: s: {}, p: {}, o: {}".format(s, p, o), flush=True)
        graph.remove((s, p, o))
        if (p == rr.joinCondition):
            print("Delete everything related to the object: {}".format(o), flush=True)
            # delete the triples related to the object (deletes parent and child triples)
            graph.remove((None, None, o))
            graph.remove((None, o, None))
            graph.remove((o, None, None))

    print("subject: {}".format(subject), flush=True)

    # iterate over all the triples in the graph and delete predicates
    for s, p, o in graph:
        # delete the predicate
        if (p == rr.predicate and str(o) == str(triple['predicate'])):
            print("Delete everything related to the predicate: {}".format(
                o), flush=True)
            graph.remove((None, None, o))

        if (p == rr.objectMap and str(o) == str(subject)):
            # delete the object map
            print("Delete everything related to the object map: {}".format(
                s), flush=True)
            graph.remove((s, None, None))
            graph.remove((None, None, s))

    return graph.serialize(format='json-ld')
