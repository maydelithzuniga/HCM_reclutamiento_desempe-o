import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { UpdateContactRequest, UpdateContactResponse } from "../models/models_1";
export { __MetadataBearer };
export interface UpdateContactCommandInput extends UpdateContactRequest {}
export interface UpdateContactCommandOutput extends UpdateContactResponse, __MetadataBearer {}
declare const UpdateContactCommand_base: {
  new (
    input: UpdateContactCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateContactCommandInput,
    UpdateContactCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateContactCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateContactCommandInput,
    UpdateContactCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateContactCommand extends UpdateContactCommand_base {
  protected static __types: {
    api: {
      input: UpdateContactRequest;
      output: {};
    };
    sdk: {
      input: UpdateContactCommandInput;
      output: UpdateContactCommandOutput;
    };
  };
}
