#!/bin/bash

set -e

# Variables
DB_INSTANCE_ID="health-instance"
SG_NAME="health-rds-sgR"
AWS_REGION="us-east-1"
ENV_FILE="./api/.env"

# Load Cognito values from .env if it exists
if [ -f "$ENV_FILE" ]; then
    source $ENV_FILE
else
    echo ".env file not found. Continuing cleanup without Cognito values."
fi

# Delete RDS instance
echo "Attempting to delete RDS instance: $DB_INSTANCE_ID..."
aws rds delete-db-instance \
    --db-instance-identifier $DB_INSTANCE_ID \
    --skip-final-snapshot \
    --region $AWS_REGION || echo "RDS instance not found or already deleted."

echo "Waiting for RDS instance to be deleted (if applicable)..."
aws rds wait db-instance-deleted \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $AWS_REGION || echo "RDS instance already deleted or not found."

# Delete Security Group
echo "Attempting to delete security group: $SG_NAME..."
SG_ID=$(aws ec2 describe-security-groups \
    --filters Name=group-name,Values=$SG_NAME \
    --region $AWS_REGION \
    --query "SecurityGroups[0].GroupId" \
    --output text 2>/dev/null || echo "")

if [ -n "$SG_ID" ]; then
    aws ec2 delete-security-group \
        --group-id $SG_ID \
        --region $AWS_REGION || echo "Failed to delete security group: $SG_ID"
else
    echo "Security group $SG_NAME not found."
fi

# Delete Cognito domain
if [ -n "$COGNITO_DOMAIN" ]; then
    DOMAIN_PREFIX=$(echo $COGNITO_DOMAIN | cut -d'.' -f1 | cut -d'/' -f3)
    echo "Attempting to delete Cognito domain: $DOMAIN_PREFIX..."
    aws cognito-idp delete-user-pool-domain \
        --region $AWS_REGION \
        --domain $DOMAIN_PREFIX || echo "Cognito domain not found or already deleted."
fi

# Delete Cognito App Client
if [ -n "$USER_POOL_ID" ] && [ -n "$APP_CLIENT_ID" ]; then
    echo "Attempting to delete Cognito App Client..."
    aws cognito-idp delete-user-pool-client \
        --region $AWS_REGION \
        --user-pool-id $USER_POOL_ID \
        --client-id $APP_CLIENT_ID || echo "Cognito App Client not found or already deleted."
fi

# Delete Cognito User Pool
if [ -n "$USER_POOL_ID" ]; then
    echo "Attempting to delete Cognito User Pool..."
    aws cognito-idp delete-user-pool \
        --region $AWS_REGION \
        --user-pool-id $USER_POOL_ID || echo "User Pool not found or already deleted."
fi

# Delete .env file
echo "Removing .env file (if exists)..."
rm -f $ENV_FILE

echo "Cleanup completed."
