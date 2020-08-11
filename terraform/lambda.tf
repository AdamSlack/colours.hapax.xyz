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

    handler             = "index.handler"
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

    handler             = "index.handler"
    runtime             = "nodejs12.x"

    environment {
        variables = {
            COLOUR_CHART_TABLE_NAME = aws_dynamodb_table.colourCharts.name
        }
    }
}

resource "aws_lambda_permission" "apigw_lambda" {
    statement_id  = "AllowExecutionFromAPIGateway"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.getColourCharts.function_name
    principal     = "apigateway.amazonaws.com"

    # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
    source_arn = "arn:aws:execute-api:eu-west-2:${var.aws_account}:${aws_api_gateway_rest_api.colours_hapax.id}/*/${aws_api_gateway_method.get_charts.http_method}${aws_api_gateway_resource.charts.path}"
}
