import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutDedicatedIpInPoolRequest, PutDedicatedIpInPoolResponse } from "../models/models_1";
export { __MetadataBearer };
export interface PutDedicatedIpInPoolCommandInput extends PutDedicatedIpInPoolRequest {}
export interface PutDedicatedIpInPoolCommandOutput
  extends PutDedicatedIpInPoolResponse, __MetadataBearer {}
declare const PutDedicatedIpInPoolCommand_base: {
  new (
    input: PutDedicatedIpInPoolCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutDedicatedIpInPoolCommandInput,
    PutDedicatedIpInPoolCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutDedicatedIpInPoolCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutDedicatedIpInPoolCommandInput,
    PutDedicatedIpInPoolCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutDedicatedIpInPoolCommand extends PutDedicatedIpInPoolCommand_base {
  protected static __types: {
    api: {
      input: PutDedicatedIpInPoolRequest;
      output: {};
    };
    sdk: {
      input: PutDedicatedIpInPoolCommandInput;
      output: PutDedicatedIpInPoolCommandOutput;
    };
  };
}
