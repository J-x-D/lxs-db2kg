import { OntologyProperty } from "./OntologyProperty";

export interface OntologyClass {
  name: string;
  properties: OntologyProperty[];
  subClassOf: string;
}
