const mongoose = require('mongoose')

// Check for password
/* if (process.argv.length<3) {
  console.log('Usage: node mongo.js <password>');
  process.exit(1)
} */

// Connect to DB
const password = process.argv[2]
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Create person Schema and model
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 4
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: (props) => {
        return `Invalid phone number '${props.value}'`;
      }
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
