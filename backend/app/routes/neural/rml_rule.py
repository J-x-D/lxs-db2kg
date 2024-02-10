import re
from flask import Blueprint, render_template, abort, request
import json
from sqlalchemy import create_engine
from tiktoken import get_encoding
from openai import OpenAI
import os

from rdflib import Graph as RDFGraph

rml_rule_blueprint = Blueprint('rml_rule', __name__)


@rml_rule_blueprint.route('/rml_rule', methods=['POST'])
def rml_rule():
    # access request parameters
    database = request.json['database']
    logicalSource = request.json['logicalSource']
    table = request.json['table']
    schema = request.json['schema']
    ontologies = request.json['ontologies']
    prefixes = request.json['prefixes']

    # replace "postgres" with "postgresql" in the logicalSource
    if not "postgresql" in logicalSource and "postgres" in logicalSource:
        logicalSource = logicalSource.replace("postgres", "postgresql")

    if not database or not logicalSource or not table or not ontologies:
        print("Missing parameters")
        return ""

    # prefixes = extract_domains(ontologies, prefixes)
    # print("Domains: ", prefixes)

    # get the completion request
    completionRequest = getCompletionRequest(
        database, logicalSource, table, ontologies, schema, prefixes)

    # send prompt to GPT-4
    turtle_response = send_prompt(completionRequest)

    print("Response from GPT-4:", turtle_response, flush=True)

    try:
        # serialize the response to json-ld
        try:
            return process_response(turtle_response)
        except Exception as e:
            print("Error: ", e, flush=True)
            print("Resending prompt to get a valid response...", flush=True)
            new_prompt = getErrorCompletionRequest(completionRequest, e)
            new_response = send_prompt(new_prompt)
            return process_response(new_response)
    except Exception as e:
        print("Error: ", e)
        return "", 500


def send_prompt(prompt):
    client = OpenAI(
        api_key=os.getenv('OPENAI_API_KEY'),
        organization=os.environ.get('OPENAI_ORGANIZATION')
    )
    print("Sending prompt to GPT-4...", flush=True)
    print(prompt)

    response = client.chat.completions.create(model="gpt-4-0613",
    messages=[
        {"role": "system", "content": "You are a programmer that provides only RML rules in turtle format based on the given database schema and ontology snippets for one specific given table. You provide only code but no further explanation."},
        {"role": "user", "content": prompt},
    ])
    turtle_response = response.choices[0].message.content
    print(turtle_response, flush=True)
    return turtle_response


def process_response(response):
    rg = RDFGraph()
    rg.bind('ns1', 'http://www.w3.org/ns/r2rml#')
    rg.bind('ns2', 'http://semweb.mmlab.be/ns/rml#')
    rg.bind('ns3', 'http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')

    rg.parse(data=response, format='ttl')
    json_ld = rg.serialize(
        format='json-ld', encoding='utf-8').decode('utf-8')

    return json_ld


def getErrorCompletionRequest(previous_prompt, error):
    content = f"""
    {previous_prompt}

    The RML rule seems to be incorrect.
    While trying to process the RML rule, the following error occurred: {error}
    """
    return content


def getCompletionRequest(database, logicalSource, table, ontologies, schema, prefixes):
    triplesMapTemplate = f'''
    @prefix ns1: <http://www.w3.org/ns/r2rml#> .
    @prefix ns2: <http://semweb.mmlab.be/ns/rml#> .
    @prefix ns3: <http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#> .
    {build_prefixes(prefixes)}

    
    @base <http://example.com/base/> .

    <#<Schema>_<Table>_TriplesMap> a ns1:TriplesMap;

    ns2:logicalSource [
        ns2:source <#DB_source>;
        ns1:sqlVersion ns1:SQL2008;
        ns1:tableName "<schema>.<table>";
    ];

    ns1:subjectMap [
        ns1:template "http://example.com/base/<schema>#<table_name>/{id}";
        ns1:class <class_name_of_ontology_containing_#>
    ];

    ns1:predicateObjectMap [
        ns1:predicate <property_from_ontology>;
        ns1:objectMap [
            ns2:reference "<column_name>";
        ]
    ];
      
    ns1:predicateObjectMap [
            ns1:predicate <property_from_ontology>;
            ns1:objectMap [
                ns1:parentTriplesMap <#<Schema>_<Table>_TriplesMap>;
                ns1:joinCondition [
                    ns1:child "<column_name>";
                    ns1:parent "<foreign_column_name>";
                    ]
            ];
    ].
'''

    url = create_engine(logicalSource).url

    content = f"""
    database: {json.dumps(database)}
    ontology: {json.dumps(ontologies)}
    schema: {schema}

    Create RML rules in Turtle format only for the table {table} and all its columns. 
    It may be necessary to join tables. Therefore use only the parentTriplesMap property of the ns1:objectMap.
    You are not allowed to create the RML rules for other tables.
    Keep in mind that every TriplesMap should contain a subjectMap and at least one predicateObjectMap.
    Note that the provided prefixes can be used for properties that are not defined in the ontology - if you use the ontology properties, you have to stick to them.
    Keep the base URI as it is (http://example.com/base/).

    Use the following template for the TriplesMap. Replace the placeholders with the correct values. 
    Template:
    {triplesMapTemplate}
    
    <#DB_source> a ns3:Database;
      ns3:jdbcDSN "jdbc:postgresql://{url.host}:{url.port}/{url.database}";
      ns3:jdbcDriver "org.postgresql.Driver";
      ns3:username "{url.username}";
      ns3:password "{url.password}" .

    Remember to create the RML rules for all the columns of a table and to avoid syntax errors and any explanation.
  """

    encoder = get_encoding("p50k_base")

    remaining_tokens = 4097 - len(encoder.encode(content))

    print("Remaining tokens: ", remaining_tokens, flush=True)

    return content


def build_prefixes(prefixes):

    # iterate over prefixes and build the following string "@prefix <prefixes[i][prefix]>: <prefixes[i][url]> ."
    prefix_string = ""
    for prefix in prefixes:
        prefix_string += f"@prefix {prefix['prefix']}: <{prefix['url']}#> .\n"

    return prefix_string


def extract_domains(ontologies, prefixes):
    for ontology in ontologies:
        url = ontology['@id']
        if url:
            url = url.split('#')[0]  # Remove everything after '#'
            pattern = r":\/\/(.*?)\/"
            match = re.search(pattern, url)
            if match:
                domain = match.group(1)
                prefix = domain.split(".")[0]
                # remove all -
                prefix = prefix.replace("-", "_")

                # check if domain is not already in the list
                if not any(d['prefix'] == prefix for d in prefixes):
                    prefixes.append({
                        "prefix": prefix,
                        "url": url
                    })
    return prefixes
