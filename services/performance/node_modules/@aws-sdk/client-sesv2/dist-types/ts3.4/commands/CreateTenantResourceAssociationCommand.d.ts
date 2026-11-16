import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CreateTenantResourceAssociationRequest,
  CreateTenantResourceAssociationResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface CreateTenantResourceAssociationCommandInput extends CreateTenantResourceAssociationRequest {}
export interface CreateTenantResourceAssociationCommandOutput
  extends CreateTenantResourceAssociationResponse, __MetadataBearer {}
declare const CreateTenantResourceAssociationCommand_base: {
  new (
    input: CreateTenantResourceAssociationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateTenantResourceAssociationCommandInput,
    CreateTenantResourceAssociationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateTenantResourceAssociationCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateTenantResourceAssociationCommandInput,
    CreateTenantResourceAssociationCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateTenantResourceAssociationCommand extends CreateTenantResourceAssociationCommand_base {
  protected static __types: {
    api: {
      input: CreateTenantResourceAssociationRequest;
      output: {};
    };
    sdk: {
      input: CreateTenantResourceAssociationCommandInput;
      output: CreateTenantResourceAssociationCommandOutput;
    };
  };
}
