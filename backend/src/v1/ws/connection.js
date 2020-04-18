const { get } = require('deep-object-js');
const ConnectionHandler = require('../../lib/ConnectionHandler');

const lambda = async event => {
  try {
    console.log('event', event);
    const { queryStringParameters, requestContext: { connectionId, routeKey } } = event;

    await new ConnectionHandler({ connectionId, type: get(queryStringParameters, 'type'), action: routeKey }).run();

    return { statusCode: 200 };
  } catch (err) {
    // !TODO
    return { statusCode: 500 };
  }
};

module.exports = {
  lambda,
};
