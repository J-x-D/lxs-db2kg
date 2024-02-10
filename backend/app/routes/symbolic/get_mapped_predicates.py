
from flask import Blueprint, request
from rdflib import Graph as RDFGraph
import json

# blueprint definition
mapped_predicates_blueprint = Blueprint('get_mapped_predicates', __name__)


@mapped_predicates_blueprint.route("/get_mapped_predicates", methods=['POST'])
def get_mapped_predicates():
    # access the rml mapping from the request body
    rml_mapping = request.get_json()

    print("RML mapping: ", rml_mapping, flush=True)

    # load the graph from the rml mapping
    rg = RDFGraph()
    rg.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    rg.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    rg.bind('ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
    rg.parse(data=json.dumps(rml_mapping), format='json-ld')

    # log number of triples
    print(f"Found {len(rg)} triples in the mapping", flush=True)

    # get all predicates from the graph along with the reference or parentTriplesMap
    predicates = rg.query("""
    PREFIX rr: <http://www.w3.org/ns/r2rml#>
    PREFIX rml: <http://semweb.mmlab.be/ns/rml#>

    SELECT DISTINCT ?predicate ?mappingValue ?child
    WHERE {
        ?triplesMap a rr:TriplesMap ;
                    rr:predicateObjectMap ?predicateObjectMap .
        ?predicateObjectMap rr:predicate ?predicate ;
                            rr:objectMap ?objectMap .
        OPTIONAL {
            ?objectMap rml:reference ?reference .
        }
        OPTIONAL {
            ?objectMap rr:parentTriplesMap ?parentTriplesMap .
        }
        OPTIONAL {
            ?objectMap rr:joinCondition ?join .
            ?join rr:child ?child .
        }
        BIND(COALESCE(?reference, ?parentTriplesMap) AS ?mappingValue)
    }
    """)

    # log number of predicates
    print(f"Found {len(predicates)} predicates in the mapping", flush=True)

    # print the predicates
    for predicate, mapping_value, child in predicates:
        print(
            f"Predicate: {predicate}, mapping value: {mapping_value}, child: {child}", flush=True)

    # return empty list if no predicates
    if len(predicates) == 0:
        return json.dumps([])

    # return the predicates with reference or parentTriplesMap
    mapped_predicates = []
    for predicate, mapping_value, child in predicates:
        if child is not None:
            mapped_predicates.append({
                "predicate": str(predicate),
                "reference": str(mapping_value),
                "child": str(child)
            })
        else:
            mapped_predicates.append({
                "predicate": str(predicate),
                "reference": str(mapping_value)
            })

    return json.dumps(mapped_predicates)
