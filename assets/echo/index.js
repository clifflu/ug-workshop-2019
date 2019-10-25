exports.handle = async function (event) {
    console.log({ event });

    const { queryStringParameters } = event;

    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({
            queryStringParameters
        })
    };
};
