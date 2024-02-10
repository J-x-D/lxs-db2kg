import { CreateChatCompletionRequest } from './../../node_modules/openai/api';
import { OpenAIApi } from 'openai';
import { Configuration } from 'openai';
import { NextApiRequest, NextApiResponse } from "next";
import { encode } from 'gpt-3-encoder';
import { SchemaTableColumnMap } from 'types/SchemaTableColumnMap';
import { parse } from 'pg-connection-string';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
});
const openai = new OpenAIApi(configuration);

const triplesMapTemplate = `
@prefix rr: <http://www.w3.org/ns/r2rml#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix ex: <http://example.com/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rml: <http://semweb.mmlab.be/ns/rml#> .
@prefix ql: <http://semweb.mmlab.be/ns/ql#> .
@prefix d2rq: <http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#> .

@base <http://example.com/base/> .

<TriplesMap1>
  a rr:TriplesMap;

  rml:logicalSource [
    rml:source <#DB_source>;
    rr:sqlVersion rr:SQL2008;
    rr:tableName "university.<table_name>";
];

  rr:subjectMap [
      rr:template "http://example.com/{id}";
      rr:class <class_name>
    ];

    rr:predicateObjectMap [
      rr:predicate foaf:<predicate_name>; ;
      rr:objectMap [
        rml:reference "<column_name>"
      ]
    ].

<#TriplesMap1> a rr:TriplesMap;
  rml:logicalSource [
    rml:source <#DB_source>;
    rr:sqlVersion rr:SQL2008;
    rr:tableName "university.<table_name>";
];

  rr:subjectMap [
      rr:template "http://example.com/{id}"
  ];

  rr:predicateObjectMap [
    rr:predicate foaf:<predicate_name>; ;
    rr:objectMap [
      rr:parentTriplesMap <#TriplesMap2>;
      rr:joinCondition [
        rr:child <column_name>;
        rr:parent <column_name>;
      ];
    ];
  ].
`;


type TriplesMap = {
  rmlRule?: string;
  error?: any
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TriplesMap>
) {
  if (req.method === 'POST') {

    const database = req.body.database as SchemaTableColumnMap;
    const logicalSource = req.body.logicalSource;
    const tableName = req.body.tableName;
    const ontologies = req.body.ontologies;

    if (!database || !logicalSource || !tableName || !ontologies) {
      // console.log('%cgenerateTriplesMaps.ts line:274 database, ontology, logicalSource', 'color: #007acc;', database, logicalSource, tableName, ontologies);
      res.status(400).json({ rmlRule: '' });
      return;
    }

    const completionRequest = getCompletionRequest(database, logicalSource, tableName, ontologies);

    try {
      const response = await openai.createChatCompletion(completionRequest);
      const turtleResponse = response.data.choices[0].message;

      res.status(200).json({ rmlRule: turtleResponse?.content ?? '' });
    } catch (error) {
      // console.log('%cllm.ts line:37 error', 'color: #007acc;', error.message);
      res.status(500).json({ error: JSON.stringify(error) });
    }
  }

  res.status(200).json({ rmlRule: '' })
}


function getCompletionRequest(database: SchemaTableColumnMap, logicalSource: string, table: string, ontologies: string): CreateChatCompletionRequest {
  // parse logical source connection string to get database information
  const parsedLogicalSource = parse(logicalSource);

  const content = `
    database schema: ${JSON.stringify(database)}
    ontology: ${JSON.stringify(ontologies)}

    Create RML rules in Turtle format for the table_name ${table}. 
    Some table joins may be required. 
    Joins should be done based on the relations property of the table.  

    Use the following Turtle as a template: 
    ${triplesMapTemplate}
    
    <#DB_source> a d2rq:Database;
      d2rq:jdbcDSN "jdbc:postgresql://${parsedLogicalSource.host}:${parsedLogicalSource.port}/${parsedLogicalSource.database}";
      d2rq:jdbcDriver "org.postgresql.Driver";
      d2rq:username "${parsedLogicalSource.user}";
      d2rq:password "${parsedLogicalSource.password}" .
  `;

  const encoded = encode(content)
  // console.log('%cgenerateTriplesMaps.ts line:184 TOKEN: ', 'color: #007acc;', 'used for prompt', encoded.length, 'remaining', 2048 - encoded.length);

  return {
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a programmer that provides only RML rules in turtle format based on the given database schema and ontology snippets for one specific given table. You provide only code but no further explanation." },
      { role: "user", content }],
  }
}