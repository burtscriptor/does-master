import React, { useState } from 'react';
import axios from 'axios'


const apiKey = process.env.REACT_APP_API_KEY


const GetQuestion = () => {
  const [backend, setBackend] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleRequest = async () => {
    const response = await axios.get("/api/openai")
    setBackend(response.data.choices)
    console.log(response.data.choices)
  };

  return (
    <div className='request'>
      <button type='button' onClick={handleRequest}>Send Request</button>
      <div className="Questions">
       
      </div>
     
      
    </div>
  );
};

export default GetQuestion;