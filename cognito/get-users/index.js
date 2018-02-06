'use strict';

const AWS_REGION = 'us-west-2';
const AWS_API_VERSION = '2006-04-19';

const aws = require('aws-sdk');
const promise = require('bluebird');
const ssm = promise.promisifyAll(new aws.SSM({ region: AWS_REGION }));
const s3 = new aws.S3({ apiVersion: AWS_API_VERSION });

exports.handler = (event, context, callback) => {

    var CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    var client = new CognitoIdentityServiceProvider({ apiVersion: AWS_API_VERSION, region: AWS_REGION });

    client.listUsers(function(error, data) {
    
        if (!error) {
            console.log('successful' + JSON.stringify(data));
        } else {
            console.log('error ' + error);
        }

    });

};