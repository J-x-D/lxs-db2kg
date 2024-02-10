import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  const formattedUrl = decodeURIComponent(url as string)


  try {
    const response = await axios.get(formattedUrl as string);
    // console.log('%ccheckUrl.ts line:16 response.status', 'color: #007acc;', response.status, formattedUrl);
    res.status(response.status).end();
  } catch (error: any) {
    // console.log('%ccheckUrl.ts line:19 error', 'color: #007acc;', formattedUrl, error.code);

    // try again with https
    try {
      const httpsUrl = formattedUrl.replace('http://', 'https://');
      const response = await axios.get(httpsUrl);

      // console.log('%ccheckUrl.ts line:25 response.status', 'color: #007acc;', httpsUrl, response.status);

      res.status(response.status).end();
    } catch (e: any) {
      // console.log('%ccheckUrl.ts line:27 ERROR @ ', 'color: #007acc;', formattedUrl, e.code);
      res.status(500).end();
    }
  }
}
