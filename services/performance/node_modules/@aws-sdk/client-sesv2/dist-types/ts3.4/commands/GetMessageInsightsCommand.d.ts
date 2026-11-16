import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetMessageInsightsRequest, GetMessageInsightsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetMessageInsightsCommandInput extends GetMessageInsightsRequest {}
export interface GetMessageInsightsCommandOutput
  extends GetMessageInsightsResponse, __MetadataBearer {}
declare const GetMessageInsightsCommand_base: {
  new (
    input: GetMessageInsightsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetMessageInsightsCommandInput,
    GetMessageInsightsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetMessageInsightsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetMessageInsightsCommandInput,
    GetMessageInsightsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetMessageInsightsCommand extends GetMessageInsightsCommand_base {
  protected static __types: {
    api: {
      input: GetMessageInsightsRequest;
      output: GetMessageInsightsResponse;
    };
    sdk: {
      input: GetMessageInsightsCommandInput;
      output: GetMessageInsightsCommandOutput;
    };
  };
}
