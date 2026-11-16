import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CreateEmailIdentityPolicyRequest,
  CreateEmailIdentityPolicyResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface CreateEmailIdentityPolicyCommandInput extends CreateEmailIdentityPolicyRequest {}
export interface CreateEmailIdentityPolicyCommandOutput
  extends CreateEmailIdentityPolicyResponse, __MetadataBearer {}
declare const CreateEmailIdentityPolicyCommand_base: {
  new (
    input: CreateEmailIdentityPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateEmailIdentityPolicyCommandInput,
    CreateEmailIdentityPolicyCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateEmailIdentityPolicyCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateEmailIdentityPolicyCommandInput,
    CreateEmailIdentityPolicyCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateEmailIdentityPolicyCommand extends CreateEmailIdentityPolicyCommand_base {
  protected static __types: {
    api: {
      input: CreateEmailIdentityPolicyRequest;
      output: {};
    };
    sdk: {
      input: CreateEmailIdentityPolicyCommandInput;
      output: CreateEmailIdentityPolicyCommandOutput;
    };
  };
}
