import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetEmailTemplateRequest, GetEmailTemplateResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetEmailTemplateCommandInput extends GetEmailTemplateRequest {}
export interface GetEmailTemplateCommandOutput extends GetEmailTemplateResponse, __MetadataBearer {}
declare const GetEmailTemplateCommand_base: {
  new (
    input: GetEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetEmailTemplateCommandInput,
    GetEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetEmailTemplateCommandInput,
    GetEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetEmailTemplateCommand extends GetEmailTemplateCommand_base {
  protected static __types: {
    api: {
      input: GetEmailTemplateRequest;
      output: GetEmailTemplateResponse;
    };
    sdk: {
      input: GetEmailTemplateCommandInput;
      output: GetEmailTemplateCommandOutput;
    };
  };
}
