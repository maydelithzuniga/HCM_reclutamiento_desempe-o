import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListDeliverabilityTestReportsRequest,
  ListDeliverabilityTestReportsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface ListDeliverabilityTestReportsCommandInput extends ListDeliverabilityTestReportsRequest {}
export interface ListDeliverabilityTestReportsCommandOutput
  extends ListDeliverabilityTestReportsResponse, __MetadataBearer {}
declare const ListDeliverabilityTestReportsCommand_base: {
  new (
    input: ListDeliverabilityTestReportsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListDeliverabilityTestReportsCommandInput,
    ListDeliverabilityTestReportsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListDeliverabilityTestReportsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListDeliverabilityTestReportsCommandInput,
    ListDeliverabilityTestReportsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListDeliverabilityTestReportsCommand extends ListDeliverabilityTestReportsCommand_base {
  protected static __types: {
    api: {
      input: ListDeliverabilityTestReportsRequest;
      output: ListDeliverabilityTestReportsResponse;
    };
    sdk: {
      input: ListDeliverabilityTestReportsCommandInput;
      output: ListDeliverabilityTestReportsCommandOutput;
    };
  };
}
