import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutDedicatedIpPoolScalingAttributesRequest,
  PutDedicatedIpPoolScalingAttributesResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutDedicatedIpPoolScalingAttributesCommandInput extends PutDedicatedIpPoolScalingAttributesRequest {}
export interface PutDedicatedIpPoolScalingAttributesCommandOutput
  extends PutDedicatedIpPoolScalingAttributesResponse, __MetadataBearer {}
declare const PutDedicatedIpPoolScalingAttributesCommand_base: {
  new (
    input: PutDedicatedIpPoolScalingAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutDedicatedIpPoolScalingAttributesCommandInput,
    PutDedicatedIpPoolScalingAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutDedicatedIpPoolScalingAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutDedicatedIpPoolScalingAttributesCommandInput,
    PutDedicatedIpPoolScalingAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutDedicatedIpPoolScalingAttributesCommand extends PutDedicatedIpPoolScalingAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutDedicatedIpPoolScalingAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutDedicatedIpPoolScalingAttributesCommandInput;
      output: PutDedicatedIpPoolScalingAttributesCommandOutput;
    };
  };
}
