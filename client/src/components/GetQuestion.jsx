import React, { useState, useEffect } from 'react';
import axios from 'axios'
import '../styles/GetQuestions.css'

const GetQuestion = () => {
  const [content, setContent] = useState({ questions: [], answers: [], correct: [] });
  // const [currentQAndA, setCurrentQAndA] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState("")
  const [result, setResult] = useState(0)
  const [index, setIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)


  // to do
  // adjust handlenext to fetch more question if has run out - (done),
  // cleared input - (done)
  // add a previous button, 
  // tighten up the correct/ so that when correct the next qustion is loaded automatically - (done)
  // store the index or correct questions in a content.correct: [] - (done)
  // add a hint button - find the lastindex of digits and return slice from that position - (done)
 
  const handleRequest = async () => {
    const response = await axios.get("/api/openai")
    setContent((prevC) => ({ questions: [...prevC.questions,...response.data.questions], 
      answers: [...prevC.answers,...response.data.answers],
    correct: [...prevC.correct] }) );
    
  };

useEffect(()=> {
  handleRequest();
}, []);



const lastIndexOf = (str, regex) => {
  const matches = [...str.matchAll(regex)];
  if (matches.length === 0) return -1;
  return matches[matches.length - 1].index;
}


let hintdisplay;
if (showHint) {
  const str = content.answers[`${index}`];
  const regex = /[0-9]/g;
  const lastIndex = lastIndexOf(str, regex);
  hintdisplay = content.answers[`${index}`].slice(lastIndex+1);
};


let currentIndex;
if (content.questions.length > 0 ) {
 currentIndex = content.questions.findIndex((q, idx) => q === content.questions[`${index}`] ) + 1;
};

const handleAnswer =() => {
  if(submittedAnswer.length > 0) {
  if(content.answers[`${index}`].toLowerCase().replaceAll(" ", "").includes(submittedAnswer.toLowerCase().replaceAll(" ", ""))) {
    console.log('true')
    setResult(1); // so it knows what msg to display
    setSubmittedAnswer(""); // clear the input
    setContent((prevC) => ({ questions: [...prevC.questions], answers: [...prevC.answers], correct: [...prevC.correct, index ] }))
    
    
    setInterval(() => {
      setResult(0)
          }, 3000)
      handleNext(); //automactiaclly bring up the next question
  }else{
    console.log('false')
    setResult(2)
    setInterval(() => {
      setResult(0)
          }, 2000)
  };
};
};

const handleNext = () => {
  if(index === content.questions.length -2){
   
    handleRequest();
  
  }else{
    setIndex((prevIndex) => prevIndex += 1)
  }

}

return (
  <div className="parent">
    <div className="dashboard-parent">
      <p>Total Number of questions: </p>
      <p>Correct: {content.correct.length}</p>
      
    </div>
    <div className="question">
      <div className="question-text">
        {content.questions.length > 0 ? ( <>
        <p>Question {currentIndex }  </p>
        <p>{content.questions[`${index}`]}</p>
        <input type="text"  value={submittedAnswer}
        onChange={(event) => setSubmittedAnswer(event.target.value)}>
        </input>
        <button type="button" 
        onClick={handleAnswer}>Submit
        </button>
        { !showAnswer ? "" : <p>{content.answers[`${index}`]}</p>}
        { !showHint ? "" : <p>{hintdisplay} </p>}
        <button type="button" onClick={() => setShowAnswer(!showAnswer)} >Show Answer</button>
        <button type="button" onClick={() => setShowHint(!showHint)} >Hint</button>
       </>
        )
      :
      ("")
}
      </div>
       <div style={{ "visibility": result === 0 ? "hidden" : "visible" }} className="answer-result">
        {result === 1 ? <p>Correct</p> : <p>Try Again</p>}
      </div> 
     <button type="button" onClick={handleNext}>Next Question</button>
      
    </div>
    
  </div>
);
};

export default GetQuestion;