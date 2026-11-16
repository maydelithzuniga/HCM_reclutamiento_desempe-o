import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetDomainStatisticsReportRequest,
  GetDomainStatisticsReportResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetDomainStatisticsReportCommandInput extends GetDomainStatisticsReportRequest {}
export interface GetDomainStatisticsReportCommandOutput
  extends GetDomainStatisticsReportResponse, __MetadataBearer {}
declare const GetDomainStatisticsReportCommand_base: {
  new (
    input: GetDomainStatisticsReportCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDomainStatisticsReportCommandInput,
    GetDomainStatisticsReportCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetDomainStatisticsReportCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDomainStatisticsReportCommandInput,
    GetDomainStatisticsReportCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetDomainStatisticsReportCommand extends GetDomainStatisticsReportCommand_base {
  protected static __types: {
    api: {
      input: GetDomainStatisticsReportRequest;
      output: GetDomainStatisticsReportResponse;
    };
    sdk: {
      input: GetDomainStatisticsReportCommandInput;
      output: GetDomainStatisticsReportCommandOutput;
    };
  };
}
