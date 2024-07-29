const mongoose = require('mongoose')

// Check for password
if (process.argv.length<3) {
  console.log('Usage: node mongo.js <password>');
  process.exit(1)
}

// Connect to DB
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.vkaxiqw.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
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
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

// If name and number are provided as arguments addd new person otherwise display all the people
if (process.argv.length>3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  
  person.save().then(result => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })
}
