import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { config } from 'dotenv';
import { lambdaHandler } from '../../app';

describe('EC2 control api test', function () {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });
    afterAll(() => {
        process.env = OLD_ENV;
    });
    config();

    it('ping test', async () => {
        const event: APIGatewayProxyEvent = {
            resource: '/instance_ctl',
            path: '/instance_ctl/',
            httpMethod: 'POST',
            headers: {
                'CloudFront-Forwarded-Proto': 'https',
                'CloudFront-Is-Desktop-Viewer': 'true',
                'CloudFront-Is-Mobile-Viewer': 'false',
                'CloudFront-Is-SmartTV-Viewer': 'false',
                'CloudFront-Is-Tablet-Viewer': 'false',
                'CloudFront-Viewer-Country': 'US',
                'content-type': 'application/json',
                Host: '8o9e11wg8h.execute-api.ap-northeast-1.amazonaws.com',
                'User-Agent': 'Discord-Interactions/1.0 (+https://discord.com)',
                Via: '1.1 2d1c46f78407b3ac919cadf865dd3246.cloudfront.net (CloudFront)',
                'X-Amz-Cf-Id': 'k-66bY4qVS6I8Q7VyDFRNUO7nwcggEV8qvtvv5suO-iK-MS70eBHFQ==',
                'X-Amzn-Trace-Id': 'Root=1-62641b3b-06fce508147239cc4a2c5f2e',
                'X-Forwarded-For': '35.196.132.85, 130.176.210.38',
                'X-Forwarded-Port': '443',
                'X-Forwarded-Proto': 'https',
                'x-signature-ed25519':
                    '95c8b5c2a0221ce635f8514fcd66a7ae982a05f728b92e3b6e27777fcdd4764e1e10393556848507313b016187d607915c26271fabd7c30119d401c66a5c0f06',
                'x-signature-timestamp': '1650727739',
            },
            multiValueHeaders: {
                'CloudFront-Forwarded-Proto': ['https'],
                'CloudFront-Is-Desktop-Viewer': ['true'],
                'CloudFront-Is-Mobile-Viewer': ['false'],
                'CloudFront-Is-SmartTV-Viewer': ['false'],
                'CloudFront-Is-Tablet-Viewer': ['false'],
                'CloudFront-Viewer-Country': ['US'],
                'content-type': ['application/json'],
                Host: ['8o9e11wg8h.execute-api.ap-northeast-1.amazonaws.com'],
                'User-Agent': ['Discord-Interactions/1.0 (+https://discord.com)'],
                Via: ['1.1 2d1c46f78407b3ac919cadf865dd3246.cloudfront.net (CloudFront)'],
                'X-Amz-Cf-Id': ['k-66bY4qVS6I8Q7VyDFRNUO7nwcggEV8qvtvv5suO-iK-MS70eBHFQ=='],
                'X-Amzn-Trace-Id': ['Root=1-62641b3b-06fce508147239cc4a2c5f2e'],
                'X-Forwarded-For': ['35.196.132.85, 130.176.210.38'],
                'X-Forwarded-Port': ['443'],
                'X-Forwarded-Proto': ['https'],
                'x-signature-ed25519': [
                    '95c8b5c2a0221ce635f8514fcd66a7ae982a05f728b92e3b6e27777fcdd4764e1e10393556848507313b016187d607915c26271fabd7c30119d401c66a5c0f06',
                ],
                'x-signature-timestamp': ['1650727739'],
            },
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            pathParameters: null,
            stageVariables: null,
            requestContext: {
                resourceId: 'hu0ab0',
                resourcePath: '/instance_ctl',
                httpMethod: 'POST',
                extendedRequestId: 'RCkxYEepNjMFcUg=',
                requestTime: '23/Apr/2022:15:28:59 +0000',
                path: '/Prod/instance_ctl/',
                accountId: '349923220815',
                protocol: 'HTTP/1.1',
                stage: 'Prod',
                domainPrefix: '8o9e11wg8h',
                requestTimeEpoch: 1650727739890,
                requestId: 'd4e67247-7f1a-4e71-87a5-b7c7365ad67f',
                authorizer: null,
                identity: {
                    apiKey: null,
                    apiKeyId: null,
                    clientCert: null,
                    cognitoIdentityPoolId: null,
                    accountId: null,
                    cognitoIdentityId: null,
                    caller: null,
                    sourceIp: '35.196.132.85',
                    principalOrgId: null,
                    accessKey: null,
                    cognitoAuthenticationType: null,
                    cognitoAuthenticationProvider: null,
                    userArn: null,
                    userAgent: 'Discord-Interactions/1.0 (+https://discord.com)',
                    user: null,
                },
                domainName: '8o9e11wg8h.execute-api.ap-northeast-1.amazonaws.com',
                apiId: '8o9e11wg8h',
            },
            body: '{"application_id":"965613560036212787","id":"967446995566489661","token":"aW50ZXJhY3Rpb246OTY3NDQ2OTk1NTY2NDg5NjYxOmgyaVM5dlUyb0JKSGR1U2VaQjZndDVKNVhGTEdHZXhvOFd4NWRnV2ZqOEJwYW5TaFFCMmJHdTA1MFFOZHRQemptTFRWT2Z2b1NJbTkxa1RKVHUxekdRZGtqdXd4bUdOTEhzSGN1NGhEMDhWYlhFSTlmZEtBeEV4RDlsZXZuUmZr","type":1,"user":{"avatar":"d0958e667cad57d1e8d7c40b0f49fac8","avatar_decoration":null,"discriminator":"6227","id":"768864502409986078","public_flags":0,"username":"mie"},"version":1}',
            isBase64Encoded: false,
        };

        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(JSON.stringify({ type: 1 }));
    });

    it('discord test slash command', async () => {
        const event: APIGatewayProxyEvent = {
            resource: '/instance_ctl',
            path: '/instance_ctl',
            httpMethod: 'POST',
            headers: {
                'CloudFront-Forwarded-Proto': 'https',
                'CloudFront-Is-Desktop-Viewer': 'true',
                'CloudFront-Is-Mobile-Viewer': 'false',
                'CloudFront-Is-SmartTV-Viewer': 'false',
                'CloudFront-Is-Tablet-Viewer': 'false',
                'CloudFront-Viewer-Country': 'US',
                'content-type': 'application/json',
                Host: '8o9e11wg8h.execute-api.ap-northeast-1.amazonaws.com',
                'User-Agent': 'Discord-Interactions/1.0 (+https://discord.com)',
                Via: '1.1 0f5936cdf2af835ee10067067b9d47e0.cloudfront.net (CloudFront)',
                'X-Amz-Cf-Id': 'qVljUhbSEzSz8MdvEYp26o44oPX9frOSfgdMIECcBP-gQ3n0pAw8DA==',
                'X-Amzn-Trace-Id': 'Root=1-6264eca6-51ea21af68efe80e5f267d9f',
                'X-Forwarded-For': '35.237.4.214, 130.176.210.17',
                'X-Forwarded-Port': '443',
                'X-Forwarded-Proto': 'https',
                'x-signature-ed25519':
                    'dd196766fe43af6ac249d5a22e937f73406aefc2f00a7acc5ada3ddaa1acef9a90a6aa208e0f0e6d75fa038f209ea9e3dac5b1f2069a6483996661e861f62b0e',
                'x-signature-timestamp': '1650781350',
            },
            multiValueHeaders: {
                'CloudFront-Forwarded-Proto': ['https'],
                'CloudFront-Is-Desktop-Viewer': ['true'],
                'CloudFront-Is-Mobile-Viewer': ['false'],
                'CloudFront-Is-SmartTV-Viewer': ['false'],
                'CloudFront-Is-Tablet-Viewer': ['false'],
                'CloudFront-Viewer-Country': ['US'],
                'content-type': ['application/json'],
                Host: ['8o9e11wg8h.execute-api.ap-northeast-1.amazonaws.com'],
                'User-Agent': ['Discord-Interactions/1.0 (+https://discord.com)'],
                Via: ['1.1 0f5936cdf2af835ee10067067b9d47e0.cloudfront.net (CloudFront)'],
                'X-Amz-Cf-Id': ['qVljUhbSEzSz8MdvEYp26o44oPX9frOSfgdMIECcBP-gQ3n0pAw8DA=='],
                'X-Amzn-Trace-Id': ['Root=1-6264eca6-51ea21af68efe80e5f267d9f'],
                'X-Forwarded-For': ['35.237.4.214, 130.176.210.17'],
                'X-Forwarded-Port': ['443'],
                'X-Forwarded-Proto': ['https'],
                'x-signature-ed25519': [
                    'dd196766fe43af6ac249d5a22e937f73406aefc2f00a7acc5ada3ddaa1acef9a90a6aa208e0f0e6d75fa038f209ea9e3dac5b1f2069a6483996661e861f62b0e',
                ],
                'x-signature-timestamp': ['1650781350'],
            },
            queryStringParameters: null,
            multiValueQueryStringParameters: null,
            pathParameters: null,
            stageVariables: null,
            requestContext: {
                authorizer: null,
                resourceId: 'hu0ab0',
                resourcePath: '/instance_ctl',
                httpMethod: 'POST',
                extendedRequestId: 'REnqBF1RNjMFTbQ=',
                requestTime: '24/Apr/2022:06:22:30 +0000',
                path: '/Prod/instance_ctl',
                accountId: '349923220815',
                protocol: 'HTTP/1.1',
                stage: 'Prod',
                domainPrefix: '8o9e11wg8h',
                requestTimeEpoch: 1650781350362,
                requestId: '57a69618-4be5-4371-89ee-03cccfa3d557',
                identity: {
                    apiKey: null,
                    apiKeyId: null,
                    clientCert: null,
                    cognitoIdentityPoolId: null,
                    accountId: null,
                    cognitoIdentityId: null,
                    caller: null,
                    sourceIp: '35.237.4.214',
                    principalOrgId: null,
                    accessKey: null,
                    cognitoAuthenticationType: null,
                    cognitoAuthenticationProvider: null,
                    userArn: null,
                    userAgent: 'Discord-Interactions/1.0 (+https://discord.com)',
                    user: null,
                },
                domainName: '8o9e11wg8h.execute-api.ap-northeast-1.amazonaws.com',
                apiId: '8o9e11wg8h',
            },
            body: '{"application_id":"965613560036212787","channel_id":"965611526255943764","data":{"guild_id":"965611526255943762","id":"965853656517836821","name":"server","options":[{"name":"action","type":3,"value":"test"}],"type":1},"guild_id":"965611526255943762","guild_locale":"en-US","id":"967671861339103272","locale":"en-US","member":{"avatar":null,"communication_disabled_until":null,"deaf":false,"flags":0,"is_pending":false,"joined_at":"2022-04-18T13:55:28.073000+00:00","mute":false,"nick":null,"pending":false,"permissions":"4398046511103","premium_since":null,"roles":[],"user":{"avatar":"d0958e667cad57d1e8d7c40b0f49fac8","avatar_decoration":null,"discriminator":"6227","id":"768864502409986078","public_flags":0,"username":"mie"}},"token":"aW50ZXJhY3Rpb246OTY3NjcxODYxMzM5MTAzMjcyOmxvOTh3WWh1UThhS0U3YUdrSDNUWm5aQnk1aXAxakpFNWRpd09FWWNGREFvUUVjZk1OV2xxRVhTQmljNVBtMld6NGJnbFdNSkxZSFJ1NGc2d0h1MmdpWXJBV0w0REpHNm1WRG9lUEE4NEJCVG15OXZoWWsxREMzYXBlc1ZadFpC","type":2,"version":1}',
            isBase64Encoded: false,
        };

        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                type: 4,
                data: {
                    content: 'ok',
                },
            }),
        );
    });
});
