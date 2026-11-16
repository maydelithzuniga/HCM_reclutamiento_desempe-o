import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetExportJobRequest, GetExportJobResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetExportJobCommandInput extends GetExportJobRequest {}
export interface GetExportJobCommandOutput extends GetExportJobResponse, __MetadataBearer {}
declare const GetExportJobCommand_base: {
  new (
    input: GetExportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetExportJobCommandInput,
    GetExportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetExportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetExportJobCommandInput,
    GetExportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetExportJobCommand extends GetExportJobCommand_base {
  protected static __types: {
    api: {
      input: GetExportJobRequest;
      output: GetExportJobResponse;
    };
    sdk: {
      input: GetExportJobCommandInput;
      output: GetExportJobCommandOutput;
    };
  };
}
