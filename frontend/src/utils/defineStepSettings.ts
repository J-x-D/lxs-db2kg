import axios from "axios";

async function testConnection(dbConnectionString: string) {
  const url =
    "/api/test_connection?connection_string=" +
    encodeURIComponent(dbConnectionString);

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

interface DefineStepProps {
  dbConnectionString: string;
  schema: string;
  ontologyUrls: (string | undefined)[];
  createdEmbeddings: boolean;
  updatedPrefixes: boolean;
}

export default async function defineStepSettings({
  dbConnectionString,
  schema,
  ontologyUrls,
  createdEmbeddings,
  updatedPrefixes,
}: DefineStepProps) {
  if (dbConnectionString === "" || dbConnectionString === undefined) {
    return 0;
  }
  const result = await testConnection(dbConnectionString);

  if (!result) {
    return 0;
  }

  if (schema !== "" && schema !== undefined) {
    if (ontologyUrls.length > 0) {
      if (createdEmbeddings) {
        if (updatedPrefixes) {
          return 5;
        }
        return 4;
      }
      return 3;
    }
    return 2;
  }

  return 1;
}
