import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutAccountDedicatedIpWarmupAttributesRequest,
  PutAccountDedicatedIpWarmupAttributesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutAccountDedicatedIpWarmupAttributesCommandInput extends PutAccountDedicatedIpWarmupAttributesRequest {}
export interface PutAccountDedicatedIpWarmupAttributesCommandOutput
  extends PutAccountDedicatedIpWarmupAttributesResponse, __MetadataBearer {}
declare const PutAccountDedicatedIpWarmupAttributesCommand_base: {
  new (
    input: PutAccountDedicatedIpWarmupAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutAccountDedicatedIpWarmupAttributesCommandInput,
    PutAccountDedicatedIpWarmupAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [PutAccountDedicatedIpWarmupAttributesCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    PutAccountDedicatedIpWarmupAttributesCommandInput,
    PutAccountDedicatedIpWarmupAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutAccountDedicatedIpWarmupAttributesCommand extends PutAccountDedicatedIpWarmupAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutAccountDedicatedIpWarmupAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutAccountDedicatedIpWarmupAttributesCommandInput;
      output: PutAccountDedicatedIpWarmupAttributesCommandOutput;
    };
  };
}
