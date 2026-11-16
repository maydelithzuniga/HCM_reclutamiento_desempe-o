import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetDeliverabilityTestReportRequest,
  GetDeliverabilityTestReportResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetDeliverabilityTestReportCommandInput extends GetDeliverabilityTestReportRequest {}
export interface GetDeliverabilityTestReportCommandOutput
  extends GetDeliverabilityTestReportResponse, __MetadataBearer {}
declare const GetDeliverabilityTestReportCommand_base: {
  new (
    input: GetDeliverabilityTestReportCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDeliverabilityTestReportCommandInput,
    GetDeliverabilityTestReportCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetDeliverabilityTestReportCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDeliverabilityTestReportCommandInput,
    GetDeliverabilityTestReportCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetDeliverabilityTestReportCommand extends GetDeliverabilityTestReportCommand_base {
  protected static __types: {
    api: {
      input: GetDeliverabilityTestReportRequest;
      output: GetDeliverabilityTestReportResponse;
    };
    sdk: {
      input: GetDeliverabilityTestReportCommandInput;
      output: GetDeliverabilityTestReportCommandOutput;
    };
  };
}
