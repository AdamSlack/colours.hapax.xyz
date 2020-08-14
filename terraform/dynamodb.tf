resource "aws_dynamodb_table" "colourCharts" {
    name            = "colourCharts"
    billing_mode    = "PAY_PER_REQUEST"
    hash_key        = "colourChartId"
    range_key       = "createdEpoch"

    attribute {
        name = "colourChartId"
        type = "S"
    }

    attribute {
        name = "createdEpoch"
        type = "N"
    }

}
