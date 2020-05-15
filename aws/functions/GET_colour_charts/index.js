const { DocumentClient } = require('aws-sdk/clients/dynamodb')

const db = new DocumentClient()
const tableName = 'colourCharts'

const scanColourCharts = (LastEvaluatedKey) => {
    const params = {
        TableName: tableName,
        Index: 'createdEpoch',
        Limit: 10,
    }
    if (LastEvaluatedKey) { 
        params.ExclusiveStartKey = LastEvaluatedKey
    }
    return db.scan(params).promise()
}

const handler = async (event) => {
    const queryStringParameters = event.queryStringParameters
    let lastEvaluatedKey
    if(event.queryStringParameters && queryStringParameters.createdEpoch && queryStringParameters.colourChartId) {
        lastEvaluatedKey = {
            createdEpoch: parseInt(queryStringParameters.createdEpoch),
            colourChartId: queryStringParameters.colourChartId
        }
    }
    const colourCharts = await scanColourCharts(lastEvaluatedKey)
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ colourCharts }),
    }
    return response
}

module.exports = {
    handler
}
