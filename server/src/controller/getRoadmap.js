import prisma from "../util/db.js"

export default async function getRoadmap(req, res) {
    try {
        const roadmapId = req.params.id

        const roadmapInDB = await prisma.roadmap.findFirst({
            where: {
                id: Number(roadmapId),
                owner: req.user.id
            }
        })

        if(!roadmapInDB) {
            res.status(404).send('Roadmap does not exist.')
        }

        res.send({
            success: true,
            roadmap: roadmapInDB
        })

    } catch(err) {
        console.log(err)
        return res.status(500).send('Internal server error, please report this incident.')
    }

}