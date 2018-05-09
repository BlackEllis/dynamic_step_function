/* @flow */
'use strict';

let AWS = require('aws-sdk');
let sf = new AWS.StepFunctions();

exports.handler = (event, context, callback) => {

    Promise.resolve().then(() => {
        if (!event) {
            throw new TypeError(`Input value is empty`);
        }
        if (typeof event.stateMachineArn !== 'string') {
            throw new TypeError(`event.stateMachineArn is not string`);
        }
        return {
            stateMachineArn: event.stateMachineArn,
            input: JSON.stringify(event.values)
        };
    }).then((params) => {
        return new Promise((resolve, reject) => {
            console.log('StateFunctions::StartExecution', params);
            sf.startExecution(params, (err, data) => err ? reject(err) : resolve(data));
        });
    }).then((response) => {
        callback(null, response.executionArn);
    }).catch((err /*: Error | mixed */ ) => {
        if (err instanceof Error) {
            callback(err);
        } else {
            callback(new Error(err));
        }
    });
};
