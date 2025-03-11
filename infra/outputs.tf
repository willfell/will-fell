###########################
#  Outputs
###########################

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution."
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution."
  value       = aws_cloudfront_distribution.cdn.id
}

output "s3_bucket_name" {
  description = "The S3 bucket name for static hosting."
  value       = aws_s3_bucket.website.bucket
}
