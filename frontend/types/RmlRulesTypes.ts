export interface RmlRule {
  "@graph": Graph[];
}

export interface Graph {
  "@id"?: string;
  "@type"?: string;
  "rr:logicalSource": LogicalSource;
  "rr:subjectMap": SubjectMap;
  "rr:predicateObjectMap": PredicateObjectMap[];
}

export interface LogicalSource {
  "@id"?: string;
  "@type"?: string;
  "rr:source": string;
  "rr:referenceFormulation"?: string;
  "rr:query"?: string;
}

export interface SubjectMap {
  "@id"?: string;
  "@type"?: string;
  "rr:template": string;
  "rr:class": string;
}

export interface JoinCondition {
  "@id"?: string;
  "@type"?: string;
  "rr:child": string;
  "rr:parent": string;
}

export interface PredicateObjectMap {
  "@id"?: string;
  "@type"?: string;
  "rr:predicate": string;
  "rr:objectMap": {
    "rr:parentTriplesMap"?: string;
    "@id"?: string;
    "@type"?: string;
    "rr:column"?: string;
    "rr:joinCondition"?: JoinCondition;
    "rr:template"?: string;
    "rr:class"?: string;
  };
}

export interface RmlRulePerTable {
  [key: string]: RmlRule;
}
