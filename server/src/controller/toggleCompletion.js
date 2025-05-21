import prisma from "../util/db.js"

function findAndChangeCompletionState(node, uuid) {
    if(node.uuid === uuid) {
        node.isCompleted = !node.isCompleted
    } else if(node.children) {
        for(const child of node.children) {
            findAndChangeCompletionState(child, uuid)
        }
    }
}

export default async function toggleCompletion(req, res) {
    try {
        const id = Number(req.params.id)
        const uuid = req.params.uuid

        const roadmapInDB = await prisma.roadmap.findFirst({
            where: {
                id: id,
                owner: req.user.id
            }
        })

        if(!roadmapInDB) {
            return res.status(404).send('Roadmap does not exist.')
        }

        const roadmapObject = JSON.parse(roadmapInDB.roadmapObject)
        findAndChangeCompletionState(roadmapObject, uuid)

        const updateRoadmap = await prisma.roadmap.update({
            where: {
                id: id,
                owner: req.user.id
            },
            data: {
                roadmapObject: JSON.stringify(roadmapObject)
            }
        })

        if(!updateRoadmap) {
            throw new Error('DB Error')
        }

        return res.status(200).send('Updated')

    } catch(err) {
        console.log(err)
        return res.status(500).send('Internal server error, please report this incident.')
    }
}