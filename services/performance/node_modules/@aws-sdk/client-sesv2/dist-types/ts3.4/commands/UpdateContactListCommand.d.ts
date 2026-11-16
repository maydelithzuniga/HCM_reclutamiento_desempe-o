import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { UpdateContactListRequest, UpdateContactListResponse } from "../models/models_1";
export { __MetadataBearer };
export interface UpdateContactListCommandInput extends UpdateContactListRequest {}
export interface UpdateContactListCommandOutput
  extends UpdateContactListResponse, __MetadataBearer {}
declare const UpdateContactListCommand_base: {
  new (
    input: UpdateContactListCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateContactListCommandInput,
    UpdateContactListCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: UpdateContactListCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    UpdateContactListCommandInput,
    UpdateContactListCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class UpdateContactListCommand extends UpdateContactListCommand_base {
  protected static __types: {
    api: {
      input: UpdateContactListRequest;
      output: {};
    };
    sdk: {
      input: UpdateContactListCommandInput;
      output: UpdateContactListCommandOutput;
    };
  };
}
