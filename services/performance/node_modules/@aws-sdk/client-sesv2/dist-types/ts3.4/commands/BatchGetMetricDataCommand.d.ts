import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { BatchGetMetricDataRequest, BatchGetMetricDataResponse } from "../models/models_0";
export { __MetadataBearer };
export interface BatchGetMetricDataCommandInput extends BatchGetMetricDataRequest {}
export interface BatchGetMetricDataCommandOutput
  extends BatchGetMetricDataResponse, __MetadataBearer {}
declare const BatchGetMetricDataCommand_base: {
  new (
    input: BatchGetMetricDataCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    BatchGetMetricDataCommandInput,
    BatchGetMetricDataCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: BatchGetMetricDataCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    BatchGetMetricDataCommandInput,
    BatchGetMetricDataCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class BatchGetMetricDataCommand extends BatchGetMetricDataCommand_base {
  protected static __types: {
    api: {
      input: BatchGetMetricDataRequest;
      output: BatchGetMetricDataResponse;
    };
    sdk: {
      input: BatchGetMetricDataCommandInput;
      output: BatchGetMetricDataCommandOutput;
    };
  };
}
