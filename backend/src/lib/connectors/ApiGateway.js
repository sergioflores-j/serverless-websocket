const aws = require('aws-sdk');

const { WEBSOCKET_API_ENDPOINT } = require('../../../ms.env');
const dynamodbConnector = require('./DynamoDB');

class ApiGateway {
  constructor() {
    const CONNECTOR_OPTS = {
      endpoint: WEBSOCKET_API_ENDPOINT,
    };
    this._connector = new aws.ApiGatewayManagementApi(CONNECTOR_OPTS);
  }

  get connector() {
    return this._connector;
  }

  async generateSocketMessage(connectionId, data) {
    try {
      return await this._connector.postToConnection({
        ConnectionId: connectionId,
        Data: data,
      }).promise();
    } catch (error) {
      console.error('Unable to generate socket message', error);
      if (error.statusCode === 410) {
        console.log(`Removing stale connector ${connectionId}`);
        await dynamodbConnector.removeSocket(connectionId);
      }
    }
  }
}

module.exports = new ApiGateway();
