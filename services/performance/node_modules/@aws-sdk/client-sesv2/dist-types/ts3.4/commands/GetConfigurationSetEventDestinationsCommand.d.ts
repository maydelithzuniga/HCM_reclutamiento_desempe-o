import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetConfigurationSetEventDestinationsRequest,
  GetConfigurationSetEventDestinationsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetConfigurationSetEventDestinationsCommandInput extends GetConfigurationSetEventDestinationsRequest {}
export interface GetConfigurationSetEventDestinationsCommandOutput
  extends GetConfigurationSetEventDestinationsResponse, __MetadataBearer {}
declare const GetConfigurationSetEventDestinationsCommand_base: {
  new (
    input: GetConfigurationSetEventDestinationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetConfigurationSetEventDestinationsCommandInput,
    GetConfigurationSetEventDestinationsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetConfigurationSetEventDestinationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetConfigurationSetEventDestinationsCommandInput,
    GetConfigurationSetEventDestinationsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetConfigurationSetEventDestinationsCommand extends GetConfigurationSetEventDestinationsCommand_base {
  protected static __types: {
    api: {
      input: GetConfigurationSetEventDestinationsRequest;
      output: GetConfigurationSetEventDestinationsResponse;
    };
    sdk: {
      input: GetConfigurationSetEventDestinationsCommandInput;
      output: GetConfigurationSetEventDestinationsCommandOutput;
    };
  };
}
