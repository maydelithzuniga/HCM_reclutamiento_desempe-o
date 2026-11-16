import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateEmailIdentityRequest, CreateEmailIdentityResponse } from "../models/models_0";
export { __MetadataBearer };
export interface CreateEmailIdentityCommandInput extends CreateEmailIdentityRequest {}
export interface CreateEmailIdentityCommandOutput
  extends CreateEmailIdentityResponse, __MetadataBearer {}
declare const CreateEmailIdentityCommand_base: {
  new (
    input: CreateEmailIdentityCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateEmailIdentityCommandInput,
    CreateEmailIdentityCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateEmailIdentityCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateEmailIdentityCommandInput,
    CreateEmailIdentityCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateEmailIdentityCommand extends CreateEmailIdentityCommand_base {
  protected static __types: {
    api: {
      input: CreateEmailIdentityRequest;
      output: CreateEmailIdentityResponse;
    };
    sdk: {
      input: CreateEmailIdentityCommandInput;
      output: CreateEmailIdentityCommandOutput;
    };
  };
}
