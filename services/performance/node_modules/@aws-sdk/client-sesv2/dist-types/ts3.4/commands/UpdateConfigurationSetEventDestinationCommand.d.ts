import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  UpdateConfigurationSetEventDestinationRequest,
  UpdateConfigurationSetEventDestinationResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface UpdateConfigurationSetEventDestinationCommandInput extends UpdateConfigurationSetEventDestinationRequest {}
export interface UpdateConfigurationSetEventDestinationCommandOutput
  extends UpdateConfigurationSetEventDestinationResponse, __MetadataBearer {}
declare const UpdateConfigurationSetEventDestinationCommand_base: {
  new (
    input: UpdateConfigurationSetEventDestinationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateConfigurationSetEventDestinationCommandInput,
    UpdateConfigurationSetEventDestinationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateConfigurationSetEventDestinationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateConfigurationSetEventDestinationCommandInput,
    UpdateConfigurationSetEventDestinationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateConfigurationSetEventDestinationCommand extends UpdateConfigurationSetEventDestinationCommand_base {
  protected static __types: {
    api: {
      input: UpdateConfigurationSetEventDestinationRequest;
      output: {};
    };
    sdk: {
      input: UpdateConfigurationSetEventDestinationCommandInput;
      output: UpdateConfigurationSetEventDestinationCommandOutput;
    };
  };
}
