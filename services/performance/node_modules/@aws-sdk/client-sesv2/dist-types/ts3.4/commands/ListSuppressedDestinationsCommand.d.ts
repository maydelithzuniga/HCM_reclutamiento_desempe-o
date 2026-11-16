import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListSuppressedDestinationsRequest,
  ListSuppressedDestinationsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface ListSuppressedDestinationsCommandInput extends ListSuppressedDestinationsRequest {}
export interface ListSuppressedDestinationsCommandOutput
  extends ListSuppressedDestinationsResponse, __MetadataBearer {}
declare const ListSuppressedDestinationsCommand_base: {
  new (
    input: ListSuppressedDestinationsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListSuppressedDestinationsCommandInput,
    ListSuppressedDestinationsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListSuppressedDestinationsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListSuppressedDestinationsCommandInput,
    ListSuppressedDestinationsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListSuppressedDestinationsCommand extends ListSuppressedDestinationsCommand_base {
  protected static __types: {
    api: {
      input: ListSuppressedDestinationsRequest;
      output: ListSuppressedDestinationsResponse;
    };
    sdk: {
      input: ListSuppressedDestinationsCommandInput;
      output: ListSuppressedDestinationsCommandOutput;
    };
  };
}
