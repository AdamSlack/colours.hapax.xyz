resource "aws_apigatewayv2_api" "colours_hapax" {
    name          = "colours.hapax.xyz"
    protocol_type = "HTTP"
}

resource "aws_apigatewayv2_domain_name" "colours_hapax" {
    domain_name = "api.colours.hapax.xyz"

    domain_name_configuration {
        certificate_arn = aws_acm_certificate.api_cert.arn
        endpoint_type   = "REGIONAL"
        security_policy = "TLS_1_2"
    }
}
