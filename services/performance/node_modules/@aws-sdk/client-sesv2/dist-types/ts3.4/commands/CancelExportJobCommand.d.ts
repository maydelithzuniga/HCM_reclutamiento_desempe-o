import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CancelExportJobRequest, CancelExportJobResponse } from "../models/models_0";
export { __MetadataBearer };
export interface CancelExportJobCommandInput extends CancelExportJobRequest {}
export interface CancelExportJobCommandOutput extends CancelExportJobResponse, __MetadataBearer {}
declare const CancelExportJobCommand_base: {
  new (
    input: CancelExportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CancelExportJobCommandInput,
    CancelExportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CancelExportJobCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CancelExportJobCommandInput,
    CancelExportJobCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CancelExportJobCommand extends CancelExportJobCommand_base {
  protected static __types: {
    api: {
      input: CancelExportJobRequest;
      output: {};
    };
    sdk: {
      input: CancelExportJobCommandInput;
      output: CancelExportJobCommandOutput;
    };
  };
}
