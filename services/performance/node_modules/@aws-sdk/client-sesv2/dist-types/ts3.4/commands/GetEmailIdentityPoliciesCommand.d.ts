import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetEmailIdentityPoliciesRequest,
  GetEmailIdentityPoliciesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetEmailIdentityPoliciesCommandInput extends GetEmailIdentityPoliciesRequest {}
export interface GetEmailIdentityPoliciesCommandOutput
  extends GetEmailIdentityPoliciesResponse, __MetadataBearer {}
declare const GetEmailIdentityPoliciesCommand_base: {
  new (
    input: GetEmailIdentityPoliciesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetEmailIdentityPoliciesCommandInput,
    GetEmailIdentityPoliciesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetEmailIdentityPoliciesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetEmailIdentityPoliciesCommandInput,
    GetEmailIdentityPoliciesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetEmailIdentityPoliciesCommand extends GetEmailIdentityPoliciesCommand_base {
  protected static __types: {
    api: {
      input: GetEmailIdentityPoliciesRequest;
      output: GetEmailIdentityPoliciesResponse;
    };
    sdk: {
      input: GetEmailIdentityPoliciesCommandInput;
      output: GetEmailIdentityPoliciesCommandOutput;
    };
  };
}
