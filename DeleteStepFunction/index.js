/* @flow */
'use strict';

let AWS = require('aws-sdk');
let sf = new AWS.StepFunctions();

exports.handler = (event, context, callback) => {

    Promise.resolve().then(() => {
        if (typeof event !== 'string') {
            throw new TypeError(`Input value is not string`);
        }
        return {
            executionArn: event
        }
    }).then((params) => {
        return new Promise((resolve, reject) => {
            console.log('StateFunctions::DescribeExecution', params);
            sf.describeExecution(params, (err, data) => err ? reject(err) : resolve(data));
        });
    }).then((response) => {
        if (response.status !== 'SUCCEEDED') {
            return response;
        }
        return new Promise((resolve, reject) => {
            let params = {
                stateMachineArn: response.stateMachineArn
            };
            console.log('StateFunctions::DeleteStateMachine', params);
            // sf.deleteStateMachine(params, (err, data) => err ? reject(err) : resolve(response));
            resolve(response)
        });
    }).then((response) => {
        callback(null, {
            status: response.status,
            values: response.output ? JSON.parse(response.output) : null,
            executionArn: event
        });
    }).catch((err /*: Error | mixed */ ) => {
        if (err instanceof Error) {
            callback(err);
        } else {
            callback(new Error(err));
        }
    });
};
