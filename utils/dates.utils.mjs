const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getFormattedDate = (today) => {
  const yyyy = today.getFullYear();
  const mm = months[today.getMonth()];
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;

  return `${mm} ${dd}, ${yyyy}`;
};

export const parseDates = (content) => {
  try {
    const dateRegExp =
      /(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}/g;

    return content.match(dateRegExp).join(', ');
  } catch (error) {
    return '';
  }
};
