/**
 * Check if the two given date object is belong to the same day.
 * @param d1 first date
 * @param d2 second date
 * @returns {boolean}
 */
const isSameDay = (d1, d2) => {
  const d1InHk = convertHKTimeZone(d1);
  const d2InHk = convertHKTimeZone(d2);

  return d1InHk.getFullYear() === d2InHk.getFullYear() &&
    d1InHk.getMonth() === d2InHk.getMonth() &&
    d1InHk.getDate() === d2InHk.getDate();
};

/**
 * Return a new date object with the corresponding time zone.
 * @param date
 * @returns {Date} new date
 */
const convertHKTimeZone = (date) => {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: 'Asia/Hong_Kong' })
  );
};

/**
 * Return 12-hour time string (e.g. 12:30 PM)
 * @param date
 */
const get12HourString = date => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const suffix = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return hours + ':' + minutes + suffix;
};

/**
 * Return a date string in the format of 'dd/MM'.
 * @param date
 */
const getShortDateString = date => {
  return `${date.getDate()}/${date.getMonth() + 1}`;
};


/**
 * Return a date string in the format of 'yyyy-MM-dd'.
 * @param date
 */
const getLongDateString = date => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

module.exports = {
  isSameDay,
  get12HourString,
  getShortDateString,
  getLongDateString
}

