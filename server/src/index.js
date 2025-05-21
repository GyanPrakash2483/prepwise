import express from 'express'
import { configDotenv } from 'dotenv'
import { authMiddleware, limiterMiddleware, loggerMiddleware } from './middleware.js'
import generateRoadmapController from './controller/generateRoadmap.js'
import cors from 'cors'
import signupController from './controller/signup.js'
import verifyAccountController from './controller/verifyAccount.js'
import loginController from './controller/login.js'
import aiDescriptionController from './controller/aiDescription.js'
import userController from './controller/user.js'
import logoutController from './controller/logout.js'
import deleteAccountController from './controller/deleteAccount.js'
import './services.js'
import claimFreeCredits from './controller/claimFreeCredits.js'
import saveRoadmap from './controller/saveRoadmap.js'
import getRoadmap from './controller/getRoadmap.js'
import toggleCompletion from './controller/toggleCompletion.js'

configDotenv()

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())
app.use(loggerMiddleware)
app.use(limiterMiddleware)
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/roadmap',authMiddleware, generateRoadmapController)

app.post('/api/auth/signup', signupController)

app.patch('/api/auth/verifyaccount', verifyAccountController)

app.post('/api/auth/login', loginController)

app.get('/api/aidescription', authMiddleware, aiDescriptionController)

app.get('/api/user', authMiddleware, userController)

app.patch('/api/auth/logout', authMiddleware, logoutController)

app.delete('/api/auth/deleteaccount', authMiddleware, deleteAccountController)

app.patch('/api/credits/claimfree', authMiddleware, claimFreeCredits)

app.post('/api/roadmap', authMiddleware, saveRoadmap)

app.get('/api/roadmap/:id', authMiddleware, getRoadmap)

app.patch('/api/roadmap/:id/togglecompletion/:uuid', authMiddleware, toggleCompletion)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})