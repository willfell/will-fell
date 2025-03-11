###########################
#  Variables
###########################

variable "domain_name" {
  type        = string
  description = "The domain name to register a hosted zone for and to serve from CloudFront."
  default     = "willfellhoelter.com"
}

variable "aws_region" {
  type        = string
  description = "Default AWS region for most resources."
  default     = "us-west-1"
}

variable "bucket_name" {
  type        = string
  description = "Name of the S3 bucket to store Next.js static files."
  default     = "willfellhoelter-website-bucket"
}
