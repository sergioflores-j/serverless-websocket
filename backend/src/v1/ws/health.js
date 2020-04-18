const apiGateway = require('../../lib/connectors/ApiGateway');

const lambda = async event => {
  const { requestContext: { connectionId } } = event;

  await apiGateway.generateSocketMessage({
    connectionId,
    data: 'PONG',
  });

  return { statusCode: 200 };
};

module.exports = {
  lambda,
};
