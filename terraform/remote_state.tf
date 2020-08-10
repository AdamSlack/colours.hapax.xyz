terraform {
    backend "s3" {
        bucket         = "colours-hapax-remote-state"
        key            = "global/s3/colours-hapax/terraform.tfstate"
        region         = "eu-west-2"
    }
}
