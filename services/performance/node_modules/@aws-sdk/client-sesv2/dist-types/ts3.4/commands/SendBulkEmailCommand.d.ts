import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { SendBulkEmailRequest, SendBulkEmailResponse } from "../models/models_1";
export { __MetadataBearer };
export interface SendBulkEmailCommandInput extends SendBulkEmailRequest {}
export interface SendBulkEmailCommandOutput extends SendBulkEmailResponse, __MetadataBearer {}
declare const SendBulkEmailCommand_base: {
  new (
    input: SendBulkEmailCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    SendBulkEmailCommandInput,
    SendBulkEmailCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: SendBulkEmailCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    SendBulkEmailCommandInput,
    SendBulkEmailCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class SendBulkEmailCommand extends SendBulkEmailCommand_base {
  protected static __types: {
    api: {
      input: SendBulkEmailRequest;
      output: SendBulkEmailResponse;
    };
    sdk: {
      input: SendBulkEmailCommandInput;
      output: SendBulkEmailCommandOutput;
    };
  };
}
