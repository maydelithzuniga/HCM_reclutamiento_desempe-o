import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  DeleteSuppressedDestinationRequest,
  DeleteSuppressedDestinationResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface DeleteSuppressedDestinationCommandInput extends DeleteSuppressedDestinationRequest {}
export interface DeleteSuppressedDestinationCommandOutput
  extends DeleteSuppressedDestinationResponse, __MetadataBearer {}
declare const DeleteSuppressedDestinationCommand_base: {
  new (
    input: DeleteSuppressedDestinationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteSuppressedDestinationCommandInput,
    DeleteSuppressedDestinationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteSuppressedDestinationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteSuppressedDestinationCommandInput,
    DeleteSuppressedDestinationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteSuppressedDestinationCommand extends DeleteSuppressedDestinationCommand_base {
  protected static __types: {
    api: {
      input: DeleteSuppressedDestinationRequest;
      output: {};
    };
    sdk: {
      input: DeleteSuppressedDestinationCommandInput;
      output: DeleteSuppressedDestinationCommandOutput;
    };
  };
}
