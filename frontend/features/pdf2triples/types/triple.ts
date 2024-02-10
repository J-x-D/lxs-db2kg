import { z } from "zod";

export interface RDFResource {
  id: string;
  "@id"?: string;
  "@type"?: string[];
  [key: string]: RDFValue | RDFValue[] | RDFProperty[] | undefined | string | string[];
}

export interface RDFValue {
  "@value": string;
  "@id"?: string;
  "@type"?: string[];
  [key: string]: RDFValue | RDFValue[] | RDFProperty[] | undefined | string | string[];
}

export interface RDFProperty {
  "@id": string;
  "@type": string[];
  "http://www.w3.org/2000/01/rdf-schema#label"?: RDFValue[];
  "http://www.w3.org/2000/01/rdf-schema#comment"?: RDFValue[];
  [key: string]: RDFValue | RDFValue[] | RDFProperty[] | undefined | string | string[];

}

export const KNOWN_KEYS = [
  "id",
  "@id",
  "@type",
  "@value",
  "http://www.w3.org/2000/01/rdf-schema#label",
  "http://www.w3.org/2000/01/rdf-schema#comment",
];


export const lxsWordSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().min(1),
});

export const lxsWordsSchema = z.array(lxsWordSchema);

export type LxsWords = z.infer<typeof lxsWordsSchema>;

