import React, { useState, useEffect } from 'react';
import axios from 'axios'
import '../styles/GetQuestions.css'

const GetQuestion = () => {
  const [content, setContent] = useState({ questions: [], answers: [] });
  const [currentQAndA, setCurrentQAndA] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState(null)
  const [result, setResult] = useState(0)
 
  
useEffect(()=> {
  const handleRequest = async () => {
    const response = await axios.get("/api/openai")
    setContent(response.data)
    console.log(response.data)
    if (!currentQAndA) {
      setCurrentQAndA( { question: response.data.questions[0], answer: response.data.answers[0] });
    }else {
      return;
    }
  };
  handleRequest();
}, [])

let currentIndex;
if (content.questions.length > 0 && currentQAndA) {
 currentIndex = content.questions.findIndex((q, index) => q === currentQAndA.question )
};

const handleAnswer =() => {
  if(currentQAndA.answer.toLowerCase().replaceAll(" ", "").includes(submittedAnswer.toLowerCase().replaceAll(" ", ""))) {
    console.log('true')
    setResult(1)
    setInterval(() => {
setResult(0)
    }, 2000)
  }else{
    console.log('false')
    setResult(2)
    setInterval(() => {
      setResult(0)
          }, 2000)
  };

};


return (
  <div className="parent">
    <div className="question">
      <div className="question-text">
        {currentQAndA && content.questions.length > 0 ? ( <>
        <p>Question {currentIndex =+ 1 }  </p>
        <p>{currentQAndA.question}</p>
        <input type="text"  
        onChange={(event) => setSubmittedAnswer(event.target.value)}>
        </input>
        <button type="button" 
        onClick={handleAnswer}>Submit
        </button>
        { !showAnswer ? "" : <p>{currentQAndA.answer}</p>}
        <button type="button" onClick={() => setShowAnswer(!showAnswer)} >Show Answer</button>
       </>
        )
      :
      ("")
}
      </div>
       <div style={{ "visibility": result === 0 ? "hidden" : "visible" }} className="answer-result">
        {result === 1 ? <p>Correct</p> : <p>Try Again</p>}
      </div> 
     
      
    </div>
    
  </div>
);
};

export default GetQuestion;