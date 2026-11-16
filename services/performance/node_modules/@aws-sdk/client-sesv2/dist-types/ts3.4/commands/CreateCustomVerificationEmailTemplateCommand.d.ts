import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CreateCustomVerificationEmailTemplateRequest,
  CreateCustomVerificationEmailTemplateResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface CreateCustomVerificationEmailTemplateCommandInput extends CreateCustomVerificationEmailTemplateRequest {}
export interface CreateCustomVerificationEmailTemplateCommandOutput
  extends CreateCustomVerificationEmailTemplateResponse, __MetadataBearer {}
declare const CreateCustomVerificationEmailTemplateCommand_base: {
  new (
    input: CreateCustomVerificationEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateCustomVerificationEmailTemplateCommandInput,
    CreateCustomVerificationEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateCustomVerificationEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateCustomVerificationEmailTemplateCommandInput,
    CreateCustomVerificationEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateCustomVerificationEmailTemplateCommand extends CreateCustomVerificationEmailTemplateCommand_base {
  protected static __types: {
    api: {
      input: CreateCustomVerificationEmailTemplateRequest;
      output: {};
    };
    sdk: {
      input: CreateCustomVerificationEmailTemplateCommandInput;
      output: CreateCustomVerificationEmailTemplateCommandOutput;
    };
  };
}
