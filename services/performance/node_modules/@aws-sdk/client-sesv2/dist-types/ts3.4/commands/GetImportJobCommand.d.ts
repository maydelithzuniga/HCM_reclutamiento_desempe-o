import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetImportJobRequest, GetImportJobResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetImportJobCommandInput extends GetImportJobRequest {}
export interface GetImportJobCommandOutput extends GetImportJobResponse, __MetadataBearer {}
declare const GetImportJobCommand_base: {
  new (
    input: GetImportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetImportJobCommandInput,
    GetImportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetImportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetImportJobCommandInput,
    GetImportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetImportJobCommand extends GetImportJobCommand_base {
  protected static __types: {
    api: {
      input: GetImportJobRequest;
      output: GetImportJobResponse;
    };
    sdk: {
      input: GetImportJobCommandInput;
      output: GetImportJobCommandOutput;
    };
  };
}
