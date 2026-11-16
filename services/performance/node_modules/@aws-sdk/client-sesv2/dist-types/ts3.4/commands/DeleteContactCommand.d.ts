import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteContactRequest, DeleteContactResponse } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteContactCommandInput extends DeleteContactRequest {}
export interface DeleteContactCommandOutput extends DeleteContactResponse, __MetadataBearer {}
declare const DeleteContactCommand_base: {
  new (
    input: DeleteContactCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteContactCommandInput,
    DeleteContactCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteContactCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteContactCommandInput,
    DeleteContactCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteContactCommand extends DeleteContactCommand_base {
  protected static __types: {
    api: {
      input: DeleteContactRequest;
      output: {};
    };
    sdk: {
      input: DeleteContactCommandInput;
      output: DeleteContactCommandOutput;
    };
  };
}
