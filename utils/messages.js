const moment = require("moment");

function formatMessage(username, text, id, gest) {
  console.log('gestor: '+gest);
  return {
    username,
    text,
    time: moment().format("h:mm a"),
    id,
    gest,
  };
}

module.exports = formatMessage;
