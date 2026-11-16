import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetDedicatedIpPoolRequest, GetDedicatedIpPoolResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetDedicatedIpPoolCommandInput extends GetDedicatedIpPoolRequest {}
export interface GetDedicatedIpPoolCommandOutput
  extends GetDedicatedIpPoolResponse, __MetadataBearer {}
declare const GetDedicatedIpPoolCommand_base: {
  new (
    input: GetDedicatedIpPoolCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDedicatedIpPoolCommandInput,
    GetDedicatedIpPoolCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetDedicatedIpPoolCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDedicatedIpPoolCommandInput,
    GetDedicatedIpPoolCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetDedicatedIpPoolCommand extends GetDedicatedIpPoolCommand_base {
  protected static __types: {
    api: {
      input: GetDedicatedIpPoolRequest;
      output: GetDedicatedIpPoolResponse;
    };
    sdk: {
      input: GetDedicatedIpPoolCommandInput;
      output: GetDedicatedIpPoolCommandOutput;
    };
  };
}
