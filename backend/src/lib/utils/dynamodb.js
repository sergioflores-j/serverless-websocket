const getTTL = (minutes = 60) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + (minutes + 1));
  return Math.floor(date.getTime() / 1000);
};

module.exports = {
  getTTL,
};
