import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListExportJobsRequest, ListExportJobsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListExportJobsCommandInput extends ListExportJobsRequest {}
export interface ListExportJobsCommandOutput extends ListExportJobsResponse, __MetadataBearer {}
declare const ListExportJobsCommand_base: {
  new (
    input: ListExportJobsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListExportJobsCommandInput,
    ListExportJobsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListExportJobsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListExportJobsCommandInput,
    ListExportJobsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListExportJobsCommand extends ListExportJobsCommand_base {
  protected static __types: {
    api: {
      input: ListExportJobsRequest;
      output: ListExportJobsResponse;
    };
    sdk: {
      input: ListExportJobsCommandInput;
      output: ListExportJobsCommandOutput;
    };
  };
}
