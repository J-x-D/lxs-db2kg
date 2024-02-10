import { SchemaTableColumnMap } from "../types/SchemaTableColumnMap";
import produce from "immer";
import { CustomAlert, LxsStore } from "./store.d";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Prefix } from "types/Prefixes";
import { ExtractedTextResponse } from "features/pdf2triples/sections/content/types/pdfResponse";
import { LxsWords, RDFResource } from "features/pdf2triples/types/triple";

export type CustomLxsStore = LxsStore;

const defaultPrompts = [
  {
    label: "Generate Triples",
    description: "Generate triples from the provided text.",
    prompt: `
      ###Instruction###
      Create a knowledge graph based on the provided abstract that extracts all the knowledge and return it in TURTLE format.
      You must add the text passages to indicate where the knowledge comes from by specifying a "rdfs:comment" as valid string (escaping is neccessary).
      Provide classes, properties, and relationships as seen in the example.
      Provide a different triple (containing the "rdfs:comment" with the information source) for every relationship.
      Make sure that the provided template in the example section is met and labels and comments are set properly.
      Do only use defined Objects and Predicates in the Relationship section.
      You must define all Objects and Predicates in the Object and Predicate section.
      You get penalized if you change a sentence in "rdfs:comment" or if you do not provide the complete sentence.
      The "rdfs:comment" must also be a valid string, so you have to escape double quotes (\").

      ###Template###
      Use the following structure to provide triples in TURTLE format:

      #Namespaces
      @prefix ex: <http://example.org/> .
      @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
      @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
      @prefix owl: <http://www.w3.org/2002/07/owl#> .
      ...
      #Objects
      ex:<fitting_and_required_object_identifier> rdf:type owl:Class ;
          rdfs:label "<fitting_and_required_object_label>" .
      ...
      #Predicates
      ex:<fitting_and_required_predicate_identifier> rdf:type rdf:<fitting_and_required_property_type>;
          rdfs:label "<fitting_and_required_predicate_label>" .
      ...
      #Relationships
      ex:<fitting_and_required_subject_identifier> rdf:type rdf:<fitting_and_required_subject_class>;
          rdfs:label "<fitting_and_required_subject_label> ";
          ex:<fitting_and_predicate_identifier> ex:<fitting_and_required_object_identifier> ;
          rdfs:comment "{\"<fitting_and_required_predicate_identifier>\":\"<complete unmodified sentence the triple's knowledge is coming from (required)>\"}" .
      ...
      ###Input###
      "<placeholder_text>"

      Do only provide the code and no explanation or any other output.
      `,
  },
  {
    label: "Remap Triple (No Ontology)",
    description: "Remap triple without ontology.",
    prompt: `
      ###Instruction###
      You are given triples in JSON-LD format.
      You must find better types and labels for the subject and object triples.
      You can also provide a new predicate if you think the provided predicate does not fit.
      The connecting predicate is "<placeholder_predicate>", do not forget to exchange it with the new predicate.
      Edit the types and labels as seen in the example.
      
      Provide valid JSON-LD.

      ###Example###
      If you need to redefine the predicate, provide a triple like this:
      [
        {
          "id": "<do not change id>",
          "@id": "http://example.org/<better fitting subject label based on comment>",
          "@type": [
            "<better fitting subject type>"
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            {
              "@value": "<new and better fitting subject label>"
            }
          ],
          "<id of better fitting predicate that is defined below>": [
            {
              "@id": "<better fitting object id that is defined below>"
            }
          ],
          "http://www.w3.org/2000/01/rdf-schema#comment": [
            {
              "@value": "Connected homes and smart assistants shape the future practices of humans, but Connected homes and smart assistants do not yet perfectly fit humans's needs and processes."
            }
          ]
        },
        {
          "id": "<do not change id>",
          "@id": "http://example.org/<better fitting predicate label based on comment>",
          "@type": [
            "http://www.w3.org/2002/07/owl#ObjectProperty"
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            {
              "@value": "<new and better fitting predicate label>"
            }
          ]
        },
        {
          "id": "<do not change id>",
          "@id": "http://example.org/<better fitting object label based on comment>",
          "@type": [
            "<better fitting object type>"
          ],
          "http://www.w3.org/2000/01/rdf-schema#label": [
            {
              "@value": "<new and better fitting object label>"
            }
          ]
        }
      ]

      ###Input###
      triples: "<placeholder_triple>"

      Do only provide the code and no explanation or any other output only the valid JSON.
      `,
  },
];

