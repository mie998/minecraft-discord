import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';

const responseBuilder = (statusCode: number, message: string, type = 4): APIGatewayProxyResult => {
    return {
        statusCode: statusCode,
        body: JSON.stringify({
            type: type,
            data: {
                content: message,
            },
        }),
    };
};

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
        return responseBuilder(401, err as string);
    }

    const instanceId = process.env.INSTANCE_ID;
    const region = process.env.REGION;
    if (!instanceId) throw new Error('Missing INSTANCE_ID environment variable');
    if (!region) throw new Error('Missing REGION environment variable');
    AWS.config.update({ region: region });
    const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
    const params: AWS.EC2.StartInstancesRequest = {
        InstanceIds: [instanceId],
        DryRun: false,
    };

    const body = JSON.parse(event.body!);
    switch (body.type) {
        // Replying to ping
        case 1: {
            return responseBuilder(200, 'pong', 1);
        }
        // Replying to slash commands
        case 2: {
            const action = body.data.options[0].value;
            const username = body.member.user.username;
            switch (action) {
                case 'start': {
                    try {
                        await ec2.startInstances(params).promise();
                        return responseBuilder(200, `hi, ${username} Successfully started minecraft server!`);
                    } catch (err) {
                        console.error(err);
                        return responseBuilder(500, err as string);
                    }
                }
                case 'stop': {
                    try {
                        await ec2.stopInstances(params).promise();
                        return responseBuilder(200, `Successfully stopped minecraft server!`);
                    } catch (err) {
                        return responseBuilder(500, err as string);
                    }
                }
                case 'test': {
                    return responseBuilder(200, `ok`);
                }
                default:
                    return responseBuilder(400, `I don't know what you want me to do`);
            }
        }
        default:
            return responseBuilder(400, "This bot doesn't support this typeof operation...");
    }
};
