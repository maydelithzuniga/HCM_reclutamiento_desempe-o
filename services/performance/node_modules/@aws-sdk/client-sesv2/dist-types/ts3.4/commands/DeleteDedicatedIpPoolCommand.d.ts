import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { DeleteDedicatedIpPoolRequest, DeleteDedicatedIpPoolResponse } from "../models/models_0";
export { __MetadataBearer };
export interface DeleteDedicatedIpPoolCommandInput extends DeleteDedicatedIpPoolRequest {}
export interface DeleteDedicatedIpPoolCommandOutput
  extends DeleteDedicatedIpPoolResponse, __MetadataBearer {}
declare const DeleteDedicatedIpPoolCommand_base: {
  new (
    input: DeleteDedicatedIpPoolCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteDedicatedIpPoolCommandInput,
    DeleteDedicatedIpPoolCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteDedicatedIpPoolCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteDedicatedIpPoolCommandInput,
    DeleteDedicatedIpPoolCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteDedicatedIpPoolCommand extends DeleteDedicatedIpPoolCommand_base {
  protected static __types: {
    api: {
      input: DeleteDedicatedIpPoolRequest;
      output: {};
    };
    sdk: {
      input: DeleteDedicatedIpPoolCommandInput;
      output: DeleteDedicatedIpPoolCommandOutput;
    };
  };
}
