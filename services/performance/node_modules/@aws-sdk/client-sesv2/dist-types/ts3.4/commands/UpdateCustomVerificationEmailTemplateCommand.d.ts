import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  UpdateCustomVerificationEmailTemplateRequest,
  UpdateCustomVerificationEmailTemplateResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface UpdateCustomVerificationEmailTemplateCommandInput extends UpdateCustomVerificationEmailTemplateRequest {}
export interface UpdateCustomVerificationEmailTemplateCommandOutput
  extends UpdateCustomVerificationEmailTemplateResponse, __MetadataBearer {}
declare const UpdateCustomVerificationEmailTemplateCommand_base: {
  new (
    input: UpdateCustomVerificationEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateCustomVerificationEmailTemplateCommandInput,
    UpdateCustomVerificationEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateCustomVerificationEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateCustomVerificationEmailTemplateCommandInput,
    UpdateCustomVerificationEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateCustomVerificationEmailTemplateCommand extends UpdateCustomVerificationEmailTemplateCommand_base {
  protected static __types: {
    api: {
      input: UpdateCustomVerificationEmailTemplateRequest;
      output: {};
    };
    sdk: {
      input: UpdateCustomVerificationEmailTemplateCommandInput;
      output: UpdateCustomVerificationEmailTemplateCommandOutput;
    };
  };
}
