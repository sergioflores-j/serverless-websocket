const db = require('aws-dynamodb-factory-js').doc();

const utils = require('../utils');

const {
  DYNAMODB_CONNECTIONS_TABLE,
  DYNAMODB_CONNECTIONS_TABLE_TYPE_GSI,
} = require('../../../ms.env');

class DynamoDB {
  constructor() {
    this._connector = db;
  }

  get connector() {
    return this._connector;
  }

  async findSocketsBySubscription(subscription) {
    const queryParams = {
      TableName: DYNAMODB_CONNECTIONS_TABLE,
      IndexName: DYNAMODB_CONNECTIONS_TABLE_TYPE_GSI,
      KeyConditionExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': subscription,
      },
    };

    return this._connector.query(queryParams).promise();
  }

  async registerSocket({ connectionId, type }) {
    const options = {
      TableName: DYNAMODB_CONNECTIONS_TABLE,
      Item: {
        connectionId,
        type,
        // Expire the connection an hour later. This is optional, but recommended.
        // You will have to decide how often to time out and/or refresh the ttl.
        expires: utils.dynamodb.getTTL(),
      },
    };

    console.log('options', options);

    try {
      await this._connector.put(options).promise();
    } catch (err) {
      // !TODO Handle error
      console.error('Error - registerSocket:', err);
      throw err;
    }
  }

  async removeSocket(connectionId) {
    const options = {
      TableName: DYNAMODB_CONNECTIONS_TABLE,
      Key: {
        connectionId,
      },
    };

    try {
      await this._connector.delete(options).promise();
    } catch (err) {
      // !TODO Handle error
      console.error('Error - removeSocket:', err);
      throw err;
    }
  }
}

module.exports = new DynamoDB();
