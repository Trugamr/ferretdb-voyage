import 'dotenv/config'
import mongoose from 'mongoose'

if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI must be set')
}

// Connect to database
const db = await mongoose.connect(process.env.DATABASE_URI)
console.log(`Connected to ${db.connection.name} database`)

// Schemas
const messageSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
})

const Message = mongoose.model('Message', messageSchema)

const message = new Message({
  content: `hello 👋 #${Date.now()}`,
})

await message.save()

// 😵
const [result] = await Message.aggregate<{ total?: number }>([
  {
    $count: 'total',
  },
])
console.log(`There are ${result?.total ?? 0} messages in the database`)

// Disconnect database
await db.disconnect()
