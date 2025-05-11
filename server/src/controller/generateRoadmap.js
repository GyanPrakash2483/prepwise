import { generateRoadmap } from '../roadmap/roadmap.js'
import prisma from '../util/db.js';

export default async function generateRoadmapController(req, res) {
    const { topic } = req.query;

    if (!topic) {
        res.status(400).json({ error: 'Topic is required' });
    }

    try {
        if(req.user.credits < 10) {
            return res.status(402).send("Not enough credits")
        }

        const deductCredits = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                credits: req.user.credits - 10
            }
        })

        if(!deductCredits) {
            throw new Error('Could not deduct credits')
        }

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