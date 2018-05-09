'use strict';

let AWS = require('aws-sdk');
let sf = new AWS.StepFunctions();

exports.handler = (event, context, callback) => {
    Promise.resolve().then(() => {
        // 引数値のちェック
        if (!JSON.stringify(event)) {
            throw new TypeError(`Input values is not data`);
        }
        return {values: event};
    }).then((data) => {
        console.log("event.request:"+event.request);
        if (event.request === 1) {
            callback(null, {values  : event,
                            arns    : {func01: process.env.FUNC01_ARN, func02: process.env.FUNC02_ARN}});
        } else {
            callback(null, {values  : event,
                            arns    : {func01: process.env.FUNC01_ARN, func02: process.env.FUNC02_ARN, func03: process.env.FUNC03_ARN}});
        }
    }).catch((err/*: Error | mixed */) => {
        if (err instanceof Error) {
            callback(err);
        } else {
            callback(new Error(err));
        }
    });
};
