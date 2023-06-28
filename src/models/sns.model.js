var AWS = require('aws-sdk');
const { SNSClient } = require("aws-sdk");

AWS.config.update({
    region: 'us-east-1', credentials: {
        accessKeyId: 'AKIA3BRJRF4XNPIFXBWD',
        secretAccessKey: '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'
    }
});

const sendNotification = async (messageAttrs) => {
    try {
        // const client = new SNSClient({ region: "us-east-1" });
        var params = {
            Message: 'MESSAGE_TEXT', /* required */
            TopicArn: 'arn:aws:sns:us-east-1:759222578990:demo2',
            MessageAttributes: messageAttrs
            // MessageAttributes: {
            //     'email': { DataType: 'String', StringValue: 'atul.net@live.com' },
            //     'name': { DataType: 'String', StringValue: 'Arun Govil' },
            // }
        };

        var publishTextPromise = new AWS.SNS()
            .publish(params).promise();

        // Handle promise's fulfilled/rejected states
        publishTextPromise.then(
            function (data) {
                console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                console.log("MessageID is " + data.MessageId);
            }).catch(
                function (err) {
                    console.error(err, err.stack);
                });

    } catch (e) {
        var data = "";
    }
}

module.exports = {
    sendNotification
}