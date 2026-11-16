import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteTenantRequest, DeleteTenantResponse } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteTenantCommandInput extends DeleteTenantRequest {}
export interface DeleteTenantCommandOutput extends DeleteTenantResponse, __MetadataBearer {}
declare const DeleteTenantCommand_base: {
  new (
    input: DeleteTenantCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteTenantCommandInput,
    DeleteTenantCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteTenantCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteTenantCommandInput,
    DeleteTenantCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteTenantCommand extends DeleteTenantCommand_base {
  protected static __types: {
    api: {
      input: DeleteTenantRequest;
      output: {};
    };
    sdk: {
      input: DeleteTenantCommandInput;
      output: DeleteTenantCommandOutput;
    };
  };
}
