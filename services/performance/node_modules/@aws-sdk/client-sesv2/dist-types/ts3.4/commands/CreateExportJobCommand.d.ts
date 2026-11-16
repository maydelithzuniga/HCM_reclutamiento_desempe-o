import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateExportJobRequest, CreateExportJobResponse } from "../models/models_0";
export { __MetadataBearer };
export interface CreateExportJobCommandInput extends CreateExportJobRequest {}
export interface CreateExportJobCommandOutput extends CreateExportJobResponse, __MetadataBearer {}
declare const CreateExportJobCommand_base: {
  new (
    input: CreateExportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateExportJobCommandInput,
    CreateExportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateExportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateExportJobCommandInput,
    CreateExportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateExportJobCommand extends CreateExportJobCommand_base {
  protected static __types: {
    api: {
      input: CreateExportJobRequest;
      output: CreateExportJobResponse;
    };
    sdk: {
      input: CreateExportJobCommandInput;
      output: CreateExportJobCommandOutput;
    };
  };
}
