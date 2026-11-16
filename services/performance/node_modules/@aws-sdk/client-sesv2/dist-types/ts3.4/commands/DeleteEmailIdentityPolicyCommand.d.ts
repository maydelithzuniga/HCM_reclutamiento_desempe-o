import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  DeleteEmailIdentityPolicyRequest,
  DeleteEmailIdentityPolicyResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface DeleteEmailIdentityPolicyCommandInput extends DeleteEmailIdentityPolicyRequest {}
export interface DeleteEmailIdentityPolicyCommandOutput
  extends DeleteEmailIdentityPolicyResponse, __MetadataBearer {}
declare const DeleteEmailIdentityPolicyCommand_base: {
  new (
    input: DeleteEmailIdentityPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteEmailIdentityPolicyCommandInput,
    DeleteEmailIdentityPolicyCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteEmailIdentityPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteEmailIdentityPolicyCommandInput,
    DeleteEmailIdentityPolicyCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteEmailIdentityPolicyCommand extends DeleteEmailIdentityPolicyCommand_base {
  protected static __types: {
    api: {
      input: DeleteEmailIdentityPolicyRequest;
      output: {};
    };
    sdk: {
      input: DeleteEmailIdentityPolicyCommandInput;
      output: DeleteEmailIdentityPolicyCommandOutput;
    };
  };
}
