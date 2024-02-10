import axios from "axios";

import { Triples } from "types/Triples";

export default async function updateTriple(
  previousTriple: Triples,
  newTriple: Triples,
  rmlRule?: []
) {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/update_triple";
  const data = {
    old_triple: {
      subject: previousTriple.subject,
      predicate: previousTriple.predicate,
      object: previousTriple.object,
    },
    new_triple: {
      subject: newTriple.subject,
      predicate: newTriple.predicate,
      object: newTriple.object,
    },
    rml_rule: !rmlRule && [
      {
        "@id": "http://example.com/base/#DB_source",
        "@type": [
          "http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#Database",
        ],
        "http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#jdbcDSN": [
          {
            "@value": "jdbc:postgresql://10.163.135.248:5433/db",
          },
        ],
        "http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#jdbcDriver": [
          {
            "@value": "org.postgresql.Driver",
          },
        ],
        "http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#password": [
          {
            "@value": "YourStrong!Passw0rd",
          },
        ],
        "http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#username": [
          {
            "@value": "ex",
          },
        ],
      },
      {
        "@id": "http://example.com/base/#university_professor_TriplesMap",
        "@type": ["http://www.w3.org/ns/r2rml#TriplesMap"],
        "http://semweb.mmlab.be/ns/rml#logicalSource": [
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b1",
          },
        ],
        "http://www.w3.org/ns/r2rml#predicateObjectMap": [
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b3",
          },
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b5",
          },
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b7",
          },
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b9",
          },
        ],
        "http://www.w3.org/ns/r2rml#subjectMap": [
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b2",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b1",
        "http://semweb.mmlab.be/ns/rml#source": [
          {
            "@id": "http://example.com/base/#DB_source",
          },
        ],
        "http://www.w3.org/ns/r2rml#sqlVersion": [
          {
            "@id": "http://www.w3.org/ns/r2rml#SQL2008",
          },
        ],
        "http://www.w3.org/ns/r2rml#tableName": [
          {
            "@value": "university.professor",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b2",
        "http://www.w3.org/ns/r2rml#class": [
          {
            "@id": "http://ebiquity.umbc.edu/ontology/person.owl#Professor",
          },
        ],
        "http://www.w3.org/ns/r2rml#template": [
          {
            "@value": "http://example.com/{id}",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b3",
        "http://www.w3.org/ns/r2rml#objectMap": [
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b4",
          },
        ],
        "http://www.w3.org/ns/r2rml#predicate": [
          {
            "@id": "http://xmlns.com/foaf/0.1/firstName",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b4",
        "http://semweb.mmlab.be/ns/rml#reference": [
          {
            "@value": "first_name",
          },
        ],
        "http://www.w3.org/ns/r2rml#column": [
          {
            "@value": "first_name",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b5",
        "http://www.w3.org/ns/r2rml#objectMap": [
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b6",
          },
        ],
        "http://www.w3.org/ns/r2rml#predicate": [
          {
            "@id": "http://xmlns.com/foaf/0.1/lastName",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b6",
        "http://semweb.mmlab.be/ns/rml#reference": [
          {
            "@value": "last_name",
          },
        ],
        "http://www.w3.org/ns/r2rml#column": [
          {
            "@value": "last_name",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b7",
        "http://www.w3.org/ns/r2rml#objectMap": [
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b8",
          },
        ],
        "http://www.w3.org/ns/r2rml#predicate": [
          {
            "@id": "http://xmlns.com/foaf/0.1/birthdate",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b8",
        "http://semweb.mmlab.be/ns/rml#reference": [
          {
            "@value": "birthdate",
          },
        ],
        "http://www.w3.org/ns/r2rml#column": [
          {
            "@value": "birthdate",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b9",
        "http://www.w3.org/ns/r2rml#objectMap": [
          {
            "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b10",
          },
        ],
        "http://www.w3.org/ns/r2rml#predicate": [
          {
            "@id": "http://xmlns.com/foaf/0.1/fieldOfSubject",
          },
        ],
      },
      {
        "@id": "_:nf41a4f7f9b43492792c1f25c60c60ce9b10",
        "http://semweb.mmlab.be/ns/rml#reference": [
          {
            "@value": "field_of_subject",
          },
        ],
        "http://www.w3.org/ns/r2rml#column": [
          {
            "@value": "field_of_subject",
          },
        ],
      },
    ],
  };

  const result = await axios.post(url, data, {
    headers: {
      // Overwrite Axios's automatically set Content-Type
      "Content-Type": "application/json",
    },
  });
}
