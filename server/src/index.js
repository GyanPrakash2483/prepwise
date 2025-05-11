import express from 'express'
import { configDotenv } from 'dotenv'
import { loggerMiddleware } from './middleware.js'
import generateRoadmapController from './controller/generateRoadmap.js'
import cors from 'cors'
import signupController from './controller/signup.js'
import verifyAccountController from './controller/verifyAccountController.js'
import loginController from './controller/login.js'

configDotenv()

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())
app.use(loggerMiddleware)
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/generateroadmap', generateRoadmapController)

app.post('/api/auth/signup', signupController)

app.patch('/api/auth/verifyaccount', verifyAccountController)

app.post('/api/auth/login', loginController)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})