const dynamodb = require('./connectors/DynamoDB');

module.exports = class ConnectionHandler {
  constructor({ connectionId, type, action } = {}) {
    this.connectionId = connectionId;
    this.type = type;
    this.action = action;
  }

  async run() {
    switch (this.action) {
      case '$connect':
        await this.connect();
        break;
      case '$disconnect':
        await this.disconnect();
        break;
      default:
        throw new Error('Invalid action');
    }
  }

  /**
   * Saves the client connection ID on dynamo
   * This allows the broadcast Lambda function to get a list of all connected WebSocket clients when broadcasting a message.
   */
  async connect() {
    console.log('registering connection', this.connectionId);
    
    return dynamodb.registerSocket({ connectionId: this.connectionId, type: this.type });
  }

  async disconnect() {
    console.log('removing connection', this.connectionId);

    return dynamodb.removeSocket(this.connectionId);
  }
};
