import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_input } = req.body;

  if (req.method !== "POST") {
    return res.status(400).json({ error: "Only POST requests allowed" });
  }

  if (!user_input) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const prompt =
    "Help me understand following by describing as a detailed knowledge graph (only use nodes present in the text): \n\n" +
    user_input;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [{ role: "user", content: prompt }],
  });
  console.log(completion.data.choices[0].message?.content);

  return res.status(200).json({
    data: {
      message: completion.data.choices[0].message?.content,
    },
  });
}
