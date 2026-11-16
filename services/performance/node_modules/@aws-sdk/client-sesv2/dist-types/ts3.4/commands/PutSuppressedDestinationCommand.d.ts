import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutSuppressedDestinationRequest,
  PutSuppressedDestinationResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutSuppressedDestinationCommandInput extends PutSuppressedDestinationRequest {}
export interface PutSuppressedDestinationCommandOutput
  extends PutSuppressedDestinationResponse, __MetadataBearer {}
declare const PutSuppressedDestinationCommand_base: {
  new (
    input: PutSuppressedDestinationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutSuppressedDestinationCommandInput,
    PutSuppressedDestinationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutSuppressedDestinationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutSuppressedDestinationCommandInput,
    PutSuppressedDestinationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutSuppressedDestinationCommand extends PutSuppressedDestinationCommand_base {
  protected static __types: {
    api: {
      input: PutSuppressedDestinationRequest;
      output: {};
    };
    sdk: {
      input: PutSuppressedDestinationCommandInput;
      output: PutSuppressedDestinationCommandOutput;
    };
  };
}
