import axios from "axios";

export default async function testConnectionDb(connectionString: string): Promise<boolean> {
  const url = "/api/test_connection?connection_string=" + encodeURIComponent(connectionString);
  try {
    await axios.get(url);
    return true;
  } catch (error: any) {
    console.error(error);
    return false;
  } finally {
    return false;
  }
}
