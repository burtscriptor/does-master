const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { removeChars } = require('./removeChars')

const app = express();

const apiKey = process.env.REACT_APP_API_KEY
// app.use(express.static(path.join(__dirname + "/public")))

app.get("/api", (request, response) => {
    response.json({ 'hello': 'hey whats up?'})
});

app.get("/api/openai", async (request, response) => {
    const prompt = `A nursing student is practicing medication calculations, 
    generate 5 questions with answers for them to practice. 
    The questions may include common IV infusions and medications including antibiotics,as well as common oral medications, may also use a weight (kg not lbs) based formular. 
    Please return the questions and answers in the following format, there is no need to show the working out in the answer:
    {
      "questions": [
        "Text...",
        "Text...",
        "Text...",
        "Text...",
        "Text..."
      ],
      "answers": [
        "Text...",
        "Text...",
        "Text...",
        "Text...",
        "Text..."
      ]
    }`
    const dataPayload = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": `${prompt}`}],
    "temperature": 0.7,
    "n": 1
  };

    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', dataPayload, 
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`}} )
    
    const { choices } = openaiResponse.data;
    
    // console.log('this is choices', typeof(choices[0].message.content), choices[0].message.content)
  
    // const data = JSON.parse( choices[0].message.content)
    
    const cleanedData = JSON.parse(removeChars(choices[0].message.content))


    console.log('this CD', cleanedData);

    response.json(cleanedData);
   
});

const PORT = process.env.PORT || 5000
console.log(`Listening on ${PORT}`);
app.listen(PORT);