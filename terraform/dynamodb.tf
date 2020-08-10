resource "aws_dynamodb_table" "colourCharts" {
    name            = "colourCharts"
    billing_mode    = "PAY_PER_REQUEST"
    hash_key        = "colourChartId"
    range_key       = "createdTime"

    attribute {
        name = "colourChartId"
        type = "S"
    }

    attribute {
        name = "createdTime"
        type = "N"
    }

}
