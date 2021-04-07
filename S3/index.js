require('dotenv').config();
const AWS = require('aws-sdk');

const config = () => {
    const options = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };
 
    return new AWS.S3(options);
};

const getObject = (Key) => {
    const s3 = config();
    return s3.getObject({ Bucket: process.env.AWS_BUCKET, Key }).promise();
};

const listObjectsV2 = (NextContinuationToken = '') => {
    const s3 = config();
    let params = { Bucket: process.env.AWS_BUCKET, Prefix: 'qgdi', MaxKeys: 10000 };

    if (NextContinuationToken) {
        params = { ...params, ContinuationToken: NextContinuationToken };
    }

    return s3.listObjectsV2(params).promise();
};

module.exports = { listObjectsV2, getObject }
