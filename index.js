const express = require('express')
const https = require('https')
var bodyParser = require('body-parser');
require('dotenv').config()
const request = require('request')
var exphbs  = require('express-handlebars')

var app = express()

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT ?? 3000

const make_API_call = (url) => {
        return new Promise((resolve, reject) => {
            request(url, { json: true }, (err, res, body) => {
              if (err) reject(err)
              resolve(body)
            });
        })
    }

const convertToF = (kelvin) => {
  return (kelvin - 273.15) * 9/5 + 32
}

const moods = []

app.get('/', async (req, res) => {
  const apiResult = await make_API_call(`http://api.openweathermap.org/data/2.5/weather?q=San+Francisco&appid=${process.env.API_KEY}`)
  apiResult.main.temp = convertToF(apiResult.main.temp).toFixed(2)
  apiResult.main.temp_min = convertToF(apiResult.main.temp_min).toFixed(2)
  apiResult.main.temp_max = convertToF(apiResult.main.temp_max).toFixed(2)
  const context = {
    apiResult,
    moods
  }
  res.render('home', context)
})

app.post('/', (req, res) => {
  console.log(req.body)
  moods.push(req.body.mood)
  res.redirect('/')
})

app.listen(port, ()=>{
  console.log(port)
})
