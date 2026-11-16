import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  UpdateReputationEntityCustomerManagedStatusRequest,
  UpdateReputationEntityCustomerManagedStatusResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface UpdateReputationEntityCustomerManagedStatusCommandInput extends UpdateReputationEntityCustomerManagedStatusRequest {}
export interface UpdateReputationEntityCustomerManagedStatusCommandOutput
  extends UpdateReputationEntityCustomerManagedStatusResponse, __MetadataBearer {}
declare const UpdateReputationEntityCustomerManagedStatusCommand_base: {
  new (
    input: UpdateReputationEntityCustomerManagedStatusCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateReputationEntityCustomerManagedStatusCommandInput,
    UpdateReputationEntityCustomerManagedStatusCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateReputationEntityCustomerManagedStatusCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateReputationEntityCustomerManagedStatusCommandInput,
    UpdateReputationEntityCustomerManagedStatusCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateReputationEntityCustomerManagedStatusCommand extends UpdateReputationEntityCustomerManagedStatusCommand_base {
  protected static __types: {
    api: {
      input: UpdateReputationEntityCustomerManagedStatusRequest;
      output: {};
    };
    sdk: {
      input: UpdateReputationEntityCustomerManagedStatusCommandInput;
      output: UpdateReputationEntityCustomerManagedStatusCommandOutput;
    };
  };
}
