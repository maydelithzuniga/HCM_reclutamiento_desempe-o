import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetDedicatedIpRequest, GetDedicatedIpResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetDedicatedIpCommandInput extends GetDedicatedIpRequest {}
export interface GetDedicatedIpCommandOutput extends GetDedicatedIpResponse, __MetadataBearer {}
declare const GetDedicatedIpCommand_base: {
  new (
    input: GetDedicatedIpCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDedicatedIpCommandInput,
    GetDedicatedIpCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetDedicatedIpCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDedicatedIpCommandInput,
    GetDedicatedIpCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetDedicatedIpCommand extends GetDedicatedIpCommand_base {
  protected static __types: {
    api: {
      input: GetDedicatedIpRequest;
      output: GetDedicatedIpResponse;
    };
    sdk: {
      input: GetDedicatedIpCommandInput;
      output: GetDedicatedIpCommandOutput;
    };
  };
}
