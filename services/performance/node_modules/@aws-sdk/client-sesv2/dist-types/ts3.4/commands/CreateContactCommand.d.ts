import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateContactRequest, CreateContactResponse } from "../models/models_0";
export { __MetadataBearer };
export interface CreateContactCommandInput extends CreateContactRequest {}
export interface CreateContactCommandOutput extends CreateContactResponse, __MetadataBearer {}
declare const CreateContactCommand_base: {
  new (
    input: CreateContactCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateContactCommandInput,
    CreateContactCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateContactCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateContactCommandInput,
    CreateContactCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateContactCommand extends CreateContactCommand_base {
  protected static __types: {
    api: {
      input: CreateContactRequest;
      output: {};
    };
    sdk: {
      input: CreateContactCommandInput;
      output: CreateContactCommandOutput;
    };
  };
}
