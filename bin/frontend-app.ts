import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontend-app-stack";
const app = new cdk.App();


new FrontendStack(app, "S3Website", {});
