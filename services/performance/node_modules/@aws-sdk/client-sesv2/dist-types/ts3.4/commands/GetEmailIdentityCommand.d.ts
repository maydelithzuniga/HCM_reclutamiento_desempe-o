import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetEmailIdentityRequest, GetEmailIdentityResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetEmailIdentityCommandInput extends GetEmailIdentityRequest {}
export interface GetEmailIdentityCommandOutput extends GetEmailIdentityResponse, __MetadataBearer {}
declare const GetEmailIdentityCommand_base: {
  new (
    input: GetEmailIdentityCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetEmailIdentityCommandInput,
    GetEmailIdentityCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetEmailIdentityCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetEmailIdentityCommandInput,
    GetEmailIdentityCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetEmailIdentityCommand extends GetEmailIdentityCommand_base {
  protected static __types: {
    api: {
      input: GetEmailIdentityRequest;
      output: GetEmailIdentityResponse;
    };
    sdk: {
      input: GetEmailIdentityCommandInput;
      output: GetEmailIdentityCommandOutput;
    };
  };
}
