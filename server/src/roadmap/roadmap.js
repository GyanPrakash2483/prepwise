import ai from '../util/ai.js'

export async function generateRoadmap(topic) {
  // console.log(topic)
  const response = await ai.models.generateContentStream({
    model: 'gemini-2.0-flash',
    contents: `Generate a roadmap about "${topic}". The roadmap should be in json format with following schema.
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