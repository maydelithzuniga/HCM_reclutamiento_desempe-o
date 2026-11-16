import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetEmailAddressInsightsRequest,
  GetEmailAddressInsightsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetEmailAddressInsightsCommandInput extends GetEmailAddressInsightsRequest {}
export interface GetEmailAddressInsightsCommandOutput
  extends GetEmailAddressInsightsResponse, __MetadataBearer {}
declare const GetEmailAddressInsightsCommand_base: {
  new (
    input: GetEmailAddressInsightsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetEmailAddressInsightsCommandInput,
    GetEmailAddressInsightsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetEmailAddressInsightsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetEmailAddressInsightsCommandInput,
    GetEmailAddressInsightsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetEmailAddressInsightsCommand extends GetEmailAddressInsightsCommand_base {
  protected static __types: {
    api: {
      input: GetEmailAddressInsightsRequest;
      output: GetEmailAddressInsightsResponse;
    };
    sdk: {
      input: GetEmailAddressInsightsCommandInput;
      output: GetEmailAddressInsightsCommandOutput;
    };
  };
}
