const splitString = (string) => {
  const newString = string.replaceAll('\n', '').replaceAll('+', '').replaceAll("'", "");
  const questions = [];
  const answers = [];

  // Find the start and end indices of each question
  const q1s = newString.search(/1\.|:/);
  const q1e = newString.search(/2\.|:/);
  const q2s = q1e;
  const q2e = newString.search(/3\.|:/);
  const q3s = q2e;
  const q3e = newString.search(/4\.|:/);
  const q4s = q3e;
  const q4e = newString.search(/\.|:/);
  const q5s = q4e;

  // Slice the questions out of the string
  questions.push(newString.slice(q1s, q1e))
  questions.push(newString.slice(q2s, q2e))
  questions.push(newString.slice(q3s, q3e))
  questions.push(newString.slice(q4s, q4e))
  questions.push(newString.slice(q5s))

  // Extract answers from the questions
  questions.forEach((element) => {
    const start = element.indexOf('Answer:');
    if (start !== -1) {
      const answer = element.slice(start)
      answers.push(answer);
    } else {
      answers.push('');
    }
  });

  console.log('Questions:', questions);
  console.log('Answers:', answers);

  return { questions, answers };
};

module.exports = {
  splitString
};

// Example usage
// const exampleString = "1. A patient weighing 70 kg is prescribed metoprolol 25 mg PO twice daily. What is the total daily dose of metoprolol for this patient? Answer: 50 mg. 2. A patient weighing 60 kg is ordered to receive ibuprofen 400 mg PO every 6 hours as needed for pain. How many milligrams of ibuprofen will this patient receive in a 24-hour period if they take the medication as needed? Answer: 1600 mg. 3. A patient weighing 80 kg is prescribed morphine 5 mg IV every 4 hours as needed for pain. If the morphine vial contains 10 mg/mL, how many milliliters of morphine should be administered for each dose? Answer: 0.5 mL. 4. A patient weighing 65 kg is prescribed ceftriaxone 1 g IV every 24 hours. If the ceftriaxone vial contains 500 mg/mL, how many milliliters of ceftriaxone should be administered for each dose? Answer: 2 mL. 5. A patient weighing 75 kg is prescribed furosemide 40 mg IV twice daily. If the furosemide vial contains 10 mg/mL, how many milliliters of furosemide should be administered for each dose? Answer: 4 mL.";

// console.log(splitString(exampleString));
