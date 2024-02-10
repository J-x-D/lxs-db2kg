// get current ip with api.ipify.org

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = await axios
    .get("https://api.ipify.org?format=json")
    .then((response) => response.data.ip)
    .catch((error) => {
      console.error(error);
      return [];
    });
  return res.status(200).json({ ip });
}
