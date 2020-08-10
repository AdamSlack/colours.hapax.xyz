    resource "aws_cloudfront_distribution" "colours_hapax" {
    http_version = "http2"

    origin {
        origin_id   = "origin-colours.hapax.xyz"
        domain_name = aws_s3_bucket.colours_hapax.website_endpoint

        custom_origin_config {
        origin_protocol_policy = "http-only"
        http_port              = "80"
        https_port             = "443"
        origin_ssl_protocols   = ["TLSv1.2"]
        }
    }

    enabled             = true
    default_root_object = "index.html"

    aliases = ["colours.hapax.xyz", "www.colours.hapax.xyz"]

    restrictions {
        geo_restriction {
        restriction_type = "none"
        }
    }

    default_cache_behavior {
        target_origin_id = "origin-colours.hapax.xyz"
        allowed_methods  = ["GET", "HEAD"]
        cached_methods   = ["GET", "HEAD"]
        compress         = true

        forwarded_values {
            query_string = false

            cookies {
                forward = "none"
            }
        }

        viewer_protocol_policy = "redirect-to-https"
        min_ttl                = 0
        default_ttl            = 300
        max_ttl                = 1200
    }

    viewer_certificate {
        acm_certificate_arn      = aws_acm_certificate_validation.cert.certificate_arn
        ssl_support_method       = "sni-only"
        minimum_protocol_version = "TLSv1"
    }
    }
