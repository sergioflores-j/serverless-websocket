const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

// you need to provide the URL to your WebSocket API on class creation
const apiGateway = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.LOCAL_WEBSOCKET_API_ENDPOINT,
});

const { DYNAMODB_CONNECTIONS_TABLE } = process.env;

module.exports.handler = async event => {
  try {
    const { body, requestContext: { connectionId, routeKey } } = event;

    console.log('connectionId', connectionId);

    switch (routeKey) {
      case '$connect':
        await connect({ connectionId });
        console.log('connected');
        break;

      case '$disconnect':
        await disconnect({ connectionId });
        console.log('disconnected');
        break;

      case 'routeA':
        console.log('routeA', body);
        await apiGateway.postToConnection({
          ConnectionId: connectionId,
          Data: `Received on routeA: ${body}`,
        }).promise();
        break;

      case '$default':
      default:
        console.log('default');
        await apiGateway.postToConnection({
          ConnectionId: connectionId,
          Data: `Received on $default: ${body}`,
        }).promise();
    }

    // Return a 200 status to tell API Gateway the message was processed
    // successfully.
    // Otherwise, API Gateway will return a 500 to the client.
    return { statusCode: 200 };
  } catch (err) {
    console.error('ERROR', err);
    // TODO
    return { statusCode: 500 };
  }
};

/**
 * Saves the client connection ID on dynamo
 * This allows the broadcast Lambda function to get a list of all connected WebSocket clients when broadcasting a message.
 */
async function connect({ connectionId }) {
  console.log('saving connection on dynamo: ', DYNAMODB_CONNECTIONS_TABLE);
  return dynamodb.put({
    TableName: DYNAMODB_CONNECTIONS_TABLE,
    Item: {
      connectionId,
      // Expire the connection an hour later. This is optional, but recommended.
      // You will have to decide how often to time out and/or refresh the ttl.
      ttl: parseInt((Date.now() / 1000) + 3600),
    },
  }).promise();
}

async function disconnect({ connectionId }) {
  return dynamodb.delete({
    TableName: DYNAMODB_CONNECTIONS_TABLE,
    Key: { connectionId },
  }).promise();
}
