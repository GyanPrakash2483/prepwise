import { GoogleGenAI, Type } from '@google/genai'
import { configDotenv } from 'dotenv'

configDotenv()

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})


export async function generateRoadmap(topic) {
  const response = await ai.models.generateContentStream({
    model: 'gemini-2.0-flash',
    contents: `Generate a roadmap about ${topic}. The roadmap should be in json format with following schema.
      {
        title: "Title"
        children: [
          {
            title: "Title"
            children: [...]
          },
          {
            title: "Title"
            children: [...]
          }
          ...
        ]
      }

      Do not number the title, eg: Use "Title" instead of "1. Title" or "a) Title".
      The title should not contain the word Roadmap, ex: use "Photosynthesis" instead of "Photosynthesis Roadmap" as title.

      The output should contain only the json and nothing else.
    `
  })

  return response
}