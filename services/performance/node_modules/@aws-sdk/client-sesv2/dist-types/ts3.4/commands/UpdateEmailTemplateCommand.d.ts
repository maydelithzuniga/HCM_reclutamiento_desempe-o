import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { UpdateEmailTemplateRequest, UpdateEmailTemplateResponse } from "../models/models_1";
export { __MetadataBearer };
export interface UpdateEmailTemplateCommandInput extends UpdateEmailTemplateRequest {}
export interface UpdateEmailTemplateCommandOutput
  extends UpdateEmailTemplateResponse, __MetadataBearer {}
declare const UpdateEmailTemplateCommand_base: {
  new (
    input: UpdateEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateEmailTemplateCommandInput,
    UpdateEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateEmailTemplateCommandInput,
    UpdateEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateEmailTemplateCommand extends UpdateEmailTemplateCommand_base {
  protected static __types: {
    api: {
      input: UpdateEmailTemplateRequest;
      output: {};
    };
    sdk: {
      input: UpdateEmailTemplateCommandInput;
      output: UpdateEmailTemplateCommandOutput;
    };
  };
}
