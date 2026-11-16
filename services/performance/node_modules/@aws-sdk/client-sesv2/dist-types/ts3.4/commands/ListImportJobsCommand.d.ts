import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListImportJobsRequest, ListImportJobsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListImportJobsCommandInput extends ListImportJobsRequest {}
export interface ListImportJobsCommandOutput extends ListImportJobsResponse, __MetadataBearer {}
declare const ListImportJobsCommand_base: {
  new (
    input: ListImportJobsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListImportJobsCommandInput,
    ListImportJobsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListImportJobsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListImportJobsCommandInput,
    ListImportJobsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListImportJobsCommand extends ListImportJobsCommand_base {
  protected static __types: {
    api: {
      input: ListImportJobsRequest;
      output: ListImportJobsResponse;
    };
    sdk: {
      input: ListImportJobsCommandInput;
      output: ListImportJobsCommandOutput;
    };
  };
}
