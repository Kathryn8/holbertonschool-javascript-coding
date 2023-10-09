const { readFile } = require('fs').promises;

async function countStudents(filePath) {
  try {
    const data = await readFile(filePath, 'utf8');
    // Split the file into lines and filter out empty lines
    const lines = data.split('\n').filter((line) => line.trim() !== '');
    // Initialize an object to store the count of students in each field
    const studentCounts = {};

    // Initialize variables to store the total number of students and a
    // list of students in each field
    let totalStudents = 0;

    // Process each line (skipping the header)
    for (let i = 1; i < lines.length; i += 1) {
      const fields = lines[i].split(',');
      const field = fields[3].trim();

      if (!studentCounts[field]) {
        studentCounts[field] = [];
      }

      studentCounts[field].push(fields[0]);
      totalStudents += 1;
    }

    // Log the total number of students
    console.log(`Number of students: ${totalStudents}`);

    // Log the number of students in each field and the list of first names
    Object.keys(studentCounts).forEach((field) => {
      const students = studentCounts[field];
      console.log(`Number of students in ${field}: ${students.length}. List: ${students.join(', ')}`);
    });
  } catch (err) {
    throw new Error('Cannot load the database');
  }
}

module.exports = countStudents;
