import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Checking signature header
    try {
        const signature = event.headers['x-signature-ed25519'];
        const timestamp = event.headers['x-signature-timestamp'];
        const strBody = event.body;
        const discordPublicKey = process.env.DISCORD_PUBLIC_KEY;
        if (!signature || !timestamp) throw new Error('neccesary X-Signature headers are missing');
        if (!strBody) throw new Error('Missing body');
        if (!discordPublicKey) throw new Error('Missing DISCORD_PUBLIC_KEY environment variable');
        const isVerified = nacl.sign.detached.verify(
            Buffer.from(timestamp + strBody),
            Buffer.from(signature, 'hex'),
            Buffer.from(discordPublicKey, 'hex'),
        );
        if (!isVerified) throw new Error('invalid request signature');
    } catch (err) {
        console.log(err);
        const response = {
            statusCode: 401,
            body: JSON.stringify({
                message: err,
            }),
        };
        return response;
    }

    const instanceId = process.env.INSTANCE_ID;
    const region = process.env.REGION;
    if (!instanceId) throw new Error('Missing INSTANCE_ID environment variable');
    if (!region) throw new Error('Missing REGION environment variable');
    AWS.config.update({ region: region });
    const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
    const params: AWS.EC2.StartInstancesRequest = {
        InstanceIds: [instanceId],
        DryRun: true,
    };
    const body = JSON.parse(event.body!);
    const action = body.data.options[0].value;
    const username = body.member.user.username;

    // Replying to ping
    if (body.type === 1) {
        return {
            statusCode: 200,
            body: JSON.stringify({ type: 1 }),
        };
    }

    try {
        switch (action) {
            case 'start': {
                await ec2.startInstances(params).promise();
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: `hi, ${username} Successfully started minecraft server!`,
                    }),
                };
            }
            case 'stop': {
                await ec2.stopInstances(params).promise();
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Successfully stopped minecraft server!',
                    }),
                };
            }
            case 'test': {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'test',
                    }),
                };
            }
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "I don't know what you want me to do",
                    }),
                };
        }
    } catch (err) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err,
            }),
        };
        return response;
    }
};
