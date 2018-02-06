const printError = ({e, message}) => {
  if (e.response) {
    const {status, data} = e.response;
    console.error(message, status, data)
  } else {
    console.error(message);
    console.error(e);
  }
};

module.exports = {printError};