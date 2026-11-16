import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetBlacklistReportsRequest, GetBlacklistReportsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetBlacklistReportsCommandInput extends GetBlacklistReportsRequest {}
export interface GetBlacklistReportsCommandOutput
  extends GetBlacklistReportsResponse, __MetadataBearer {}
declare const GetBlacklistReportsCommand_base: {
  new (
    input: GetBlacklistReportsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBlacklistReportsCommandInput,
    GetBlacklistReportsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetBlacklistReportsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetBlacklistReportsCommandInput,
    GetBlacklistReportsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetBlacklistReportsCommand extends GetBlacklistReportsCommand_base {
  protected static __types: {
    api: {
      input: GetBlacklistReportsRequest;
      output: GetBlacklistReportsResponse;
    };
    sdk: {
      input: GetBlacklistReportsCommandInput;
      output: GetBlacklistReportsCommandOutput;
    };
  };
}
