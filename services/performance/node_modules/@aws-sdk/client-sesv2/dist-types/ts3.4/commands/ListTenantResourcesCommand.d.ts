import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListTenantResourcesRequest, ListTenantResourcesResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListTenantResourcesCommandInput extends ListTenantResourcesRequest {}
export interface ListTenantResourcesCommandOutput
  extends ListTenantResourcesResponse, __MetadataBearer {}
declare const ListTenantResourcesCommand_base: {
  new (
    input: ListTenantResourcesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListTenantResourcesCommandInput,
    ListTenantResourcesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListTenantResourcesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListTenantResourcesCommandInput,
    ListTenantResourcesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListTenantResourcesCommand extends ListTenantResourcesCommand_base {
  protected static __types: {
    api: {
      input: ListTenantResourcesRequest;
      output: ListTenantResourcesResponse;
    };
    sdk: {
      input: ListTenantResourcesCommandInput;
      output: ListTenantResourcesCommandOutput;
    };
  };
}
