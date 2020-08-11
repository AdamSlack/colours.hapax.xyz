resource "aws_api_gateway_rest_api" "colours_hapax" {
    name            = "colours.hapax.xyz"
    description     = "API for storing and retreiving Colour Chart data"
}

resource "aws_api_gateway_domain_name" "colours_hapax" {
    domain_name     = "api.colours.hapax.xyz"
    certificate_arn = aws_acm_certificate_validation.api_cert.certificate_arn
}

resource "aws_api_gateway_domain_name" "www_colours_hapax" {
    domain_name     = "www.api.colours.hapax.xyz"
    certificate_arn = aws_acm_certificate_validation.api_cert.certificate_arn
}

resource "aws_api_gateway_base_path_mapping" "prod" {
    api_id      = aws_api_gateway_rest_api.colours_hapax.id
    stage_name  = aws_api_gateway_deployment.colours_hapax.stage_name
    domain_name = aws_api_gateway_domain_name.colours_hapax.domain_name
}

resource "aws_api_gateway_base_path_mapping" "www_prod" {
    api_id      = aws_api_gateway_rest_api.colours_hapax.id
    stage_name  = aws_api_gateway_deployment.colours_hapax.stage_name
    domain_name = aws_api_gateway_domain_name.www_colours_hapax.domain_name
}

resource "aws_api_gateway_resource" "charts" {
    path_part   = "charts"
    parent_id   = aws_api_gateway_rest_api.colours_hapax.root_resource_id
    rest_api_id = aws_api_gateway_rest_api.colours_hapax.id
}

resource "aws_api_gateway_method" "get_charts" {
    rest_api_id   = aws_api_gateway_rest_api.colours_hapax.id
    resource_id   = aws_api_gateway_resource.charts.id
    http_method   = "GET"
    authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_charts" {
    rest_api_id             = aws_api_gateway_rest_api.colours_hapax.id
    resource_id             = aws_api_gateway_resource.charts.id
    http_method             = aws_api_gateway_method.get_charts.http_method
    integration_http_method = "POST"
    type                    = "AWS_PROXY"
    uri                     = aws_lambda_function.getColourCharts.invoke_arn
}

resource "aws_api_gateway_deployment" "colours_hapax" {
    depends_on = [aws_api_gateway_integration.get_charts]

    rest_api_id = aws_api_gateway_rest_api.colours_hapax.id
    stage_name  = "prod"

    lifecycle {
        create_before_destroy = true
    }
}
