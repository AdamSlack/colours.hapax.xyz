const { DocumentClient } = require('aws-sdk/clients/dynamodb')

const db = new DocumentClient()
const tableName = 'colourCharts'

const scanColourCharts = (LastEvaluatedKey) => {
    const params = {
        TableName: tableName,
        Index: 'createdEpoch',
        Limit: 2,
    }
    if (LastEvaluatedKey) { 
        params.ExclusiveStartKey = LastEvaluatedKey
    }
    return db.scan(params).promise()
}

const handler = async ({ LastEvaluatedKey }) => {

    const colourCharts = await scanColourCharts(LastEvaluatedKey)
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
