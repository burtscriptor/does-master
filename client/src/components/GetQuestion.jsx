import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import '../styles/GetQuestions.css';
import wrong from '../assets/vomit.png'; 
import wellDone from '../assets/better-health.png';
import health from '../assets/healthcare.png';
import info from '../assets/information.png';

const Backend_URL = process.env.REACT_APP_BACKEND_URL;

const GetQuestion = () => {
  const [content, setContent] = useState({ questions: [], answers: [], working: [] });
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [showHintButton, setShowHintButton] = useState(false);
  const [showHint, setShowHint] = useState({ show: false, hint: "" });
  const [result, setResult] = useState(0);
  const [index, setIndex] = useState(0);
  const [counters, setCounters] = useState({ attempted: 0, skipped: 0, correct: [] });
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);


  const handleRequest = useCallback(async () => {
    try {
      const response = await axios.get(Backend_URL);
      
  
    setContent(prev => ({
      questions: [...prev.questions, ...response.data.questions],
      answers: [...prev.answers, ...response.data.answers],
      working: [...prev.working, ...response.data.working],
    
    }));
    setLoading(false);
    setError(false);
  } catch (error) {
  if(index >= content.questions.length) {
    setError(true);
  } ;
  };
  }, []);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  const currentIndex = useMemo(() => {
    if (content.questions.length > 0) {
      return content.questions.findIndex((q, idx) => q === content.questions[index]) + 1;
    }
    return 0;
  }, [content.questions, index]);

  useEffect(() => {
    if (result !== 0) {
      const timer = setTimeout(() => {
        setResult(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const normalizeString = str => str.toLowerCase().replace(/[^a-z0-9]/g, "").trim().replace("hr", 'hours');

  const handleAnswer = useCallback(() => {
    if (submittedAnswer.length > 0) {
      const normalizedSubmittedAnswer = normalizeString(submittedAnswer);
      const normalizedActualAnswer = normalizeString(content.answers[index]);
      

      const isCorrect = normalizedActualAnswer === normalizedSubmittedAnswer;

      setCounters(prev => ({ ...prev, attempted: prev.attempted + 1 }));
      if (isCorrect) {
        setResult(1);
        setCounters(prev => ({ ...prev, correct: [...prev.correct, index] }));
        setShowHint({ show: false, hint: "" });
        setShowHintButton(false);
        setSubmittedAnswer("");
        handleNext();
      } else {
        setSubmittedAnswer("");
        setResult(2);
        if (!showHint.show) {
          setShowHintButton(true);
        }
      }
    }
  }, [submittedAnswer, content.answers, index, showHint.show]);

  const handleNext = useCallback(() => {
    if (index === content.questions.length - 2) {
      handleRequest();
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }, [index, content.questions.length, handleRequest]);

  const handleSkip = useCallback(() => {

      handleNext();
      setCounters(prev => ({ ...prev, skipped: prev.skipped + 1 }));
      setShowHintButton(false);
      setShowHint({ show: false, hint: "" });
      setSubmittedAnswer("");
   
  }, [handleNext]);

  const handleHint = () => {
    if (content.working && content.working[index]) {
      const workingContent = content.working[index];
      const indexHint = workingContent.indexOf('=');
      
      if (indexHint !== -1 && indexHint > 0) {
        const newHint = workingContent.slice(0, indexHint).trim();
        setShowHint({ show: true, hint: newHint });
        setShowHintButton(false);
      } else {
        const defaultHint = content.working[index];
        setShowHint({ show: true, hint: defaultHint });
      }
    } else {
      setShowHint({ show: true, hint: "No hint available" });
    }
  };

const handleHelp = () => {
  setShowInfo(true);
};

  return (
    <>
    <div className="header">
    <h1>DoseMaster</h1>
    </div>

    <div className="parent">
      <div></div>
      <div className="dashboard-parent">
        
        <div className="dashboard-child">
        <img src={health} />
        <div className="child-text">
          <p>Question: {currentIndex}</p>
          <p>Attempted: {counters.attempted} </p>
          <p>Correct: {counters.correct.length}</p>
          <p>Skipped: {counters.skipped} </p>
          </div>
        </div>
        <img className="info-icon" src={info} onClick={handleHelp}/>
      </div>
      
      <div className="question">
        {content.questions.length > 0 ? !loading ? (
          <>
          
              <p>{content.questions[index]}</p>
           
              {showHintButton ? <button type="button" onClick={handleHint}>Hint</button> : ""}
              {showHint.show ? <p>{showHint.hint}</p> : ""}
            
              <input
                type="text"
                value={submittedAnswer}
                onChange={(event) => setSubmittedAnswer(event.target.value)}
              />
           
            <div className="question-input-2"> 
              <button type="button" className={ !submittedAnswer.length > 0 ? "disabled" : "" } onClick={handleAnswer}>Check answer</button>
              <button type="button" className={ loading ? "disabled" : "" } onClick={handleSkip}>Skip Question</button>
            </div> 
        
          </>
        ) : ( error ? (  <div className={ error ? "show-error-msg" : "hidden-error-msg"}>
          <h1>Error</h1>
          <p>Sorry! Unfortunately we are experiencing a server error.
            Please refresh the page. 
          </p>
        </div>) :
          <p>Loading</p>
        ):  
        <p>Error loading please refresh the page</p>}
         <div className={result === 0 ? "answer-result-hide" : result === 1 ? "answer-result-correct" : "answer-result-wrong"}>
          {result === 1 ? (<><p>Correct!</p><img src={wellDone} alt="Correct" /></>) : (<><p>Not quite right!</p><img src={wrong} alt="Wrong" /></>)}
        </div>

        <div className={showInfo ? "show-info" : "hide-info"}>
          <h1>DoseMaster: A tool for Student Nurses</h1>
          <p>DoseMaster is designed to help student nurses practice medication calculation mathematics. 
            Using OpenAI's technology, DoseMaster generates questions and answers to simulate real-world scenarios. While the medications and dosages aim to reflect real-world practices, inaccuracies may occur due to the nature of AI-generated content.
            The information provided should not be used for actual medical decision-making.
            Good luck with your nursing career, and stay safe!</p>
          <button type='button' onClick={()=> setShowInfo(false)} >Close</button>
        </div>

      
      </div>
    </div>
    </>
  );
};

export default GetQuestion;
