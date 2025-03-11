###########################
#  Providers & Credentials
###########################

terraform {
  required_version = ">= 1.5.5"

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.90.1"
    }
  }
}

provider "aws" {
  region  = var.aws_region
}

provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
}

terraform {
  backend "s3" {
    region               = "us-west-1"
    bucket               = "will-fell-tfstate"
    key                  = "will/fell/tf.tfstate"
  }
}

