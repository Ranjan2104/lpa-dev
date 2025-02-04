const changeDateTimeToNight = (date) => {
  const newDate = new Date(date);
  // Adjust for the offset (-5 hours and 30 minutes)
  newDate.setUTCHours(0 - 5, 0 - 30, 0, 0); // Add offset to shift the time correctly
  return newDate;
};

const changeDateTimeToNightAfter = (date) => {
  const newDate = new Date(date);
  // Adjust for the offset (-5 hours and 30 minutes)
  newDate.setUTCHours(23 - 5, 59 - 30, 59, 999); // Add offset to shift the time correctly
  return newDate;
};

module.exports = { changeDateTimeToNight, changeDateTimeToNightAfter };
