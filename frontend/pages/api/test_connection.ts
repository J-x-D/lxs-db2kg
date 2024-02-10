import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

type Data = {
  connected: boolean;
};

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
    const response = await client.query(
      "select * from information_schema.schemata"
    );
    res.status(200).json({ connected: true });
  } catch (error) {
    res.status(500).json({ connected: false });
  } finally {
    client.end();
  }
}
