import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  UpdateReputationEntityPolicyRequest,
  UpdateReputationEntityPolicyResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface UpdateReputationEntityPolicyCommandInput extends UpdateReputationEntityPolicyRequest {}
export interface UpdateReputationEntityPolicyCommandOutput
  extends UpdateReputationEntityPolicyResponse, __MetadataBearer {}
declare const UpdateReputationEntityPolicyCommand_base: {
  new (
    input: UpdateReputationEntityPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateReputationEntityPolicyCommandInput,
    UpdateReputationEntityPolicyCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateReputationEntityPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateReputationEntityPolicyCommandInput,
    UpdateReputationEntityPolicyCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateReputationEntityPolicyCommand extends UpdateReputationEntityPolicyCommand_base {
  protected static __types: {
    api: {
      input: UpdateReputationEntityPolicyRequest;
      output: {};
    };
    sdk: {
      input: UpdateReputationEntityPolicyCommandInput;
      output: UpdateReputationEntityPolicyCommandOutput;
    };
  };
}
