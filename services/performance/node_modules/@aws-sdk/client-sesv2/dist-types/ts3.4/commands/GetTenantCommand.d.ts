import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetTenantRequest, GetTenantResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetTenantCommandInput extends GetTenantRequest {}
export interface GetTenantCommandOutput extends GetTenantResponse, __MetadataBearer {}
declare const GetTenantCommand_base: {
  new (
    input: GetTenantCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetTenantCommandInput,
    GetTenantCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetTenantCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetTenantCommandInput,
    GetTenantCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetTenantCommand extends GetTenantCommand_base {
  protected static __types: {
    api: {
      input: GetTenantRequest;
      output: GetTenantResponse;
    };
    sdk: {
      input: GetTenantCommandInput;
      output: GetTenantCommandOutput;
    };
  };
}
