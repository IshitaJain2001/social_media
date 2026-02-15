 //express 
 //dotenv configure
 // cors - middlewaare 
 // express instance 
 
 
  import e from "express"
  import cors from "cors"
  import dotenv from "dotenv"
  import connectToDb from "./config/db.config.js"
  import userRouter from "./routers/userRouter.js"
import cookieParser from "cookie-parser"
import { verifyTransport } from "./services/otpservice.js"

  dotenv.config()

  const app = e()

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))
  app.use(cookieParser())
  app.use(e.json())
  app.use("/users", userRouter)

  verifyTransport()
  connectToDb()


  app.listen(process.env.PORT, () => {
      console.log(`✓ Server running on port ${process.env.PORT}`)
  })
