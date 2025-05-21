import prisma from "../util/db.js"

function calculateProgress(node, stats = {
        completed: 0,
        total: 0
    }) {

    stats.total++
    if(node.isCompleted) {
        stats.completed++
    }

    if(node.children) {
        for(const child of node.children) {
            calculateProgress(child, stats, false)
        }
    }

    return 100 * stats.completed / stats.total

}

export default async function getRoadmapList(req, res) {
    try {
        const roadmapsInDB = await prisma.roadmap.findMany({
            where: {
                owner: req.user.id
            }
        })

        if(!roadmapsInDB) {
            res.status(404).send('No roadmaps saved yet')
        }

        const roadmapList = roadmapsInDB.map((dbRoadmap) => {
            return {
                id: dbRoadmap.id,
                title: dbRoadmap.roadmapTitle,
                progress: calculateProgress(JSON.parse(dbRoadmap.roadmapObject))
            }
        })

        return res.status(200).send({
            success: true,
            roadmapList
        })

    } catch(err) {
        console.log(err)
        return res.status(500).send('Internal server error, please report this incident.')
    }
}