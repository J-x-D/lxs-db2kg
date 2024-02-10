export interface Relation {
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
}

export interface Table {
  tableName: string | string[];
  columnNames: string[];
  relations?: Relation[];
}

export interface SchemaTableColumnMap {
  schemaTableColumnMap: {
    schema: string;
    tables: Table[];
  }[];
}

export interface TableInfo {
  columns: string[];
  rows: Object[];
}
