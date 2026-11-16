import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  DeleteTenantResourceAssociationRequest,
  DeleteTenantResourceAssociationResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface DeleteTenantResourceAssociationCommandInput extends DeleteTenantResourceAssociationRequest {}
export interface DeleteTenantResourceAssociationCommandOutput
  extends DeleteTenantResourceAssociationResponse, __MetadataBearer {}
declare const DeleteTenantResourceAssociationCommand_base: {
  new (
    input: DeleteTenantResourceAssociationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteTenantResourceAssociationCommandInput,
    DeleteTenantResourceAssociationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteTenantResourceAssociationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteTenantResourceAssociationCommandInput,
    DeleteTenantResourceAssociationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteTenantResourceAssociationCommand extends DeleteTenantResourceAssociationCommand_base {
  protected static __types: {
    api: {
      input: DeleteTenantResourceAssociationRequest;
      output: {};
    };
    sdk: {
      input: DeleteTenantResourceAssociationCommandInput;
      output: DeleteTenantResourceAssociationCommandOutput;
    };
  };
}
