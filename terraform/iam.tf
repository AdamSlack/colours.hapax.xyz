resource "aws_iam_role" "getColourCharts" {
	name = "getColourCharts-role"

	assume_role_policy = <<EOF
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Action": "sts:AssumeRole",
			"Principal": {
				"Service": "lambda.amazonaws.com"
			},
			"Effect": "Allow",
			"Sid": ""
		}
	]
}
EOF
}

resource "aws_iam_policy" "getColourCharts" {
	name = "getColourCharts-policy"

	policy = <<EOF
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"dynamodb:Scan"
			],
			"Resource": ["${aws_dynamodb_table.colourCharts.arn}"]
		}
	]
}
EOF
}

resource "aws_iam_policy_attachment" "getColourCharts" {
	name = "getColourCharts-policy-attachement"

	roles = [
		aws_iam_role.getColourCharts.name,
	]

	policy_arn = aws_iam_policy.getColourCharts.arn
}

resource "aws_iam_role" "postColourChart" {
	name = "postColourChart-role"

	assume_role_policy = <<EOF
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Action": "sts:AssumeRole",
			"Principal": {
				"Service": "lambda.amazonaws.com"
			},
			"Effect": "Allow",
			"Sid": ""
		}
	]
}
EOF
}

resource "aws_iam_policy" "postColourChart" {
	name = "postColourChart-policy"

	policy = <<EOF
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"dynamodb:PutItem"
			],
			"Resource": ["${aws_dynamodb_table.colourCharts.arn}"]
		}
	]
}
EOF
}

resource "aws_iam_policy_attachment" "postColourChart" {
	name = "postColourChart-policy-attachement"

	roles = [
		aws_iam_role.postColourChart.name,
	]

	policy_arn = aws_iam_policy.postColourChart.arn
}
