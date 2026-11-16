import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListEmailTemplatesRequest, ListEmailTemplatesResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListEmailTemplatesCommandInput extends ListEmailTemplatesRequest {}
export interface ListEmailTemplatesCommandOutput
  extends ListEmailTemplatesResponse, __MetadataBearer {}
declare const ListEmailTemplatesCommand_base: {
  new (
    input: ListEmailTemplatesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListEmailTemplatesCommandInput,
    ListEmailTemplatesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListEmailTemplatesCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListEmailTemplatesCommandInput,
    ListEmailTemplatesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListEmailTemplatesCommand extends ListEmailTemplatesCommand_base {
  protected static __types: {
    api: {
      input: ListEmailTemplatesRequest;
      output: ListEmailTemplatesResponse;
    };
    sdk: {
      input: ListEmailTemplatesCommandInput;
      output: ListEmailTemplatesCommandOutput;
    };
  };
}
