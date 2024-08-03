import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getRecipe = async (items) => {
  const itemNames = items.map((item) => item.name).join(", ");
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Give me some recipes from the following items that i have in my pantry: ${itemNames}. Do not use any markdown formatting, code blocks, or special characters. Provide a plain text response only.`,
      },
    ],
    model: "gpt-4o-mini",
  });

  return completion.choices[0]?.message?.content || "";
};
