import React, { useState } from 'react';
import Groq from "groq-sdk";
import fs from 'fs'
import json5 from 'json5'

const config = json5.parse(fs.readFileSync('config.json', 'utf8'));
const apiKey = config.groqApiKey;

const groq = new Groq();
// const apiKey = process.env.REACT_APP_GROQ_API_KEY;

const GetQuestion = () => {
  const [response, setResponse] = useState({});

  const handleRequest = async () => {
    console.log('clicked');
    const response = await groq.chat.completions.create({
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      messages: [
        {
          role: 'user',
          content: 'tell me something',
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    });

    setResponse(response);
  };

  return (
    <div className='request'>
      <button type='button' onClick={handleRequest}>Send Request</button>
      {response.choices.map((chunk, index) => (
        <div key={index}>
          <h2>Chunk {index + 1}</h2>
          <p>{chunk}</p>
        </div>
      ))}
    </div>
  );
};

export default GetQuestion;