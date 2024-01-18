
const fs = require('fs');
const xlsx = require('xlsx');

// Load Excel file
const workbook = xlsx.readFile('Assignment_Timecard.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert Excel data to JSON
const jsonData = xlsx.utils.sheet_to_json(sheet);

// Helper function to calculate time difference in minutes
function calculateTimeDifference(start, end) {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const diffInMinutes = (endTime - startTime) / (1000 * 60);
  return diffInMinutes;
}

// Logic for conditions
const employees = {};

jsonData.forEach((entry, index) => {
  const employeeName = entry['Employee Name'];
  const position = entry['Position ID'];
  const timeIn = entry['Time'];
  const timeOut = entry['Time Out'];

  if (!employees[employeeName]) {
    employees[employeeName] = { position, shifts: [] };
  }

  const shifts = employees[employeeName].shifts;

  // Check for conditions
  if (shifts.length > 0) {
    const lastShift = shifts[shifts.length - 1];
    const timeDifference = calculateTimeDifference(lastShift.timeOut, timeIn);

    if (timeDifference >= 60 * 1 && timeDifference <= 60 * 10) {
      // Condition b: Less than 10 hours between shifts but greater than 1 hour
      console.log(`${employeeName} (${position}) meets condition b`);
    }
  }

  // Add the current shift to the shifts array
  shifts.push({ timeIn, timeOut });

  // Check for condition c: Worked for more than 14 hours in a single shift
  const shiftDuration = calculateTimeDifference(timeIn, timeOut);
  if (shiftDuration > 14 * 60) {
    console.log(`${employeeName} (${position}) meets condition c`);
  }
});

// Check for condition a: Worked for 7 consecutive days
Object.entries(employees).forEach(([employeeName, data]) => {
  const shifts = data.shifts;
  if (shifts.length >= 7) {
    console.log(`${employeeName} (${data.position}) meets condition a`);
  }
});
