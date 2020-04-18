const lambda = async event => {
  try {
    // !TODO
    // const { body, requestContext: { connectionId, routeKey } } = event;

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
