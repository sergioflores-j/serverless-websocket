const lambda = async event => {
  try {
    // !TODO
    // const { body, requestContext: { connectionId, routeKey } } = event;

    console.log('connected');

    return { statusCode: 200 };
  } catch (err) {
    // TODO
    return { statusCode: 500 };
  }
};

module.exports = {
  lambda,
};
