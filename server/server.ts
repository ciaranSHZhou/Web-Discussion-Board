import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { Post, User } from './data'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Issuer, Strategy } from 'openid-client'
import passport from 'passport'
import { keycloak } from "./secrets"

if (process.env.PROXY_KEYCLOAK_TO_LOCALHOST) {
  // NOTE: this is a hack to allow Keycloak to run from the 
  // same development machine as the rest of the app. We have exposed
  // Keycloak to run off port 8081 of localhost, where localhost is the
  // localhost of the underlying laptop, but localhost inside of the
  // server's Docker container is just the container, not the laptop.
  // The following line creates a reverse proxy to the Keycloak Docker
  // container so that localhost:8081 can also be used to access Keycloak.
  require("http-proxy").createProxyServer({ target: "http://keycloak:8080" }).listen(8081)
}

// set up Mongo
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(mongoUrl)
let db: Db
let posts: Collection
let users: Collection


// set up Express
const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// set up session
app.use(session({
  secret: 'a just so-so secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },

  // comment out the following to default to a memory-based store, which,
  // of course, will not persist across load balanced servers
  // or survive a restart of the server
  store: MongoStore.create({
    mongoUrl,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done: any) => {
  logger.info("serializeUser " + JSON.stringify(user))
  done(null, user)
})
passport.deserializeUser((user: any, done: any) => {
  logger.info("deserializeUser " + JSON.stringify(user))
  done(null, user)
})

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401)
    return
  }

  next()
}

// app routes
app.post(
  "/api/logout", 
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      res.redirect("/")
    })
  }
)

app.get("/api/posts", async (req, res) => {
  res.status(200).json(await posts.find({ postId: { $ne: "" }}).toArray())
})

app.get("/api/user", (req, res) => {
  res.json(req.user || {})
})

app.get('/api/post/:postId', async (req, res) =>{
  res.json(200).json(await posts.find({ postId:  req.params.postId}))
})




app.get("/api/user", checkAuthenticated, async (req, res) => {
  const _id = req.user.preferred_username
  logger.info("/api/user " + _id)
  const user = await users.findOne({ _id })
  if (user == null) {
    res.status(404).json({ _id })
    return
  }
  // customer.orders = await users.find({ customerId: _id, state: { $ne: "draft" } }).toArray()
  res.status(200).json(user)
})


// app.get("/api/customer/draft-order", checkAuthenticated, async (req, res) => {
//   const customerId = req.user.preferred_username

//   // TODO: validate customerId

//   const draftOrder = await orders.findOne({ state: "draft", customerId })
//   res.status(200).json(draftOrder || { customerId, ingredients: [] })
// })

// app.put("/api/customer/draft-order", checkAuthenticated, async (req, res) => {
//   const order: DraftOrder = req.body

//   // TODO: validate customerId

//   const result = await orders.updateOne(
//     {
//       customerId: req.user.preferred_username,
//       state: "draft",
//     },
//     {
//       $set: {
//         ingredients: order.ingredients
//       }
//     },
//     {
//       upsert: true
//     }
//   )
//   res.status(200).json({ status: "ok" })
// })

// app.post("/api/customer/submit-draft-order", checkAuthenticated, async (req, res) => {
//   const result = await orders.updateOne(
//     {
//       customerId: req.user.preferred_username,
//       state: "draft",
//     },
//     {
//       $set: {
//         state: "queued",
//       }
//     }
//   )
//   if (result.modifiedCount === 0) {
//     res.status(400).json({ error: "no draft order" })
//     return
//   }
//   res.status(200).json({ status: "ok" })
// })

// app.put("/api/order/:orderId", checkAuthenticated, async (req, res) => {
//   const order: Order = req.body

//   // TODO: validate order object

//   const condition: any = {
//     _id: new ObjectId(req.params.orderId),
//     state: { 
//       $in: [
//         // because PUT is idempotent, ok to call PUT twice in a row with the existing state
//         order.state
//       ]
//     },
//   }
//   switch (order.state) {
//     case "blending":
//       condition.state.$in.push("queued")
//       // can only go to blending state if no operator assigned (or is the current user, due to idempotency)
//       condition.$or = [{ operatorId: { $exists: false }}, { operatorId: order.operatorId }]
//       break
//     case "done":
//       condition.state.$in.push("blending")
//       condition.operatorId = order.operatorId
//       break
//     default:
//       // invalid state
//       res.status(400).json({ error: "invalid state" })
//       return
//   }
  
//   const result = await orders.updateOne(
//     condition,
//     {
//       $set: {
//         state: order.state,
//         operatorId: order.operatorId,
//       }
//     }
//   )

//   if (result.matchedCount === 0) {
//     res.status(400).json({ error: "orderId does not exist or state change not allowed" })
//     return
//   }
//   res.status(200).json({ status: "ok" })
// })

// connect to Mongo
client.connect().then(() => {
  logger.info('connected successfully to MongoDB')
  db = client.db("test")
  posts = db.collection('posts')
  users = db.collection('users')


  Issuer.discover("http://127.0.0.1:8081/auth/realms/discussion/.well-known/openid-configuration").then(issuer => {
    const client = new issuer.Client(keycloak)
  
    passport.use("oidc", new Strategy(
      { 
        client,
        params: {
          // this forces a fresh login screen every time
          prompt: "login"
        }
      },
      async (tokenSet: any, userInfo: any, done: any) => {
        logger.info("oidc " + JSON.stringify(userInfo))

        const _id = userInfo.preferred_username
        // const operator = await operators.findOne({ _id })
        // if (operator != null) {
        //   userInfo.roles = ["operator"]
        // } else {
          await posts.updateOne(
            { _id },
            {
              $set: {
                name: userInfo.name
              }
            },
            { upsert: true }
          )
          userInfo.roles = ["user"]
        // }

        return done(null, userInfo)
      }
    ))

    app.get(
      "/api/login", 
      passport.authenticate("oidc", { failureRedirect: "/api/login" }), 
      (req, res) => res.redirect("/")
    )
    
    app.get(
      "/api/login-callback",
      passport.authenticate("oidc", {
        successRedirect: "/",
        failureRedirect: "/api/login",
      })
    )    

    // start server
    app.listen(port, () => {
      logger.info(`Discussion Board server listening on port ${port}`)
    })
  })
})
