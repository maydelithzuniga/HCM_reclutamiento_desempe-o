import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetDedicatedIpsRequest, GetDedicatedIpsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetDedicatedIpsCommandInput extends GetDedicatedIpsRequest {}
export interface GetDedicatedIpsCommandOutput extends GetDedicatedIpsResponse, __MetadataBearer {}
declare const GetDedicatedIpsCommand_base: {
  new (
    input: GetDedicatedIpsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDedicatedIpsCommandInput,
    GetDedicatedIpsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [GetDedicatedIpsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    GetDedicatedIpsCommandInput,
    GetDedicatedIpsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetDedicatedIpsCommand extends GetDedicatedIpsCommand_base {
  protected static __types: {
    api: {
      input: GetDedicatedIpsRequest;
      output: GetDedicatedIpsResponse;
    };
    sdk: {
      input: GetDedicatedIpsCommandInput;
      output: GetDedicatedIpsCommandOutput;
    };
  };
}
