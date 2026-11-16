import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { UpdateConfigurationSetRequest, UpdateConfigurationSetResponse } from "../models/models_1";
export { __MetadataBearer };
export interface UpdateConfigurationSetCommandInput extends UpdateConfigurationSetRequest {}
export interface UpdateConfigurationSetCommandOutput
  extends UpdateConfigurationSetResponse, __MetadataBearer {}
declare const UpdateConfigurationSetCommand_base: {
  new (
    input: UpdateConfigurationSetCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateConfigurationSetCommandInput,
    UpdateConfigurationSetCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateConfigurationSetCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateConfigurationSetCommandInput,
    UpdateConfigurationSetCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateConfigurationSetCommand extends UpdateConfigurationSetCommand_base {
  protected static __types: {
    api: {
      input: UpdateConfigurationSetRequest;
      output: {};
    };
    sdk: {
      input: UpdateConfigurationSetCommandInput;
      output: UpdateConfigurationSetCommandOutput;
    };
  };
}
