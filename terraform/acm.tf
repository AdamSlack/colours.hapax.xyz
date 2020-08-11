resource "aws_acm_certificate" "cert" {
    provider = aws.us-east-1
    domain_name       = "colours.hapax.xyz"
    validation_method = "DNS"

    subject_alternative_names = [
        "www.colours.hapax.xyz",
    ]
    
    lifecycle {
        create_before_destroy = true
    }
}

resource "aws_acm_certificate_validation" "cert" {
    provider = aws.us-east-1
    certificate_arn         = aws_acm_certificate.cert.arn
    validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

resource "aws_acm_certificate" "api_cert" {
    provider = aws.us-east-1
    domain_name       = "api.colours.hapax.xyz"
    validation_method = "DNS"

    subject_alternative_names = [
        "www.api.colours.hapax.xyz"
    ]
}

resource "aws_acm_certificate_validation" "api_cert" {
    provider = aws.us-east-1
    certificate_arn         = aws_acm_certificate.api_cert.arn
    validation_record_fqdns = [for record in aws_route53_record.api_cert_validation : record.fqdn]
}
