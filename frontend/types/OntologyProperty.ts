export interface OntologyProperty {
  range?: string;
  type?: string;
  datatype?:
    | "String"
    | "Integer"
    | "Float"
    | "Boolean"
    | "Date"
    | "Time"
    | "DateTime"
    | "Language-tagged string"
    | "ObjectProperty";
  DatatypeProperty?: string;
  ObjectProperty?: string;
}
