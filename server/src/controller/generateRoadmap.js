import { generateRoadmap } from '../roadmap/roadmap.js'

export default async function generateRoadmapController(req, res) {
    const { topic } = req.query;

    if (!topic) {
        res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const roadmap = await generateRoadmap(topic);
        res.writeHead(200, {
            'Content-Type': 'application/json',
        })

        for await (const chunk of roadmap) {
            res.write(chunk.text)
        }

        res.end()
    } catch (error) {
        console.error('Error generating roadmap:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}