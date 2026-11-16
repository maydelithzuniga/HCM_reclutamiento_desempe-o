import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateTenantRequest, CreateTenantResponse } from "../models/models_0";
export { __MetadataBearer };
export interface CreateTenantCommandInput extends CreateTenantRequest {}
export interface CreateTenantCommandOutput extends CreateTenantResponse, __MetadataBearer {}
declare const CreateTenantCommand_base: {
  new (
    input: CreateTenantCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateTenantCommandInput,
    CreateTenantCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateTenantCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateTenantCommandInput,
    CreateTenantCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateTenantCommand extends CreateTenantCommand_base {
  protected static __types: {
    api: {
      input: CreateTenantRequest;
      output: CreateTenantResponse;
    };
    sdk: {
      input: CreateTenantCommandInput;
      output: CreateTenantCommandOutput;
    };
  };
}
