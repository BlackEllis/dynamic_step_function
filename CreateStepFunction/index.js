'use strict';

let _ = require('lodash');
let AWS = require('aws-sdk');
let uuid = require('uuid');

let sf = new AWS.StepFunctions();

exports.handler = (event, context, callback) => {
    Promise.resolve().then(() => {
        if (!event) {
            throw new TypeError(`Input value is empty`);
        }
        if (!JSON.stringify(event)) {
            throw new TypeError('JSON Parse Error');
        }
        if (!event.arns) {
            throw new TypeError('Input arns is empty');
        }
        return event;
    }).then((data) => {
        var backFuncName = '';
        var jsonDefinition = {States: {}};

        Object.keys(data.arns).map((key) => {
            jsonDefinition.States[key] = {
                Type: 'Task',
                Resource: data.arns[key]
            };
            //jsonDefinition.States[key] = {Type: 'Task', InputPath: data, Resource: data.arns[key]};
            if (backFuncName) {
                jsonDefinition.States[key]['Next'] = backFuncName;
            } else {
                jsonDefinition.States[key]['End'] = true;
            }
            backFuncName = key;
        });

        jsonDefinition['Comment'] = `task map for ${context.functionName}`
        jsonDefinition['StartAt'] = backFuncName;

        return {
            'name': `pm-${uuid.v4()}`,
            'roleArn': process.env.STEP_FUNC_ROLE_ARN,
            'definition': JSON.stringify(jsonDefinition)
        }
    }).then((params) => {
        return new Promise((resolve, reject) => {
            console.log('StateFunctions::CreateStateMachine', params);
            sf.createStateMachine(params, (err, data) => err ? reject(err) : resolve(data));
        });
    }).then((response) => {
        callback(null, {
            values: event.values,
            stateMachineArn: response.stateMachineArn
        });
    }).catch((err /*: Error | mixed */ ) => {
        if (err instanceof Error) {
            callback(err);
        } else {
            callback(new Error(err));
        }
    });
};
