import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import '../styles/GetQuestions.css';
import wrong from '../assets/vomit.png'; 
import wellDone from '../assets/better-health.png';
import health from '../assets/healthcare.png';
import info from '../assets/info.png';

const GetQuestion = () => {
  const [content, setContent] = useState({ questions: [], answers: [], working: [] });
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [showHintButton, setShowHintButton] = useState(false);
  const [showHint, setShowHint] = useState({ show: false, hint: "" });
  const [result, setResult] = useState(0);
  const [index, setIndex] = useState(0);
  const [counters, setCounters] = useState({ attempted: 0, skipped: 0, correct: [] });

  const handleRequest = useCallback(async () => {
    const response = await axios.get("/api/openai");
    setContent(prev => ({
      questions: [...prev.questions, ...response.data.questions],
      answers: [...prev.answers, ...response.data.answers],
      working: [...prev.working, ...response.data.working],
    }));
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

  const normalizeString = str => str.toLowerCase().replace(/[^a-z0-9]/g, "").trim();

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
        setShowHint({ show: true, hint: "No hint available" });
      }
    } else {
      setShowHint({ show: true, hint: "No hint available" });
    }
  };

const handleHelp = () => {
  console.log(content.answers[index])
  // set somthing to true so we know to show a div
  // want to say
  // Developed to help student nurses practice the mathematics of medication
  // calculation. DoseMaster uses openAi to generate questions and their answers.
  // The medications and doseags are meant to reflect practices in the real world,
  // however as when using any AI technology inaccurries may occur. The information 
  // presented should in no way be used in actual, medical decision making. 
}

  return (
    <>
    <div className="header">
    <h1>DoseMaster</h1>
    </div>
    <div className="parent">

      <div className="icon-parent" >
     
      </div>
      
      <div className="dashboard-parent">
        
        <div className="dashboard-child">
        <img src={health} />
        <div className="child-text">
          <p>Question: {currentIndex} </p>
          <p>Attempted: {counters.attempted} </p>
          <p>Correct: {counters.correct.length}</p>
          <p>Skipped: {counters.skipped} </p>
          </div>
        </div>
      </div>
      <div className="question">
        {content.questions.length > 0 ? (
          <>
            {/* <div className="question-text"> */}
              <p>{content.questions[index]}</p>
            {/* </div> */}
            {/* <div className="question-hint"> */}
              {showHintButton ? <button type="button" onClick={handleHint}>Hint</button> : ""}
              {showHint.show ? <p>{showHint.hint}</p> : ""}
            {/* </div> */}
            {/* <div className="question-input"> */}
              <input
                type="text"
                value={submittedAnswer}
                onChange={(event) => setSubmittedAnswer(event.target.value)}
              />
            {/* </div> */}
            <div className="question-input-2"> 
              <button type="button" onClick={handleAnswer}>Check answer</button>
              <button type="button" onClick={handleSkip}>Skip Question</button>
            </div> 
          </>
        ) : (
          <p>Loading</p>
        )}
         <div className={result === 0 ? "answer-result-hide" : result === 1 ? "answer-result-correct" : "answer-result-wrong"}>
          {result === 1 ? (<><img src={wellDone} alt="Correct" /><h1>Correct</h1></>) : (<><img src={wrong} alt="Wrong" /><p>Not quite right!</p></>)}
        </div>
      </div>
     
    </div>
    </>
  );
};

export default GetQuestion;
