from flask import Blueprint, request, send_file
from rdflib import Graph as RDFGraph
import re
import json
from pyshacl import validate
from flask import Blueprint, request
from sqlalchemy import create_engine
import os

# blueprint definition
run_rml_mapper_blueprint = Blueprint(
    'combine', __name__)

LOCATION = os.getcwd()

route = LOCATION + '/temp/mapping.ttl'


@run_rml_mapper_blueprint.route('/run_rml_mapper', methods=['POST'])
def run_rml_mapper():
    # access rules from request body
    rules = request.json['rules']
    connection_string = request.json['connection_string']

    # parse connection string -> replace postgresql:// with postgresql://
    connection_string = f"postgresql://{connection_string.split('://')[1]}"
    print(connection_string)

    graph = combine_all(rules)
    print("The combined RML rules are valid.")

    config(connection_string)
    print("The config file has been stored")

    upload_file(graph)
    print("The mapping file has been stored")

    create_graph()
    print("The file has been semantified")

    return download()


def combine_all(rules):

    graphs = []

    for rule in rules:
        graph = RDFGraph()
        graph.bind('ns1', 'http://www.w3.org/ns/r2rml#')
        graph.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
        graph.bind('ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
        graph.parse(data=rule, format='json-ld')
        graphs.append(graph)

    # combine all graphs
    combined_graph = RDFGraph()
    combined_graph.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    combined_graph.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    combined_graph.bind(
        'ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
    for graph in graphs:
        combined_graph += graph

    # serialize the graph to turtle
    turtle = combined_graph.serialize(format='turtle')

    return validate_rml_rules(turtle)


def validate_rml_rules(graph):
    rml_graph = RDFGraph()
    rml_graph.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    rml_graph.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    rml_graph.bind(
        'ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
    rml_graph.parse(data=graph, format="turtle")

    conforms, _, _ = validate(rml_graph, shacl_graph=None, ont_graph=None, inference='rdfs',
                              abort_on_error=False, advanced=True, debug=False, profile=None, serialize_report_graph=False)

    if conforms:
        print("The combined RML rules are valid.")
        return rml_graph.serialize(format='json-ld')
    else:
        print("The combined RML rules are not valid.")
        return "The combined RML rules are not valid."


def config(connection_string):

    # access the url parameter
    url = create_engine(connection_string, echo=False).url

    static_config = '''
[datasets]
number_of_datasets: 1
output_folder: {LOCATION}/temp/graph
all_in_one_file: no
remove_duplicate: yes
enrichment: yes
dbType: postgres
name: output
ordered: yes
output_format: n-triples

[dataset1]
user: {user}
password: {password}
host: {host}
db: {database}
name: OutputRDFkg
port: 5432
mapping: {LOCATION}/temp/mapping.ttl
'''.format(LOCATION=LOCATION, user=url.username, password=url.password, host=url.host, database=url.database)

    fileName = ''
    # apped the parameter to the file in ../config/config.ini
    with open(LOCATION + '/config/config_test.ini', 'w') as f:
        f.write(static_config)
        fileName = f.name
        f.close()

    return "The file has been stored " + fileName + "\n"


def upload_file(rules):
    # access the mapping from the request body
    print(rules)

    # serialize the response to turtle
    rg = RDFGraph()
    rg.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    rg.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    rg.bind(
        'ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
    rg.parse(data=rules, format='json-ld')
    turtle = rg.serialize(
        format='turtle', encoding='utf-8').decode('utf-8')

    # write the mapping to a file in ../temp/mapping.ttl
    fileName = ''
    with open(route, 'w') as f:
        f.write(turtle)
        fileName = f.name
        f.close()

    print("The file has been stored " + fileName)


def create_graph():
    print(LOCATION)
    # create a graph from the config file by calling the rdfizer from the command line like done in SDM-RDFizer library
    os.system("python3 -m rdfizer -c" + LOCATION +
              "/config/config_test.ini")
    print("The file has been semantified \n")


def download():
    # download file from /temp/graph/OutputRDFkg.ttl
    # return send_file(LOCATION + '/temp/graph/OutputRDFkg.nt', as_attachment=True)
    return send_file(LOCATION + '/temp/mapping.ttl', as_attachment=True)
