import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateEmailTemplateRequest, CreateEmailTemplateResponse } from "../models/models_0";
export { __MetadataBearer };
export interface CreateEmailTemplateCommandInput extends CreateEmailTemplateRequest {}
export interface CreateEmailTemplateCommandOutput
  extends CreateEmailTemplateResponse, __MetadataBearer {}
declare const CreateEmailTemplateCommand_base: {
  new (
    input: CreateEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateEmailTemplateCommandInput,
    CreateEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateEmailTemplateCommandInput,
    CreateEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateEmailTemplateCommand extends CreateEmailTemplateCommand_base {
  protected static __types: {
    api: {
      input: CreateEmailTemplateRequest;
      output: {};
    };
    sdk: {
      input: CreateEmailTemplateCommandInput;
      output: CreateEmailTemplateCommandOutput;
    };
  };
}
