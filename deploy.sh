#!/bin/bash

set -e

# Parameters
DB_INSTANCE_ID="health-instance"
DB_NAME="HealthOrganization"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_ENGINE="postgres"
DB_INSTANCE_CLASS="db.t3.micro"
DB_ALLOCATED_STORAGE=20
DB_REGION="us-east-1"
ENV_FILE="./api/.env"
SG_NAME="health-rds-secgroup"
VPC_ID=$(aws ec2 describe-vpcs --region $DB_REGION --query "Vpcs[0].VpcId" --output text)

echo "Creating security group: $SG_NAME..."

# Create security group
SG_ID=$(aws ec2 create-security-group \
    --group-name $SG_NAME \
    --description "Allow PostgreSQL access" \
    --vpc-id $VPC_ID \
    --region $DB_REGION \
    --query "GroupId" \
    --output text)

# Authorize inbound rule for PostgreSQL (port 5432)
aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 0.0.0.0/0 \
    --region $DB_REGION

echo "Creating PostgreSQL RDS instance..."

aws rds create-db-instance \
    --db-instance-identifier $DB_INSTANCE_ID \
    --db-name $DB_NAME \
    --allocated-storage $DB_ALLOCATED_STORAGE \
    --db-instance-class $DB_INSTANCE_CLASS \
    --engine $DB_ENGINE \
    --master-username $DB_USER \
    --master-user-password $DB_PASSWORD \
    --backup-retention-period 1 \
    --publicly-accessible \
    --vpc-security-group-ids $SG_ID \
    --region $DB_REGION \
    --no-cli-pager

echo "Waiting for the instance to become available..."
aws rds wait db-instance-available \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $DB_REGION

# Get endpoint
ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --query "DBInstances[0].Endpoint.Address" \
    --output text \
    --region $DB_REGION)

# Save credentials to .env
echo "Saving credentials to $ENV_FILE..."

{
    echo ""
    echo "# RDS and credentials generated on $(date)"
    echo "RDS_ENDPOINT=$ENDPOINT"
    echo "RDS_DB_NAME=$DB_NAME"
    echo "RDS_USERNAME=$DB_USER"
    echo "RDS_PASSWORD=$DB_PASSWORD"
    echo "RDS_SECURITY_GROUP_ID=$SG_ID"
} >> $ENV_FILE



AWS_REGION="us-east-1"
USER_POOL_NAME="HospitalUsers"
APP_CLIENT_NAME="HospitalAPI"
USERNAME="admin@hospital.com"
TEMP_PASSWORD="Admin123!"
COGNITO_DOMAIN_PREFIX="my-fastapi-auth-demo-$(date +%s)"

echo "Creating User Pool..."
USER_POOL_ID=$(aws cognito-idp create-user-pool \
  --region $AWS_REGION \
  --pool-name $USER_POOL_NAME \
  --auto-verified-attributes email \
  --query 'UserPool.Id' \
  --output text)

echo "User Pool created: $USER_POOL_ID"

echo "Creating App Client..."
APP_CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --region $AWS_REGION \
  --user-pool-id $USER_POOL_ID \
  --client-name $APP_CLIENT_NAME \
  --no-generate-secret \
  --explicit-auth-flows ADMIN_NO_SRP_AUTH USER_PASSWORD_AUTH \
  --query 'UserPoolClient.ClientId' \
  --output text)

echo "App Client created: $APP_CLIENT_ID"

echo "Creating Cognito Domain..."
aws cognito-idp create-user-pool-domain \
  --region $AWS_REGION \
  --domain $COGNITO_DOMAIN_PREFIX \
  --user-pool-id $USER_POOL_ID >/dev/null

echo "Cognito domain created: https://${COGNITO_DOMAIN_PREFIX}.auth.${AWS_REGION}.amazoncognito.com"

echo "Creating user $USERNAME..."
aws cognito-idp admin-create-user \
  --region $AWS_REGION \
  --user-pool-id $USER_POOL_ID \
  --username $USERNAME \
  --user-attributes Name=email,Value=$USERNAME Name=email_verified,Value=true \
  --message-action SUPPRESS

echo "Setting permanent password..."
aws cognito-idp admin-set-user-password \
  --region $AWS_REGION \
  --user-pool-id $USER_POOL_ID \
  --username $USERNAME \
  --password "$TEMP_PASSWORD" \
  --permanent

echo "User $USERNAME created with permanent password."

# Write environment variables to .env file
ENV_FILE=".env"
echo "Writing environment variables to $ENV_FILE..."

{
  echo "# Cognito configuration generated on $(date)"
  echo "AWS_REGION=$AWS_REGION"
  echo "USER_POOL_ID=$USER_POOL_ID"
  echo "APP_CLIENT_ID=$APP_CLIENT_ID"
  echo "COGNITO_DOMAIN=https://${COGNITO_DOMAIN_PREFIX}.auth.${AWS_REGION}.amazoncognito.com"
  echo "COGNITO_TEST_USER=$USERNAME"
  echo "COGNITO_TEST_PASSWORD=$TEMP_PASSWORD"
} >> $ENV_FILE

echo ".env file now contains:"
cat $ENV_FILE

docker compose up -d