function calculateTimeDifference(startTime, endTime) {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  let totalStartMinutes = startHours * 60 + startMinutes;
  let totalEndMinutes = endHours * 60 + endMinutes;

  if (totalEndMinutes < totalStartMinutes) {
    // Train crosses midnight, add 24 hours to the end time
    totalEndMinutes += 24 * 60;
  }

  const totalMinutes = totalEndMinutes - totalStartMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

// Main function to calculate time between two cities
function calculateTime(city1, city2) {
  return 1;
}

module.exports = {
  calculateTimeDifference,
  calculateTime,
};
