import json
from flask import Blueprint, request
from rdflib import Graph as RDFGraph

get_ontology_class_blueprint = Blueprint('get_ontology_class', __name__)


@get_ontology_class_blueprint.route("/get_ontology_class", methods=['POST'])
def get_ontology_class():
    # access the json-ld request body
    json_ld = request.json['rule']
    table_name = request.json['table_name']

    json_ld = json.dumps(json_ld)

    # create the RDF graph
    rg = RDFGraph()
    rg.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    rg.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    rg.bind('ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
    rg.parse(data=json_ld, format='json-ld')

    # Define the SPARQL query
    sparql_query = f'''
        PREFIX rr: <http://www.w3.org/ns/r2rml#>
        PREFIX rml: <http://semweb.mmlab.be/ns/rml#>

        SELECT ?triplesMap ?class
        WHERE {{
        ?triplesMap a rr:TriplesMap .
        ?triplesMap rml:logicalSource ?logicalSource .
        ?logicalSource rr:tableName "{table_name}" .
        ?triplesMap rr:subjectMap ?subjectMap .
        ?subjectMap rr:class ?class .
        }}
    '''

    # Execute the SPARQL query
    results = rg.query(sparql_query)

    # return empty string if no results
    if len(results) == 0:
        return ""

    # return only the class
    results = [str(result[1]) for result in results]

    # return the result
    result = results[0]
    print(result)
    return result
