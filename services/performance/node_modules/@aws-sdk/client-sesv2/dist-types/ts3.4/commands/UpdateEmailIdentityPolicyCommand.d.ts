import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  UpdateEmailIdentityPolicyRequest,
  UpdateEmailIdentityPolicyResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface UpdateEmailIdentityPolicyCommandInput extends UpdateEmailIdentityPolicyRequest {}
export interface UpdateEmailIdentityPolicyCommandOutput
  extends UpdateEmailIdentityPolicyResponse, __MetadataBearer {}
declare const UpdateEmailIdentityPolicyCommand_base: {
  new (
    input: UpdateEmailIdentityPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateEmailIdentityPolicyCommandInput,
    UpdateEmailIdentityPolicyCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateEmailIdentityPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateEmailIdentityPolicyCommandInput,
    UpdateEmailIdentityPolicyCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateEmailIdentityPolicyCommand extends UpdateEmailIdentityPolicyCommand_base {
  protected static __types: {
    api: {
      input: UpdateEmailIdentityPolicyRequest;
      output: {};
    };
    sdk: {
      input: UpdateEmailIdentityPolicyCommandInput;
      output: UpdateEmailIdentityPolicyCommandOutput;
    };
  };
}
