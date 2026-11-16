import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateImportJobRequest, CreateImportJobResponse } from "../models/models_0";
export { __MetadataBearer };
export interface CreateImportJobCommandInput extends CreateImportJobRequest {}
export interface CreateImportJobCommandOutput extends CreateImportJobResponse, __MetadataBearer {}
declare const CreateImportJobCommand_base: {
  new (
    input: CreateImportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateImportJobCommandInput,
    CreateImportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateImportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateImportJobCommandInput,
    CreateImportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateImportJobCommand extends CreateImportJobCommand_base {
  protected static __types: {
    api: {
      input: CreateImportJobRequest;
      output: CreateImportJobResponse;
    };
    sdk: {
      input: CreateImportJobCommandInput;
      output: CreateImportJobCommandOutput;
    };
  };
}
