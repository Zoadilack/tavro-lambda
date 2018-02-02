'use strict';

const aws = require('aws-sdk');
const promise = require('bluebird');
const mailgun = require('mailgun.js');

const ssm = promise.promisifyAll(new aws.SSM());
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
var params = [];

ssm.getParameters({
    Names: [ /* required */
        'tavro.mail.mailgun_api_key',
        'tavro.mail.mailgun_public_key'
        /* more items */
    ],
    WithDecryption: true
}, function (err, result) {
    if (err) {
        console.log(err, err.stack);
    } else {
        result.Parameters.forEach(function(param) {
            //@TODO: fix this
            //params[param.Name] = param.Value;
        });
    }
});

console.log(params);

//var mailer = mailgun.client({username: 'api', key: params['MAILGUN_API_KEY']});
var mailer = mailgun.client({
    username: 'api',
    key: params['tavro.mail.mailgun_api_key'],
    public_key: params['tavro.mail.mailgun_public_key']
});

exports.handler = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    var url = "http://" + bucket + ".s3.amazonaws.com/" + key;

    s3.getObject({
        Bucket: bucket,
        Key: key,
    }, (err, data) => {
        console.log(data);
        if (err) {
            console.log(err);
            const message = "Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.";
            console.log(message);
            callback(message);
        } else {
            mg.messages.create('dev@zoadilack.com', {
                from: "Zoadilack <dev@zoadilack.com>",
                to: ["dev@zoadilack.com"],
                subject: "New Tavro Build: " + key,
                text: "A new Tavro build is complete: " + url,
                html: "<h1>New Tavro Build</h1><p>A new Tavro build is complete: " + url + "</p>"
            })
            .then(msg => console.log(msg)) // logs response data
            .catch(err => console.log(err)); // logs any error 
        }
    });

};
