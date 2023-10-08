const fs = require('fs');

module.exports = function countStudents(fileName) {
  let data;

  // Try-catch block to read file or throw error
  try {
    data = fs.readFileSync(fileName)
      .toString() // convert Buffer to string
      .split('\n') // split string to lines
      .map((e) => e.trim()) // remove white spaces for each line
      .map((e) => e.split(',').map((e) => e.trim())); // split each line to array
  } catch (err) {
    throw new Error('Cannot load the database');
  }

  // Remove header line:
  if (data[0][0] === 'firstname') {
    data.shift();
  }

  // Output number of students:
  console.log(`Number of students: ${data.length}`);

  // Get a list of FIELDS:
  const fieldList = [];
  for (const student of data) {
    fieldList.push(student[3]);
  }

  // Make the list of fields distinct:
  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
  const uniqueFieldList = fieldList.filter(onlyUnique);

  // create a MAP object with distrinct fields as keys
  const fieldMap = new Map();
  uniqueFieldList.forEach((elem) => {
    fieldMap.set(elem, []);
  });

  // iterate over studentList and assign each student to field:
  for (const student of data) {
    for (const field of fieldMap.keys()) {
      if (student[3] === field) {
        (fieldMap.get(field)).push(student[0]);
      }
    }
  }
  fieldMap.forEach((firstNameList, field) => {
    console.log(`Number of students in ${field}: ${firstNameList.length}. List: ${String(firstNameList).replace(/,/gi, ', ')}`);
  });
};
