import { SchemaTableColumnMap } from "types/SchemaTableColumnMap";
import { Prefix } from "types/Prefixes";

import { LxsWords } from "features/pdf2triples/types/triple";
import { RDFResource } from "types/RDF";
import { ExtractedTextResponse } from "features/pdf2triples/sections/content/types/pdfResponse";

export type LxsStore = {
  // state
  ontologyUrls: (string | undefined)[] = [process.env.NEXT_PUBLIC_ONTOLOGY_URL];
  dbConnectionString: string;
  selectedTable: string;
  schemas: string[];
  schema: string;
  alert: CustomAlert;
  database: SchemaTableColumnMap;
  allTableNames: string[];
  tablesForSchemaNames: string[];
  rmlRules: RmlRulePerTable;
  rmlLoading: boolean;
  prefixes: Prefix[];
  prefixOptions: string[];
  globalDisabled: boolean;
  showGuidance: boolean;
  tablesOrientation: "horizontal" | "vertical";
  advancedMode: boolean;
  tableRows: number;
  showTablePagination: boolean;
  createdEmbeddings: boolean;
  pdf2triplesSelectedPosition: number[][] | null;
  pdf2triplesSelectedSpan: DOMRect | null;
  selectedRDFResource: LxsTriple | null;
  pdf2triplesGlobalPdf: ExtractedTextResponse | null;
  pdf2triplesPdfSource: string;
  pdf2triplesPdfEditMode: boolean;
  pdf2triplesPdfWasEdited: boolean;
  pdf2triplesHideTriples: boolean;
  pdf2triplesGenerateFullText: boolean = false;
  pdf2TriplesGeneratePartialText: string = "";
  rdfResources: RDFResource[] = [];
  pdf2triplesLxsWords: LxsWords = [];
  pdf2triplesLxsSelectedWords: LxsWords = [];
  pdf2triplesLxsChangeMode: 'subject' | 'object' | null = 'subject';
  pdf2triplesLxsHideConnections: boolean = false;
  pdf2triplesLxsTextOutlineColor: string | undefined = undefined;
  prompts: { label: string, description: string; prompt: string }[] = []
  topics: string[] = [];
  category: string = "";
  pdf2triplesGenerateBasedOntology: boolean = true;
  pdf2triplesLxsSelectedText: string = "";
  // functions
  setOntologyUrls: (ontologyUrl: (string | undefined)[]) => void;
  setDbConnectionString: (dbConnectionString: string) => void;
  setSelectedTable: (selectedTable: string) => void;
  setSchema: (schema: string) => void;
  setSchemas: (schemas: string[]) => void;
  setAlert: (alert: CustomAlert) => void;
  setDatabase: (database: SchemaTableColumnMap) => void;
  setAllTableNames: (allTableNames: string[]) => void;
  setTablesForSchemaNames: (tablesForSchemaNames: string[]) => void;
  setRmlRules: (table: string, rmlRule: RmlRule) => void;
  purge: () => void;
  setRmlLoading: (rmlLoading: boolean) => void;
  deleteRmlRule: (table: string) => void;
  setPrefixes: (prefixes: Prefix[]) => void;
  setGlobalDisabled: (globalDisabled: boolean) => void;
  setShowGuidance: (showGuidance: boolean) => void;
  setTablesOrientation: (tablesOrientation: string) => void;
  setAdvancedMode: (advancedMode: boolean) => void;
  setTableRows: (tableRows: number) => void;
  setShowTablePagination: (showTablePagination: boolean) => void;
  setCreatedEmbeddings: (createdEmbeddings: boolean) => void;
  setPdf2triplesSelectedPosition: (
    pdf2triplesSelectedPosition: number[][] | null
  ) => void;
  setPdf2triplesSelectedSpan: (
    pdf2triplesSelectedSpanRef: DOMRect | null
  ) => void;
  setSelectedRDFResource: (
    triple: LxsTriple | null
  ) => void;
  setPdf2triplesGlobalPdf: (
    pdf2triplesGlobalPdf: ExtractedTextResponse | null
  ) => void;
  setPdf2triplesPdfSource: (pdf2triplesPdfSource: string) => void;
  setPdf2triplesPdfEditMode: (pdf2triplesPdfEditMode: boolean) => void;
  setPdf2triplesPdfWasEdited: (pdf2triplesPdfWasEdited: boolean) => void;
  setPdf2triplesHideTriples: (pdf2triplesHideTriples: boolean) => void;
  setPdf2triplesGenerateFullText: (
    pdf2triplesGenerateFullText: boolean
  ) => void;
  setPdf2TriplesGeneratePartialText: (
    pdf2triplesGeneratePartialText: string
  ) => void;
  setRDFResources: (triples: RDFResource[]) => void;
  setPdf2triplesLxsWords: (pdf2triplesLxsWords: LxsWords) => void;
  handleDeletePdf: () => void;
  handleDeleteLxsTriples: () => void;
  setPdf2triplesLxsSelectedWords: (
    pdf2triplesLxsSelectedWords: LxsWords
  ) => void;
  setPdf2triplesLxsChangeMode: (
    pdf2triplesLxsChangeMode: 'subject' | 'object' | null
  ) => void;
  setPdf2triplesLxsHideConnections: (
    pdf2triplesLxsHideConnections: boolean
  ) => void;
  setPdf2triplesLxsTextOutlineColor: (
    pdf2triplesLxsTextOutlineColor: string | undefined
  ) => void;
  setTopics: (topics: string[]) => void;
  setPrompts: (prompts: { label: string, description: string; prompt: string }[]) => void;
  setCategory: (category: string) => void;
  resetPrompts: () => void;
  setPdf2triplesGenerateBasedOntology: (pdf2triplesGenerateBasedOntology: boolean) => void;
  setPdf2triplesLxsSelectedText: (pdf2triplesLxsSelectedText: string) => void;
  enableDemoMode: () => void;
};

export type CustomAlert = {
  type: "success" | "error" | "info" | "warning";
  message: string;
  open: boolean;
  duration?: number;
};
