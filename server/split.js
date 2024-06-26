const splitString = (string) => {
  const splitArray = []
    const q1s = 0
    const q1e = string.indexOf('2.')
    const q2s = q1e;
    const q2e = string.indexOf('3.')
    const q3s = q2e;
    const q3e = string.indexOf('4.')
    const q4s = q3e;
    const q4e = string.indexOf('5.')
    const q5s = q4e;
    splitArray.push(string.slice(q1s, q1e),string.slice(q2s, q2e),string.slice(q3s, q3e),string.slice(q4s, q4e),string.slice(q5s));
    return splitArray
};

module.exports = {
    splitString
} 


// console.log(
//     splitString("1. A patient weighing 70 kg is prescribed metoprolol 25 mg PO twice daily. What is the total daily dose of metoprolol for this patient? 2. A patient weighing 60 kg is ordered to receive ibuprofen 400 mg PO every 6 hours as needed for pain. How many milligrams of ibuprofen will this patient receive in a 24-hour period if they take the medication as needed? 3. A patient weighing 80 kg is prescribed morphine 5 mg IV every 4 hours as needed for pain. If the morphine vial contains 10 mg/mL, how many milliliters of morphine should be administered for each dose? 4. A patient weighing 65 kg is prescribed ceftriaxone 1 g IV every 24 hours. If the ceftriaxone vial contains 500 mg/mL, how many milliliters of ceftriaxone should be administered for each dose? 5. A patient weighing 75 kg is prescribed furosemide 40 mg IV twice daily. If the furosemide vial contains 10 mg/mL, how many milliliters of furosemide should be administered for each dose?"   
//     )
// )