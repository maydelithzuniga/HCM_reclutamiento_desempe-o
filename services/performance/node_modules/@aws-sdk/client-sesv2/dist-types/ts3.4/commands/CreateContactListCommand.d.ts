import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateContactListRequest, CreateContactListResponse } from "../models/models_0";
export { __MetadataBearer };
export interface CreateContactListCommandInput extends CreateContactListRequest {}
export interface CreateContactListCommandOutput
  extends CreateContactListResponse, __MetadataBearer {}
declare const CreateContactListCommand_base: {
  new (
    input: CreateContactListCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateContactListCommandInput,
    CreateContactListCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateContactListCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateContactListCommandInput,
    CreateContactListCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateContactListCommand extends CreateContactListCommand_base {
  protected static __types: {
    api: {
      input: CreateContactListRequest;
      output: {};
    };
    sdk: {
      input: CreateContactListCommandInput;
      output: CreateContactListCommandOutput;
    };
  };
}
