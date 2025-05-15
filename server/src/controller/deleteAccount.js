import prisma from "../util/db.js";

export default async function deleteAccountController(req, res) {
    const userDeleted = await prisma.user.delete({
        where: {
            id: req.user.id
        }
    })

    console.log(userDeleted)

    
}