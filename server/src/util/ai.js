import { GoogleGenAI } from '@google/genai'
import { configDotenv } from 'dotenv'

configDotenv()

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

export default ai