import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetSuppressedDestinationRequest,
  GetSuppressedDestinationResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetSuppressedDestinationCommandInput extends GetSuppressedDestinationRequest {}
export interface GetSuppressedDestinationCommandOutput
  extends GetSuppressedDestinationResponse, __MetadataBearer {}
declare const GetSuppressedDestinationCommand_base: {
  new (
    input: GetSuppressedDestinationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetSuppressedDestinationCommandInput,
    GetSuppressedDestinationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetSuppressedDestinationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetSuppressedDestinationCommandInput,
    GetSuppressedDestinationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetSuppressedDestinationCommand extends GetSuppressedDestinationCommand_base {
  protected static __types: {
    api: {
      input: GetSuppressedDestinationRequest;
      output: GetSuppressedDestinationResponse;
    };
    sdk: {
      input: GetSuppressedDestinationCommandInput;
      output: GetSuppressedDestinationCommandOutput;
    };
  };
}
