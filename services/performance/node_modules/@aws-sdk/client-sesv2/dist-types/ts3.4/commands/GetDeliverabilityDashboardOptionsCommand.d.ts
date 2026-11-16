import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetDeliverabilityDashboardOptionsRequest,
  GetDeliverabilityDashboardOptionsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetDeliverabilityDashboardOptionsCommandInput extends GetDeliverabilityDashboardOptionsRequest {}
export interface GetDeliverabilityDashboardOptionsCommandOutput
  extends GetDeliverabilityDashboardOptionsResponse, __MetadataBearer {}
declare const GetDeliverabilityDashboardOptionsCommand_base: {
  new (
    input: GetDeliverabilityDashboardOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDeliverabilityDashboardOptionsCommandInput,
    GetDeliverabilityDashboardOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [GetDeliverabilityDashboardOptionsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    GetDeliverabilityDashboardOptionsCommandInput,
    GetDeliverabilityDashboardOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetDeliverabilityDashboardOptionsCommand extends GetDeliverabilityDashboardOptionsCommand_base {
  protected static __types: {
    api: {
      input: {};
      output: GetDeliverabilityDashboardOptionsResponse;
    };
    sdk: {
      input: GetDeliverabilityDashboardOptionsCommandInput;
      output: GetDeliverabilityDashboardOptionsCommandOutput;
    };
  };
}