const initialTriples: RDFResource[] = [] as RDFResource[];

export const initialState = {
  dbConnectionString: "",
  ontologyUrls: [] as (string | undefined)[],
  selectedTable: "",
  schema: "",
  schemas: new Array<string>(),
  alert: { type: "info", message: "", open: false } as CustomAlert,
  database: {
    schemaTableColumnMap: [
      {
        tables: [],
        schema: "",
      },
    ],
  } as SchemaTableColumnMap,
  allTableNames: new Array<string>(),
  tablesForSchemaNames: new Array<string>(),
  rmlRules: {},
  rmlLoading: false,
  prefixes: new Array<Prefix>(),
  prefixOptions: new Array<string>(),
  globalDisabled: false,
  showGuidance: true,
  tablesOrientation: "vertical" as "horizontal" | "vertical",
  advancedMode: false,
  tableRows: 5,
  showTablePagination: true,
  createdEmbeddings: false,
  pdf2triplesSelectedPosition: null as number[][] | null,
  pdf2triplesSelectedSpan: null as DOMRect | null,
  selectedRDFResource: null as RDFResource | null,
  pdf2triplesGlobalPdf: null as ExtractedTextResponse | null,
  pdf2triplesPdfSource: "",
  pdf2triplesPdfEditMode: false,
  pdf2triplesPdfWasEdited: false,
  pdf2triplesHideTriples: false,
  pdf2triplesGenerateFullText: true,
  pdf2TriplesGeneratePartialText: "",
  rdfResources: initialTriples,
  pdf2triplesLxsWords: [] as LxsWords,
  pdf2triplesLxsSelectedWords: [] as LxsWords,
  pdf2triplesLxsChangeMode: "subject" as "subject" | "object" | null,
  pdf2triplesLxsHideConnections: false,
  pdf2triplesLxsTextOutlineColor: undefined as string | undefined,
  topics: [] as string[],
  category: "",
  prompts: defaultPrompts,
  pdf2triplesGenerateBasedOntology: true,
  pdf2triplesLxsSelectedText: "",
};
export const useStore = create<LxsStore>()(
  devtools(
    persist(
      (set: Function) => ({
        // State
        ...initialState,
        // Actions
        setOntologyUrls: (ontologyUrl: (string | undefined)[]) =>
          set(
            produce((state: LxsStore) => {
              state.ontologyUrls = ontologyUrl;
            }),
          ),
        setGlobalDisabled: (globalDisabled: boolean) =>
          set(
            produce((state: LxsStore) => {
              state.globalDisabled = globalDisabled;
            }),
          ),
        setDbConnectionString: (dbConnectionString: string) =>
          set(
            produce((state: LxsStore) => {
              state.dbConnectionString = dbConnectionString;
            }),
          ),
        setSelectedTable: (selectedTable: string) =>
          set(
            produce((state: LxsStore) => {
              state.selectedTable = selectedTable;
            }),
          ),
        setSchema: (schema: string) =>
          set(
            produce((state: LxsStore) => {
              state.schema = schema;
            }),
          ),
        setSchemas: (schemas: string[]) =>
          set(
            produce((state: LxsStore) => {
              state.schemas = schemas;
            }),
          ),
        setAlert: (alert: CustomAlert) =>
          set(
            produce((state: LxsStore) => {
              state.alert = alert;
            }),
          ),
        setDatabase: (database: SchemaTableColumnMap) =>
          set(
            produce((state: LxsStore) => {
              state.database = database;
            }),
          ),
        setAllTableNames: (allTableNames: string[]) =>
          set(
            produce((state: LxsStore) => {
              state.allTableNames = allTableNames;
            }),
          ),
        setTablesForSchemaNames: (tablesForSchemaNames: string[]) =>
          set(
            produce((state: LxsStore) => {
              state.tablesForSchemaNames = tablesForSchemaNames;
            }),
          ),
        setRmlRules: (table: string, rmlRule: any) =>
          set(
            produce((state: LxsStore) => {
              state.rmlRules[table] = rmlRule;
            }),
          ),
        setRmlLoading: (rmlLoading: boolean) =>
          set(
            produce((state: LxsStore) => {
              state.rmlLoading = rmlLoading;
            }),
          ),
        deleteRmlRule: (table: string) =>
          set(
            produce((state: LxsStore) => {
              delete state.rmlRules[table];
            }),
          ),
        setPrefixes: (prefixes: Prefix[]) =>
          set(
            produce((state: LxsStore) => {
              state.prefixes = prefixes;
            }),
          ),
        setShowGuidance: (showGuidance: boolean) =>
          set(
            produce((state: LxsStore) => {
              state.showGuidance = showGuidance;
            }),
          ),
        setTablesOrientation: (tablesOrientation: string) =>
          set(
            produce((state: LxsStore) => {
              state.tablesOrientation = tablesOrientation as
                | "horizontal"
                | "vertical";
            }),
          ),
        setAdvancedMode: (advancedMode: boolean) =>
          set(
            produce((state: LxsStore) => {
              if (!advancedMode) {
                const newState = structuredClone(initialState);
                state.tablesOrientation = newState.tablesOrientation;
                state.tableRows = newState.tableRows;
                state.showTablePagination = newState.showTablePagination;
              }
              state.advancedMode = advancedMode;
            }),
          ),
        setTableRows: (tableRows: number) =>
          set(
            produce((state: LxsStore) => {
              state.tableRows = tableRows;
            }),
          ),
        setShowTablePagination: (showTablePagination: boolean) =>
          set(
            produce((state: LxsStore) => {
              state.showTablePagination = showTablePagination;
            }),
          ),
        setCreatedEmbeddings: (createdEmbeddings: boolean) =>
          set(
            produce((state: LxsStore) => {
              state.createdEmbeddings = createdEmbeddings;
            }),
          ),

        setPdf2triplesSelectedPosition: (
          pdf2triplesSelectedPosition: number[][] | null,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesSelectedPosition = pdf2triplesSelectedPosition;
            }),
          ),

        setPdf2triplesSelectedSpan: (
          pdf2triplesSelectedSpanRef: DOMRect | null,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesSelectedSpan = pdf2triplesSelectedSpanRef;
            }),
          ),

        setSelectedRDFResource: (triple: RDFResource | null) =>
          set(
            produce((state: LxsStore) => {
              state.selectedRDFResource = triple;
            }),
          ),

        setPdf2triplesGlobalPdf: (
          pdf2triplesGlobalPdf: ExtractedTextResponse | null,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesGlobalPdf = pdf2triplesGlobalPdf;
            }),
          ),

        setPdf2triplesPdfSource: (pdf2triplesPdfSource: string) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesPdfSource = pdf2triplesPdfSource;
            }),
          ),

        setPdf2triplesPdfEditMode: (pdf2triplesPdfEditMode: boolean) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesPdfEditMode = pdf2triplesPdfEditMode;
            }),
          ),

        setPdf2triplesPdfWasEdited: (pdf2triplesPdfWasEdited: boolean) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesPdfWasEdited = pdf2triplesPdfWasEdited;
            }),
          ),
        setPdf2triplesHideTriples: (pdf2triplesHideTriples: boolean) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesHideTriples = pdf2triplesHideTriples;
            }),
          ),

        setPdf2triplesGenerateFullText: (
          pdf2triplesGenerateFullText: boolean,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesGenerateFullText = pdf2triplesGenerateFullText;
            }),
          ),

        setPdf2TriplesGeneratePartialText: (
          pdf2TriplesGeneratePartialText: string,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2TriplesGeneratePartialText =
                pdf2TriplesGeneratePartialText;
            }),
          ),

        setRDFResources: (triples: RDFResource[]) =>
          set(
            produce((state: LxsStore) => {
              state.rdfResources = triples;
            }),
          ),

        setPdf2triplesLxsWords: (pdf2triplesLxsWords: LxsWords) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesLxsWords = pdf2triplesLxsWords;
            }),
          ),

        setPdf2triplesLxsSelectedWords: (
          pdf2triplesLxsSelectedWords: LxsWords,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesLxsSelectedWords = pdf2triplesLxsSelectedWords;
            }),
          ),
        setPdf2triplesLxsChangeMode: (
          pdf2triplesLxsChangeMode: "subject" | "object" | null,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesLxsChangeMode = pdf2triplesLxsChangeMode;
            }),
          ),

        handleDeleteLxsTriples: () =>
          set(
            produce((state: LxsStore) => {
              state.rdfResources = [];
            }),
          ),

        handleDeletePdf: () => {
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesGlobalPdf = {
                text: "",
                title: "",
              };
              state.category = "";
              state.topics = [];
              state.selectedRDFResource = null;
              state.pdf2triplesLxsWords = [];
              state.pdf2triplesPdfSource = "";
              state.pdf2triplesPdfWasEdited = false;
              state.pdf2triplesPdfEditMode = false;
              state.rdfResources = [];
              state.pdf2triplesGlobalPdf.text = "";
            }),
          );
        },

        setPdf2triplesLxsHideConnections: (
          pdf2triplesLxsHideConnections: boolean,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesLxsHideConnections =
                pdf2triplesLxsHideConnections;
            }),
          ),

        setPdf2triplesLxsTextOutlineColor: (
          pdf2triplesLxsTextOutlineColor: string | undefined,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesLxsTextOutlineColor =
                pdf2triplesLxsTextOutlineColor;
            }),
          ),
        setTopics: (topics: string[]) =>
          set(
            produce((state: LxsStore) => {
              state.topics = topics;
            }),
          ),
        setPrompts: (
          prompts: { label: string; description: string; prompt: string }[],
        ) =>
          set(
            produce((state: LxsStore) => {
              state.prompts = prompts;
            }),
          ),
        setCategory: (category: string) =>
          set(
            produce((state: LxsStore) => {
              state.category = category;
            }),
          ),
        resetPrompts: () =>
          set(
            produce((state: LxsStore) => {
              state.prompts = defaultPrompts;
            }),
          ),

        setPdf2triplesGenerateBasedOntology: (
          pdf2triplesGenerateBasedOntology: boolean,
        ) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesGenerateBasedOntology =
                pdf2triplesGenerateBasedOntology;
            }),
          ),

        enableDemoMode: () =>
          set(
            produce((state: LxsStore) => {
              state.rdfResources = initialTriples;
            }),
          ),

        setPdf2triplesLxsSelectedText: (pdf2triplesLxsSelectedText: string) =>
          set(
            produce((state: LxsStore) => {
              state.pdf2triplesLxsSelectedText = pdf2triplesLxsSelectedText;
            }),
          ),

        // @ts-ignore
        purge: () =>
          set(
            produce((state: LxsStore) => {
              const newState = structuredClone(initialState);
              state.rmlRules = newState.rmlRules;
              state.prefixes = newState.prefixes;
              state.ontologyUrls = newState.ontologyUrls;
              state.dbConnectionString = newState.dbConnectionString;
              state.schema = newState.schema;
              state.database = newState.database;
              state.allTableNames = newState.allTableNames;
              state.selectedTable = newState.selectedTable;
              state.tablesForSchemaNames = newState.tablesForSchemaNames;
              state.showGuidance = newState.showGuidance;
              state.tablesOrientation = newState.tablesOrientation;
              state.advancedMode = newState.advancedMode;
              state.createdEmbeddings = newState.createdEmbeddings;
              state.tableRows = newState.tableRows;
            }),
          ),
      }),
      {
        name: "lxs-storage",
      },
    ),
  ),
);
