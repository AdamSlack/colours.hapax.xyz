data "aws_route53_zone" "colours_hapax" {
    name = "hapax.xyz"
    private_zone = false
}

resource "aws_route53_record" "colours_hapax_record" {
    zone_id = data.aws_route53_zone.colours_hapax.zone_id
    name    = "colours.hapax.xyz"
    type    = "A"

    alias {
        name                   = aws_cloudfront_distribution.colours_hapax.domain_name
        zone_id                = aws_cloudfront_distribution.colours_hapax.hosted_zone_id
        evaluate_target_health = false
    }
}

resource "aws_route53_record" "www_colours_hapax_record" {
    zone_id = data.aws_route53_zone.colours_hapax.zone_id
    name    = "www.colours.hapax.xyz"
    type    = "A"

    alias {
        name                   = aws_cloudfront_distribution.colours_hapax.domain_name
        zone_id                = aws_cloudfront_distribution.colours_hapax.hosted_zone_id
        evaluate_target_health = false
    }
}

resource "aws_route53_record" "api_colours_hapax_record" {
    zone_id = data.aws_route53_zone.colours_hapax.zone_id
    name    = "api.colours.hapax.xyz"
    type    = "A"

    alias {
        name                   = aws_cloudfront_distribution.colours_hapax.domain_name
        zone_id                = aws_cloudfront_distribution.colours_hapax.hosted_zone_id
        evaluate_target_health = false
    }
}

resource "aws_route53_record" "www_api_colours_hapax_record" {
    zone_id = data.aws_route53_zone.colours_hapax.zone_id
    name    = "www.api.colours.hapax.xyz"
    type    = "A"

    alias {
        name                   = aws_api_gateway_domain_name.colours_hapax.cloudfront_domain_name
        zone_id                = aws_api_gateway_domain_name.colours_hapax.cloudfront_zone_id
        evaluate_target_health = false
    }
}

resource "aws_route53_record" "cert_validation" {
    for_each = {
        for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
            name   = dvo.resource_record_name
            record = dvo.resource_record_value
            type   = dvo.resource_record_type
        }
    }

    name            = each.value.name
    records         = [each.value.record]
    ttl             = 60
    type            = each.value.type
    zone_id         = data.aws_route53_zone.colours_hapax.zone_id
}

resource "aws_route53_record" "api_cert_validation" {
    for_each = {
        for dvo in aws_acm_certificate.api_cert.domain_validation_options : dvo.domain_name => {
            name   = dvo.resource_record_name
            record = dvo.resource_record_value
            type   = dvo.resource_record_type
        }
    }

    name            = each.value.name
    records         = [each.value.record]
    ttl             = 60
    type            = each.value.type
    zone_id         = data.aws_route53_zone.colours_hapax.zone_id
}
