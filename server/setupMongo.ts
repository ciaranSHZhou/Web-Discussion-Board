import { MongoClient, ObjectId } from 'mongodb'
import { Post, User } from './data'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const posts: Post[] = [
  {
    _id: "p0",
    userId: "admin",
    title: "Griffith Did Nothing Wrong!",
    content: "Did he?"
  },
]

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")



  console.log("inserting posts", await db.collection("posts").insertMany(posts as any))
  process.exit(0)
}

main()
