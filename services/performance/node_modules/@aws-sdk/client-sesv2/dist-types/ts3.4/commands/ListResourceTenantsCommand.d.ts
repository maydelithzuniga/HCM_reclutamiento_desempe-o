import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListResourceTenantsRequest, ListResourceTenantsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListResourceTenantsCommandInput extends ListResourceTenantsRequest {}
export interface ListResourceTenantsCommandOutput
  extends ListResourceTenantsResponse, __MetadataBearer {}
declare const ListResourceTenantsCommand_base: {
  new (
    input: ListResourceTenantsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListResourceTenantsCommandInput,
    ListResourceTenantsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListResourceTenantsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListResourceTenantsCommandInput,
    ListResourceTenantsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListResourceTenantsCommand extends ListResourceTenantsCommand_base {
  protected static __types: {
    api: {
      input: ListResourceTenantsRequest;
      output: ListResourceTenantsResponse;
    };
    sdk: {
      input: ListResourceTenantsCommandInput;
      output: ListResourceTenantsCommandOutput;
    };
  };
}
