const express = require('express')
const https = require('https')
require('dotenv').config()
const request = require('request')

const app = express()
const port = process.env.PORT ?? 3000

const make_API_call = (url) => {
        return new Promise((resolve, reject) => {
            request(url, { json: true }, (err, res, body) => {
              if (err) reject(err)
              resolve(body)
            });
        })
    }


app.get('/', async (req, res) => {
  const apiResult = await make_API_call(`http://api.openweathermap.org/data/2.5/weather?q=San+Francisco&appid=${process.env.API_KEY}`)

  res.send(apiResult)
})

app.listen(port, ()=>{
  console.log('Ready')
})
