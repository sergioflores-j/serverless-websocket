// reference: https://github.com/neverendingqs/serverless-websocket-example/blob/master/src/websocket.js
const ConnectionHandler = require('../../lib/ConnectionHandler');

const lambda = async event => {
  try {
    const { requestContext: { connectionId, routeKey } } = event;

    await new ConnectionHandler({ connectionId, action: routeKey }).run();
    console.log('connected');

    // Return a 200 status to tell API Gateway the message was processed
    // successfully.
    // Otherwise, API Gateway will return a 500 to the client.
    return { statusCode: 200 };
  } catch (err) {
    // TODO
    return { statusCode: 500 };
  }
};

module.exports = {
  lambda,
};
