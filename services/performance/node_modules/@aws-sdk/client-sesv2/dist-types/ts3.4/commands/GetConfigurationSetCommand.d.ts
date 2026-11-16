import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetConfigurationSetRequest, GetConfigurationSetResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetConfigurationSetCommandInput extends GetConfigurationSetRequest {}
export interface GetConfigurationSetCommandOutput
  extends GetConfigurationSetResponse, __MetadataBearer {}
declare const GetConfigurationSetCommand_base: {
  new (
    input: GetConfigurationSetCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetConfigurationSetCommandInput,
    GetConfigurationSetCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetConfigurationSetCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetConfigurationSetCommandInput,
    GetConfigurationSetCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetConfigurationSetCommand extends GetConfigurationSetCommand_base {
  protected static __types: {
    api: {
      input: GetConfigurationSetRequest;
      output: GetConfigurationSetResponse;
    };
    sdk: {
      input: GetConfigurationSetCommandInput;
      output: GetConfigurationSetCommandOutput;
    };
  };
}
