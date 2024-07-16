const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const duplicate = persons.find(person => person.name.toLowerCase() === req.body.name.toLowerCase())

  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: 'Name and number are required'
    })
  }

  if(duplicate) {
    return res.status(400).json({
      error: 'Name already exists'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons.concat(person)

  res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.get('/api/info', (req, res) => {
  const date = new Date
  res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})