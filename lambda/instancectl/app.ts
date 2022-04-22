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
    // discord bot verification
    try {
        const header = event.headers;
        const signature = header['X-Signature-Ed25519'];
        const timestamp = header['X-Signature-Timestamp'];
        if (!signature || !timestamp) throw new Error('neccecary X-Signature headers are missing');
        if (!event.body) throw new Error('Missing body');
        const body = JSON.parse(event.body);
        const isVerified = nacl.sign.detached.verify(
            Buffer.from(timestamp + body),
            Buffer.from(signature, 'hex'),
            Buffer.from(process.env.DISCORD_APPLICATION_PUBLIC_KEY || '', 'hex'),
        );
        if (!isVerified) throw new Error('Signature is not verified');
    } catch (err) {
        const response = {
            statusCode: 401,
            body: JSON.stringify({
                message: err,
            }),
        };
        return response;
    }

    AWS.config.update({ region: process.env.REGION });
    const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
    const instanceId = process.env.INSTANCE_ID;
    if (!instanceId) throw new Error('Instance ID is not set');
    const params: AWS.EC2.StartInstancesRequest = {
        InstanceIds: [instanceId],
        DryRun: true,
    };
    const body = JSON.parse(event.body);
    const action = body.data.options[0].value;
    const username = body.member.user.username;
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
