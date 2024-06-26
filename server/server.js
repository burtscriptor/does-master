const express = require('express');
const axios = require('axios');
const path = require('path');
const { splitString } = require('./split');
require('dotenv').config();

const app = express();

const apiKey = process.env.REACT_APP_API_KEY
// app.use(express.static(path.join(__dirname + "/public")))

app.get("/api", (request, response) => {
    response.json({ 'hello': 'hey whats up?'})
});

app.get("/api/openai", async (request, response) => {
    const prompt = "PracticingMedicationCalculation,ProvideQuestionsUsingCommonMedications&DoesageExamplesIncludeBetaBlockersNsaidOpioidsIvMedicationsAntiBioticsIncludeWeightBasedCalculations "
    const dataPayload = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": `${prompt}`}],
    "temperature": 0.7,
    "n": 2
  };

    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', dataPayload, 
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`}} )
    
    // console.log(openaiResponse.data)
    const { choices } = openaiResponse.data;
    choices.forEach((c, index) => {
      console.log(  c.message.content )
    })
    // console.log(choices)
    response.json(openaiResponse.data)
   

    // =  splitString(openaiResponse.data.choices.message[0].toString())

});

const PORT = process.env.PORT || 5000
console.log(`Listening on ${PORT}`);
app.listen(PORT);