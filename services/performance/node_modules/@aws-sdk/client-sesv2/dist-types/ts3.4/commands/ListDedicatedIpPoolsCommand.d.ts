import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListDedicatedIpPoolsRequest, ListDedicatedIpPoolsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListDedicatedIpPoolsCommandInput extends ListDedicatedIpPoolsRequest {}
export interface ListDedicatedIpPoolsCommandOutput
  extends ListDedicatedIpPoolsResponse, __MetadataBearer {}
declare const ListDedicatedIpPoolsCommand_base: {
  new (
    input: ListDedicatedIpPoolsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListDedicatedIpPoolsCommandInput,
    ListDedicatedIpPoolsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListDedicatedIpPoolsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListDedicatedIpPoolsCommandInput,
    ListDedicatedIpPoolsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListDedicatedIpPoolsCommand extends ListDedicatedIpPoolsCommand_base {
  protected static __types: {
    api: {
      input: ListDedicatedIpPoolsRequest;
      output: ListDedicatedIpPoolsResponse;
    };
    sdk: {
      input: ListDedicatedIpPoolsCommandInput;
      output: ListDedicatedIpPoolsCommandOutput;
    };
  };
}
