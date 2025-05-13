import ai from "../util/ai.js"


export default async function aiDescriptionController(req, res) {
    const { topic, context } = req.query

    if(!topic || !context) {
        return res.status(400).send('Topic or Context missing.')
    }

    try {

        const description = await ai.models.generateContentStream({
            model: 'gemini-2.0-flash',
            contents: `
                Describe "${topic}" in context of "${context}". Keep "${topic}" the title of your response.
                Do not explicitly mention that you are responding in context of something, just give the response without mentioning that.
                Also include links to resources to learn further in the end.
            `
        })

        res.writeHead(200, {
            'Content-Type': 'text/plain',
        })

        for await (const chunk of description) {
            res.write(chunk.text)
        }

        res.end()

    } catch(err) {
        console.log(err)

    }

}