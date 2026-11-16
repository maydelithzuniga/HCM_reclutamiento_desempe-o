import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListContactListsRequest, ListContactListsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListContactListsCommandInput extends ListContactListsRequest {}
export interface ListContactListsCommandOutput extends ListContactListsResponse, __MetadataBearer {}
declare const ListContactListsCommand_base: {
  new (
    input: ListContactListsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListContactListsCommandInput,
    ListContactListsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListContactListsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListContactListsCommandInput,
    ListContactListsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListContactListsCommand extends ListContactListsCommand_base {
  protected static __types: {
    api: {
      input: ListContactListsRequest;
      output: ListContactListsResponse;
    };
    sdk: {
      input: ListContactListsCommandInput;
      output: ListContactListsCommandOutput;
    };
  };
}
