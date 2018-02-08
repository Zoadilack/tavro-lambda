'use strict';

const AWS_REGION = 'us-west-2';
const AWS_API_VERSION = '2006-03-01';

const aws = require('aws-sdk');
const promise = require('bluebird');
const ssm = promise.promisifyAll(new aws.SSM({ region: AWS_REGION }));
const s3 = new aws.S3({ apiVersion: AWS_API_VERSION });

exports.handler = (event, context, callback) => {

    let options = {
        Names: [
            'tavro.dynamodb.user_pool_id',
            'tavro.dynamodb.client_id'
        ],
        WithDecryption: true
    };

    ssm.getParameters(options, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {

            let params = {};

            data.Parameters.forEach(function (param) {
                params[param.Name] = param.Value;
            });

            // Create DynamoDB service object
            var ddb = new aws.DynamoDB({ apiVersion: '2012-08-10' });

            var query = {
                ExpressionAttributeValues: {
                    ':s': { N: '2' },
                    ':e': { N: '09' },
                    ':topic': { S: 'PHRASE' }
                },
                KeyConditionExpression: 'Season = :s and Episode > :e',
                ProjectionExpression: 'Title, Subtitle',
                FilterExpression: 'contains (Subtitle, :topic)',
                TableName: 'node'
            };

            ddb.query(query, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } else {
                    data.Items.forEach(function (element, index, array) {
                        console.log(element.Title.S + " (" + element.Subtitle.S + ")");
                    });
                }
            });

        }
    });

};