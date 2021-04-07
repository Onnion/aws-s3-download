const fs = require('fs-extra');
const { listObjectsV2, getObject } = require('./S3');
 
const getContents = async ($contents = [], NextContinuationToken = '') => {
    let contents = $contents || [];
    try {
        const objects = await listObjectsV2(NextContinuationToken);
        contents = [ ...contents, ...objects.Contents ];

        if (!objects.NextContinuationToken) {
            return contents;
        } else {
            return await getContents(contents, objects.NextContinuationToken);
        }

    } catch (error) {
        console.log(error);
    }   
};

const run = async () => {
    try {
        const contents = await getContents();   
        
        for( const content of contents) {
            const object = await getObject(content.Key);

            if (/.[\w]{3}$/.test(content.Key)) {
                console.log(content.Key);
                fs.outputFileSync(content.Key, object.Body);
            }
        }

    } catch (error) {
        console.log(error);
    }
}

run();
