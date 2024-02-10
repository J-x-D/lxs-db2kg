
from flask import Blueprint, request
from rdflib import Graph as RDFGraph, Namespace, URIRef, Literal, BNode, RDF, FOAF
from rdflib.namespace import XSD
import json

update_triple_blueprint = Blueprint(
    'update_triple', __name__)


@update_triple_blueprint.route("/update_triple", methods=['POST'])
def get_predicate_suggestions():

    # get the triple and the rml rule from the request
    old_triple = request.json['old_triple']
    new_triple = request.json['new_triple']
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

    new_graph = replace_triple(rg,  old_triple, new_triple)

    return new_graph


update_triple_blueprint = Blueprint(
    'update_triple', __name__)


@update_triple_blueprint.route("/update_triple", methods=['POST'])
def get_predicate_suggestions():

    # get the triple and the rml rule from the request
    old_triple = request.json['old_triple']
    new_triple = request.json['new_triple']
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

    new_graph = replace_triple(rg,  old_triple, new_triple)

    return new_graph


def replace_triple(graph, old_triple, new_triple, format='json-ld'):

    # get the base uri
    base_uri = get_base_uri(graph)

    # Determine the object value based on the join or reference
    if 'join' in new_triple:
        object_value = ''
        join_child = new_triple['join']['child']
        join_parent = base_uri + "#" + new_triple['join']['parentTriplesMap']
    else:
        object_value = new_triple['reference']
        join_child = None
        join_parent = None

    # query to update ns0:reference and add join condition if 'join' is set
    if 'join' in new_triple:
        query = f"""
        PREFIX rr: <http://www.w3.org/ns/r2rml#>
        PREFIX ns0: <http://semweb.mmlab.be/ns/rml#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        DELETE
        {{
          ?mapping ns0:reference ?oldRef .
          ?mapping rr:objectMap ?objectMap .
        }}
        INSERT
        {{
          ?mapping rr:objectMap [ rr:joinCondition [ rr:child "{join_child}"^^xsd:string ;
                                                     rr:parent "id"^^xsd:string ] ;
                                  rr:parentTriplesMap <{join_parent}> ] .
        }}
        WHERE
        {{
          ?mapping ns0:reference ?oldRef .
          OPTIONAL {{ ?mapping rr:objectMap ?objectMap . }}
          FILTER (?oldRef = "{old_triple['object']}")
        }}
        """
    else:
        query = f"""
        PREFIX rr: <http://www.w3.org/ns/r2rml#>
        PREFIX ns0: <http://semweb.mmlab.be/ns/rml#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        DELETE
        {{
          ?mapping ns0:reference ?oldRef .
        }}
        INSERT
        {{
          ?mapping rr:objectMap [ rr:reference "{object_value}"^^xsd:string ] .
        }}
        WHERE
        {{
          ?mapping ns0:reference ?oldRef .
          FILTER (?oldRef = "{old_triple['object']}")
        }}
        """

    # execute the query
    graph.update(query)

    # query to update rr:predicate
    query = f"""
    PREFIX rr: <http://www.w3.org/ns/r2rml#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    DELETE
    {{
      ?mapping rr:predicate ?oldPredicate .
    }}
    INSERT
    {{
      ?mapping rr:predicate foaf:demo .
    }}
    WHERE
    {{
      ?mapping rr:predicate ?oldPredicate .
      FILTER (?oldPredicate = "{old_triple['predicate']}")
    }}
    """

    # execute the query
    graph.update(query)

    return graph.serialize(format=format)


def get_base_uri(graph):
    # iterate over all the triples in the graph
    for s, p, o in graph:
        if p == RDF.type and o == URIRef("http://www.w3.org/ns/r2rml#TriplesMap"):
            # split the subject to get the base uri
            s = s.split("#")[0]
            return s

    return None
