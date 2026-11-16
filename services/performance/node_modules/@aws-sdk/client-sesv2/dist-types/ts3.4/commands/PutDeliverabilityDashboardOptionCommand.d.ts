import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutDeliverabilityDashboardOptionRequest,
  PutDeliverabilityDashboardOptionResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutDeliverabilityDashboardOptionCommandInput extends PutDeliverabilityDashboardOptionRequest {}
export interface PutDeliverabilityDashboardOptionCommandOutput
  extends PutDeliverabilityDashboardOptionResponse, __MetadataBearer {}
declare const PutDeliverabilityDashboardOptionCommand_base: {
  new (
    input: PutDeliverabilityDashboardOptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutDeliverabilityDashboardOptionCommandInput,
    PutDeliverabilityDashboardOptionCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutDeliverabilityDashboardOptionCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutDeliverabilityDashboardOptionCommandInput,
    PutDeliverabilityDashboardOptionCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutDeliverabilityDashboardOptionCommand extends PutDeliverabilityDashboardOptionCommand_base {
  protected static __types: {
    api: {
      input: PutDeliverabilityDashboardOptionRequest;
      output: {};
    };
    sdk: {
      input: PutDeliverabilityDashboardOptionCommandInput;
      output: PutDeliverabilityDashboardOptionCommandOutput;
    };
  };
}
