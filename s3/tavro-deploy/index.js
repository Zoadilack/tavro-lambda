'use strict';

const aws = require('aws-sdk');
const promise = require('bluebird');
const mailgun = require('mailgun.js');

const ssm = promise.promisifyAll(new aws.SSM());
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

// var mgParams = ssm.getParametersAsync({
//     Names: ["MAILGUN_API_KEY", "MAILGUN_PUBLIC_KEY"],
//     WithDecryption: true
// });

// console.log(mgParams);

var params = {};
// for (p of mgParams.Parameters) {
//     params[p.Name] = p.Value;
// }

// console.log(params);

//var mailer = mailgun.client({username: 'api', key: params['MAILGUN_API_KEY']});
var mailer = mailgun.client({
    username: 'api',
    key: params['MAILGUN_API_KEY'] || 'key-',
    public_key: params['MAILGUN_PUBLIC_KEY'] || 'pubkey-'
});

exports.handler = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };

    var url = "http://" + Bucket + ".s3.amazonaws.com/" + key;
    sendmail();
    
    // s3.getObject(params, (err, data) => {
    //     console.log(data);
    //     if (err) {
    //         console.log(err);
    //         const message = "Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.";
    //         console.log(message);
    //         callback(message);
    //     } else {
    //         
    //     }

    // });

    function sendmail(url, callback) {

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

};
