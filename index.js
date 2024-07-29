require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(Math.floor((Math.random() * (1000 - (maxId)) + maxId +1)))
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('personData', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})


app.use(morgan(':method :url :response-time :personData'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person)
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
 /*  const duplicate = Person.find({name: req.body.name}) */
 /*   if(duplicate) {
    return res.status(400).json({
      error: 'Name already exists'
    })
  } */
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: 'Name and number are required'
    })
  }

  const person =  new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
    res.json(savedPerson)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person)
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))

  //Without DB
/*   const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end() */
})

app.get('/api/info', (req, res, next) => {
  const date = new Date
  Person.find({})
    .then(persons => {
      res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
    })
    .catch(err => next(err))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Custom middleware for error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)