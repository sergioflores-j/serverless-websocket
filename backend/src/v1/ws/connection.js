// reference: https://github.com/neverendingqs/serverless-websocket-example/blob/master/src/websocket.js
const ConnectionHandler = require('../../lib/ConnectionHandler');

const lambda = async event => {
  try {
    console.log('event', event);
    const { requestContext: { connectionId, routeKey } } = event;

    await new ConnectionHandler({ connectionId, action: routeKey }).run();

    return { statusCode: 200 };
  } catch (err) {
    // !TODO
    return { statusCode: 500 };
  }
};

module.exports = {
  lambda,
};
