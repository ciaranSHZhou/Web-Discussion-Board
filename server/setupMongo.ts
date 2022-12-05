import { MongoClient, ObjectId } from 'mongodb'
import { Post, User } from './data'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const posts: Post[] = [
  {
    id: "p0",
    userId: "d",
    title: "Griffith Did Nothing Wrong!",
    content: "Did he?"
  },
]

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // set up unique index for upsert -- to make sure a customer cannot have more than one draft order
  db.collection("post").createIndex(
    { id: 1 }, 
    { unique: true, partialFilterExpression: { state: "draft" } }
  )

  console.log("inserting posts", await db.collection("posts").insertMany(posts as any))
  process.exit(0)
}

main()
