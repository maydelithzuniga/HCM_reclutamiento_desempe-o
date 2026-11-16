import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListMultiRegionEndpointsRequest,
  ListMultiRegionEndpointsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface ListMultiRegionEndpointsCommandInput extends ListMultiRegionEndpointsRequest {}
export interface ListMultiRegionEndpointsCommandOutput
  extends ListMultiRegionEndpointsResponse, __MetadataBearer {}
declare const ListMultiRegionEndpointsCommand_base: {
  new (
    input: ListMultiRegionEndpointsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListMultiRegionEndpointsCommandInput,
    ListMultiRegionEndpointsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListMultiRegionEndpointsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListMultiRegionEndpointsCommandInput,
    ListMultiRegionEndpointsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListMultiRegionEndpointsCommand extends ListMultiRegionEndpointsCommand_base {
  protected static __types: {
    api: {
      input: ListMultiRegionEndpointsRequest;
      output: ListMultiRegionEndpointsResponse;
    };
    sdk: {
      input: ListMultiRegionEndpointsCommandInput;
      output: ListMultiRegionEndpointsCommandOutput;
    };
  };
}
