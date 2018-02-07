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
            'tavro.cognito.user_pool_id',
            'tavro.cognito.client_id'
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

            console.log(params);

            var CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
            var client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region: AWS_REGION });

            var cognitoParams = {
                UserPoolId: params['tavro.cognito.user_pool_id']
                //,ClientId: params['tavro.cognito.client_id']
            };

            client.listUsers(cognitoParams, function (error, data) {
                if (!error) {
                    console.log('successful' + JSON.stringify(data));
                } else {
                    console.log('error ' + error);
                }         // successful response
            });

        }
    });

};