import prisma from '../util/db.js'

export default async function deleteRoadmap(req, res) {
    try {
        console.log(req.params.id)

        const deleteRoadmap = await prisma.roadmap.delete({
            where: {
                id: Number(req.params.id),
                owner: req.user.id
            }
        })

        if(!deleteRoadmap) {
            res.status(404).send('No such roadmap exists')
        }

        return res.status(200).send('Deleted')
    } catch(err) {
        console.log(err)
        return res.status(500).send('Internal server error')
    }
}