import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListContactsRequest, ListContactsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListContactsCommandInput extends ListContactsRequest {}
export interface ListContactsCommandOutput extends ListContactsResponse, __MetadataBearer {}
declare const ListContactsCommand_base: {
  new (
    input: ListContactsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListContactsCommandInput,
    ListContactsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListContactsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListContactsCommandInput,
    ListContactsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListContactsCommand extends ListContactsCommand_base {
  protected static __types: {
    api: {
      input: ListContactsRequest;
      output: ListContactsResponse;
    };
    sdk: {
      input: ListContactsCommandInput;
      output: ListContactsCommandOutput;
    };
  };
}
