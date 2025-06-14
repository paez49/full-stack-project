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
ENV_FILE=".env"
SG_NAME="health-rds-sg"
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
    echo "# RDS credentials generated on $(date)"
    echo "RDS_ENDPOINT=$ENDPOINT"
    echo "RDS_DB_NAME=$DB_NAME"
    echo "RDS_USERNAME=$DB_USER"
    echo "RDS_PASSWORD=$DB_PASSWORD"
    echo "RDS_SECURITY_GROUP_ID=$SG_ID"
} >> $ENV_FILE

echo "PostgreSQL RDS instance created and credentials saved to $ENV_FILE"
