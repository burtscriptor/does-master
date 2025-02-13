const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const { removeChars } = require("./removeChars");

const app = express();
app.use(cors());

const apiKey = process.env.OPENAI_API_KEY;


app.get("/api", (request, response) => {
  response.json({ 'hello': 'hey whats up?' });
});


app.get("/api/openai", async (request, response) => {

  const prompt = `A nursing student is practicing medication calculations, 
    generate 5 questions with answers for them to practice. 
    The questions may include common IV infusions and medications including antibiotics, as well as common oral medications, may also use a weight (kg not lbs) based formula. 
    Please return the questions, answers (only the dosage and units of measurement), and formula to work out the answer for example (500 mg * 5 mL) / 250 mg = 10 mL, in the following format:
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
      ],
      "working": [
        "Text...",
        "Text...",
        "Text...",
        "Text...",
        "Text..."
      ],
    }`;

  const dataPayload = {
    "model": "gpt-3.5-turbo",
    "messages": [{ "role": "user", "content": prompt }],
    "temperature": 0.7,
    "n": 1
  };

  try {
    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', dataPayload, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }
    });

    const { choices } = openaiResponse.data;

    if (!choices || choices.length === 0 || !choices[0].message) {
      return response.status(500).json({ error: "Invalid response from OpenAI" });
    }

    try {
      const cleanedData = JSON.parse(removeChars(choices[0].message.content));
      response.json(cleanedData);
    } catch (parseError) {
      console.error('Error parsing JSON', parseError);
      response.status(500).json({ error: 'Failed to parse JSON from openAi' })
    }

  } catch (error) {
    console.error('Error fetching data from OpenAI:', error);
    response.status(500).json({ error: 'Failed to fetch data from OpenAI' });
  };
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});


module.exports = app;