import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
import { CloudFrontWebDistribution } from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });
const oai = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    siteBucket.grantRead(oai);
    const distribution = new CloudFrontWebDistribution(
      this,
      "ReactDeploymentDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: oai,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );
    new CfnOutput(this, "CloudFrontDistributionDomainName", {
      value: distribution.distributionDomainName,
      description: "CloudFront Distribution Domain Name",
    });
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./dist")],
      destinationBucket: siteBucket,
    });
    new CfnOutput(this, "WebsiteURL", {
      value: siteBucket.bucketWebsiteUrl,
    });
  }
}