import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteEmailTemplateRequest, DeleteEmailTemplateResponse } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteEmailTemplateCommandInput extends DeleteEmailTemplateRequest {}
export interface DeleteEmailTemplateCommandOutput
  extends DeleteEmailTemplateResponse, __MetadataBearer {}
declare const DeleteEmailTemplateCommand_base: {
  new (
    input: DeleteEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteEmailTemplateCommandInput,
    DeleteEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteEmailTemplateCommandInput,
    DeleteEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteEmailTemplateCommand extends DeleteEmailTemplateCommand_base {
  protected static __types: {
    api: {
      input: DeleteEmailTemplateRequest;
      output: {};
    };
    sdk: {
      input: DeleteEmailTemplateCommandInput;
      output: DeleteEmailTemplateCommandOutput;
    };
  };
}
