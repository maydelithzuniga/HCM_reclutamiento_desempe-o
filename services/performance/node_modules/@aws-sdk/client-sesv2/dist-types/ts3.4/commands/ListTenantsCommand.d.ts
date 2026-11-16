import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListTenantsRequest, ListTenantsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListTenantsCommandInput extends ListTenantsRequest {}
export interface ListTenantsCommandOutput extends ListTenantsResponse, __MetadataBearer {}
declare const ListTenantsCommand_base: {
  new (
    input: ListTenantsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListTenantsCommandInput,
    ListTenantsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListTenantsCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListTenantsCommandInput,
    ListTenantsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListTenantsCommand extends ListTenantsCommand_base {
  protected static __types: {
    api: {
      input: ListTenantsRequest;
      output: ListTenantsResponse;
    };
    sdk: {
      input: ListTenantsCommandInput;
      output: ListTenantsCommandOutput;
    };
  };
}
