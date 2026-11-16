import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteEmailIdentityRequest, DeleteEmailIdentityResponse } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteEmailIdentityCommandInput extends DeleteEmailIdentityRequest {}
export interface DeleteEmailIdentityCommandOutput
  extends DeleteEmailIdentityResponse, __MetadataBearer {}
declare const DeleteEmailIdentityCommand_base: {
  new (
    input: DeleteEmailIdentityCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteEmailIdentityCommandInput,
    DeleteEmailIdentityCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteEmailIdentityCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteEmailIdentityCommandInput,
    DeleteEmailIdentityCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteEmailIdentityCommand extends DeleteEmailIdentityCommand_base {
  protected static __types: {
    api: {
      input: DeleteEmailIdentityRequest;
      output: {};
    };
    sdk: {
      input: DeleteEmailIdentityCommandInput;
      output: DeleteEmailIdentityCommandOutput;
    };
  };
}
