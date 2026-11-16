import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  DeleteCustomVerificationEmailTemplateRequest,
  DeleteCustomVerificationEmailTemplateResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface DeleteCustomVerificationEmailTemplateCommandInput extends DeleteCustomVerificationEmailTemplateRequest {}
export interface DeleteCustomVerificationEmailTemplateCommandOutput
  extends DeleteCustomVerificationEmailTemplateResponse, __MetadataBearer {}
declare const DeleteCustomVerificationEmailTemplateCommand_base: {
  new (
    input: DeleteCustomVerificationEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteCustomVerificationEmailTemplateCommandInput,
    DeleteCustomVerificationEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteCustomVerificationEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteCustomVerificationEmailTemplateCommandInput,
    DeleteCustomVerificationEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteCustomVerificationEmailTemplateCommand extends DeleteCustomVerificationEmailTemplateCommand_base {
  protected static __types: {
    api: {
      input: DeleteCustomVerificationEmailTemplateRequest;
      output: {};
    };
    sdk: {
      input: DeleteCustomVerificationEmailTemplateCommandInput;
      output: DeleteCustomVerificationEmailTemplateCommandOutput;
    };
  };
}
