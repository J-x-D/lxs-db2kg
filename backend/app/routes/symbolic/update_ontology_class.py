from flask import Blueprint, request
from rdflib import Graph as RDFGraph, URIRef
import json

# blueprint definition
update_ontology_class_blueprint = Blueprint(
    'update_ontology_class', __name__)


@update_ontology_class_blueprint.route('/update_ontology_class', methods=['POST'])
def update_ontology_class():
    body = request.get_json()
    # access the classes from the request body and set as URIRef objects
    old_ontology_class = body['old_ontology_class']
    new_ontology_class = body['new_ontology_class']

    # access the RML rule from the request body
    rml_rule = json.dumps(body['rml_rule'])

    # create the RDF graph
    rg = RDFGraph()
    rg.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    rg.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    rg.bind(
        'ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
    rg.parse(data=rml_rule, format='json-ld')

    print("Replace ontology class: '" + old_ontology_class +
          "' with '" + new_ontology_class + "' in RML rule.")

    # Define the SPARQL update query with the old and new ontology class variables
    update_query = f"""
        PREFIX rr: <http://www.w3.org/ns/r2rml#>

        DELETE {{
        ?instance rr:class ?oldClass .
        }}
        INSERT {{
        ?instance rr:class ?newClass .
        }}
        WHERE {{
        ?instance rr:class ?oldClass .
        BIND (<{old_ontology_class}> AS ?oldClass)
        BIND (<{new_ontology_class}> AS ?newClass)
        }}
    """

    # Execute the update query on the graph
    rg.update(update_query)

    # Return the updated RML rule
    return rg.serialize(format='json-ld')
