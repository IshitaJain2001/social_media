 import e from "express"
  import cors from "cors"
  import dotenv from "dotenv"
  import connectToDb from "./config/db.config.js"
  import userRouter from "./routers/userRouter.js"
  import postRouter from "./routers/postRouter.js"
  import messageRouter from "./routers/messageRouter.js"
  import notificationRouter from "./routers/notificationRouter.js"
  import cookieParser from "cookie-parser"
  import { verifyTransport } from "./services/otpservice.js"

  dotenv.config()

  const app = e()

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))
  app.use(cookieParser())
  app.use(e.json({ limit: '50mb' }))
  app.use(e.urlencoded({ limit: '50mb', extended: true }))
  app.use("/users", userRouter)
  app.use("/posts", postRouter)
  app.use("/messages", messageRouter)
  app.use("/notifications", notificationRouter)

  verifyTransport()
  connectToDb()


  app.listen(process.env.PORT, () => {
      console.log(`✓ Server running on port ${process.env.PORT}`)
  })
