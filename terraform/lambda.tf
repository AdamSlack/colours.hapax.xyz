data "archive_file" "getColourCharts" {
    type        = "zip"
    source_dir  = "${path.module}/../backend/lambda-build/getColourCharts"
    output_path = "${path.module}/lambda-build/getColourCharts.zip"
}

data "archive_file" "postColourChart" {
    type        = "zip"
    source_dir  = "${path.module}/../backend/lambda-build/postColourChart"
    output_path = "${path.module}/lambda-build/postColourChart.zip"
}

resource "aws_lambda_function" "getColourCharts" {
    function_name       = "getColourCharts"
    
    filename            = data.archive_file.getColourCharts.output_path
    source_code_hash    = filebase64sha256(data.archive_file.getColourCharts.output_path)

    role                = aws_iam_role.getColourCharts.arn

    handler             = "getColourCharts.handler"
    runtime             = "nodejs12.x"

    environment {
        variables = {
            COLOUR_CHART_TABLE_NAME = aws_dynamodb_table.colourCharts.name
        }
    }
}

resource "aws_lambda_function" "postColourChart" {
    function_name       = "postColourChart"
    
    filename            = data.archive_file.postColourChart.output_path
    source_code_hash    = filebase64sha256(data.archive_file.postColourChart.output_path)
    
    role                = aws_iam_role.postColourChart.arn

    handler             = "postColourChart.handler"
    runtime             = "nodejs12.x"

    environment {
        variables = {
            COLOUR_CHART_TABLE_NAME = aws_dynamodb_table.colourCharts.name
        }
    }
}
