import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CreateDeliverabilityTestReportRequest,
  CreateDeliverabilityTestReportResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface CreateDeliverabilityTestReportCommandInput extends CreateDeliverabilityTestReportRequest {}
export interface CreateDeliverabilityTestReportCommandOutput
  extends CreateDeliverabilityTestReportResponse, __MetadataBearer {}
declare const CreateDeliverabilityTestReportCommand_base: {
  new (
    input: CreateDeliverabilityTestReportCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateDeliverabilityTestReportCommandInput,
    CreateDeliverabilityTestReportCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateDeliverabilityTestReportCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateDeliverabilityTestReportCommandInput,
    CreateDeliverabilityTestReportCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateDeliverabilityTestReportCommand extends CreateDeliverabilityTestReportCommand_base {
  protected static __types: {
    api: {
      input: CreateDeliverabilityTestReportRequest;
      output: CreateDeliverabilityTestReportResponse;
    };
    sdk: {
      input: CreateDeliverabilityTestReportCommandInput;
      output: CreateDeliverabilityTestReportCommandOutput;
    };
  };
}
