const StatusCodes = require('http-status-codes');

exports.doActionFail = async (request, response, action) => {
  try {
    await action();
  } catch (e) {
    response.sendStatus(
      e.code === 11000
      || e.stack.includes('ValidationError')
      || (e.reason !== undefined && e.reason.code === 'ERR_ASSERTION')
        ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
