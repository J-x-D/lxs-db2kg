import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

type Data = {
  schemaTableColumnMap: Object[];
};

const blacklist = [
  "public",
  "information_schema",
  "pg_catalog",
  "pg_toast",
  "pg_toast_temp_1",
  "pg_temp_1",
];

const queryForAllTablesOfSchema =
  "select * from information_schema.tables where table_schema = $1;";

const queryForAllColumnsOfTable =
  "select * from information_schema.columns where table_schema = $1 and table_name = $2;";

const queryForRelations = `
  SELECT
    tc.table_schema,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
  FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
  WHERE constraint_type = 'FOREIGN KEY' AND tc.table_schema = $1;
`;

const querySchema = `select * from information_schema.schemata`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const connectionString = decodeURIComponent(
    req.query.connection_string as string
  );

  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();

    const response = await client.query(querySchema);

    const schemas = response.rows
      .filter((row: any) => !blacklist.includes(row.schema_name))
      .map((row: any) => row.schema_name);

    const schemaTableMap = await Promise.all(
      schemas.map(async (schema: any) => {
        const tableResult = await client.query(queryForAllTablesOfSchema, [
          schema,
        ]);

        const columnResult = await Promise.all(
          tableResult.rows.map(async (row: any) => {
            const columnResult = await client.query(queryForAllColumnsOfTable, [
              schema,
              row.table_name,
            ]);

            return columnResult.rows.map((row: any) => row.column_name);
          })
        );

        const relations = await client.query(queryForRelations, [schema]);

        const relationsMap = relations.rows.reduce((acc: any, row: any) => {
          const {
            table_name,
            column_name,
            foreign_table_name,
            foreign_column_name,
          } = row;
          if (!acc[table_name]) {
            acc[table_name] = [];
          }
          acc[table_name].push({
            column_name,
            foreign_table_name,
            foreign_column_name,
          });
          return acc;
        }, {});

        const tables = tableResult.rows.map((row: any, index: number) => {
          if (relationsMap[row.table_name]) {
            return {
              tableName: row.table_name,
              columnNames: columnResult[index],
              relations: relationsMap[row.table_name],
            };
          }

          return {
            tableName: row.table_name,
            columnNames: columnResult[index],
          };
        });

        return {
          schema,
          tables,
        };
      })
    );

    res.status(200).json({ schemaTableColumnMap: schemaTableMap });
  } catch (error) {
    res.status(500).json({ schemaTableColumnMap: [] });
  } finally {
    client.end();
  }
}
