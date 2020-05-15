const { DocumentClient } = require('aws-sdk/clients/dynamodb')

const db = new DocumentClient()
const tableName = 'colourCharts'

const expectedFields = new Set([
    "canvasHeight",
    "canvasWidth",
    "pollingRate",
    "lineThickness",
    "fileName",
    "drawStyle",
    "computedColours",
])

const isValidColourChart = (colourChart) => {
    const keys = Object.keys(colourChart)
    const hasExpectedFields = keys.every((key) => expectedFields.has(key)) && expectedFields.size === keys.length
    
    if(!hasExpectedFields) return false
    
    const fieldValidations = [
        typeof colourChart.canvasHeight  === 'number',
        typeof colourChart.canvasWidth  === 'number',
        typeof colourChart.pollingRate  === 'number',
        typeof colourChart.lineThickness  === 'number',
        typeof colourChart.fileName  === 'string',
        typeof colourChart.drawStyle  === 'string',
        typeof colourChart.computedColours  === 'object' && colourChart.computedColours.every((colour) => {
            return typeof colour.r === 'number'
            && typeof colour.g === 'number'
            && typeof colour.b === 'number'
        }),
    ]
    
    return fieldValidations.every((isValid) => isValid)
}

const storeColourChart = (colourChart) => {
    return db.put({
        TableName: tableName,
        Item: colourChart
    }).promise()
}


const handler = async (event, context) => {
    const colourChart = JSON.parse(event.body)
    if(!isValidColourChart(colourChart)) {
        return {
            statusCode: 400,
        }
    }

    await storeColourChart({
        colourChartId: context.awsRequestId,
        createdEpoch: Date.now(),
        ...colourChart
    })

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        statusCode: 200,
    };
    return response;
};

module.exports = {
    handler
}
