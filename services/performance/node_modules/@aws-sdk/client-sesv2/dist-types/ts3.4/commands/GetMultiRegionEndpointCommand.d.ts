import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetMultiRegionEndpointRequest, GetMultiRegionEndpointResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetMultiRegionEndpointCommandInput extends GetMultiRegionEndpointRequest {}
export interface GetMultiRegionEndpointCommandOutput
  extends GetMultiRegionEndpointResponse, __MetadataBearer {}
declare const GetMultiRegionEndpointCommand_base: {
  new (
    input: GetMultiRegionEndpointCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetMultiRegionEndpointCommandInput,
    GetMultiRegionEndpointCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetMultiRegionEndpointCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetMultiRegionEndpointCommandInput,
    GetMultiRegionEndpointCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetMultiRegionEndpointCommand extends GetMultiRegionEndpointCommand_base {
  protected static __types: {
    api: {
      input: GetMultiRegionEndpointRequest;
      output: GetMultiRegionEndpointResponse;
    };
    sdk: {
      input: GetMultiRegionEndpointCommandInput;
      output: GetMultiRegionEndpointCommandOutput;
    };
  };
}
