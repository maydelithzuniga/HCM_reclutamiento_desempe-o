import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteContactListRequest, DeleteContactListResponse } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteContactListCommandInput extends DeleteContactListRequest {}
export interface DeleteContactListCommandOutput
  extends DeleteContactListResponse, __MetadataBearer {}
declare const DeleteContactListCommand_base: {
  new (
    input: DeleteContactListCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteContactListCommandInput,
    DeleteContactListCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteContactListCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteContactListCommandInput,
    DeleteContactListCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteContactListCommand extends DeleteContactListCommand_base {
  protected static __types: {
    api: {
      input: DeleteContactListRequest;
      output: {};
    };
    sdk: {
      input: DeleteContactListCommandInput;
      output: DeleteContactListCommandOutput;
    };
  };
}
