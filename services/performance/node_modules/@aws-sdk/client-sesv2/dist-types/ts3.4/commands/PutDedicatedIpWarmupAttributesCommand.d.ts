import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutDedicatedIpWarmupAttributesRequest,
  PutDedicatedIpWarmupAttributesResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutDedicatedIpWarmupAttributesCommandInput extends PutDedicatedIpWarmupAttributesRequest {}
export interface PutDedicatedIpWarmupAttributesCommandOutput
  extends PutDedicatedIpWarmupAttributesResponse, __MetadataBearer {}
declare const PutDedicatedIpWarmupAttributesCommand_base: {
  new (
    input: PutDedicatedIpWarmupAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutDedicatedIpWarmupAttributesCommandInput,
    PutDedicatedIpWarmupAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutDedicatedIpWarmupAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutDedicatedIpWarmupAttributesCommandInput,
    PutDedicatedIpWarmupAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutDedicatedIpWarmupAttributesCommand extends PutDedicatedIpWarmupAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutDedicatedIpWarmupAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutDedicatedIpWarmupAttributesCommandInput;
      output: PutDedicatedIpWarmupAttributesCommandOutput;
    };
  };
}
