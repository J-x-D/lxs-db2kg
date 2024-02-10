import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

import { TableInfo } from "types/SchemaTableColumnMap";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TableInfo>
) {
  const connectionString = decodeURIComponent(
    req.body["connection_string"] as string
  );
  const schema = req.body["schema"] as string;
  const table = req.body["table"] as string;

  console.log(table)

  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();

    const response = await client.query(
      `select * from ${schema}.${table} limit 100`
    );

    const columns = response.fields.map((field: any) => field.name);
    const rows = response.rows;

    res.status(200).json({ columns, rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ columns: [], rows: [] });
  } finally {
    client.end();
  }
}
