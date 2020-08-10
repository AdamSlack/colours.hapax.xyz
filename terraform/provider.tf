provider "aws" {
    version = "~> 3.0"
    region = "eu-west-2"
}

provider "aws" {
    version = "~> 3.0"
    region = "us-east-1"
    alias = "us-east-1"
}
