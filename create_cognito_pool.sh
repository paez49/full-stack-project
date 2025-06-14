#!/bin/bash

set -e

# Configura estos valores:
AWS_REGION="us-east-1"
USER_POOL_NAME="HospitalUsers"
APP_CLIENT_NAME="HospitalAPI"
USERNAME="admin@hospital.com"
TEMP_PASSWORD="Admin123!"
COGNITO_DOMAIN_PREFIX="my-fastapi-auth-demo-$(date +%s)" # debe ser único

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
  echo "AWS_REGION=$AWS_REGION"
  echo "USER_POOL_ID=$USER_POOL_ID"
  echo "APP_CLIENT_ID=$APP_CLIENT_ID"
  echo "COGNITO_DOMAIN=https://${COGNITO_DOMAIN_PREFIX}.auth.${AWS_REGION}.amazoncognito.com"
  echo "COGNITO_TEST_USER=$USERNAME"
  echo "COGNITO_TEST_PASSWORD=$TEMP_PASSWORD"
} >> $ENV_FILE

echo ".env file now contains:"
cat $ENV_FILE

