import prisma from '../util/db.js'
import crypto from 'node:crypto'

function annotateRoadmap(roadmapObject) {
    roadmapObject.isCompleted = false,
    roadmapObject.uuid = crypto.randomUUID()

    for (const child of roadmapObject.children) {
        annotateRoadmap(child)
    }
}

export default async function saveRoadmap(req, res) {
    try {
        const roadmapObject = req.body.roadmapObject

        annotateRoadmap(roadmapObject)

        const savedRoadmap = await prisma.roadmap.create({
            data: {
                roadmapTitle: roadmapObject.title,
                roadmapObject: JSON.stringify(roadmapObject),
                owner: req.user.id
            }
        })

        if(!savedRoadmap) {
            throw new Error('Failed to save roadmap to Database')
        }

        res.status(201).send({
            success: true,
            roadmapId: savedRoadmap.id
        })
    } catch(err) {
        console.log(err)
        return res.status(500).send('Internal server error, please report this incident.')
    }
    
}