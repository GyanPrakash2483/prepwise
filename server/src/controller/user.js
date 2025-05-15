export default async function userController(req, res) {
    return res.status(200).send({
        name: req.user.name,
        email: req.user.email,
        credits: req.user.credits
    })
}