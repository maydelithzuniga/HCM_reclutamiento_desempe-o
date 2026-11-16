import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { CreateDedicatedIpPoolRequest, CreateDedicatedIpPoolResponse } from "../models/models_0";
export { __MetadataBearer };
export interface CreateDedicatedIpPoolCommandInput extends CreateDedicatedIpPoolRequest {}
export interface CreateDedicatedIpPoolCommandOutput
  extends CreateDedicatedIpPoolResponse, __MetadataBearer {}
declare const CreateDedicatedIpPoolCommand_base: {
  new (
    input: CreateDedicatedIpPoolCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateDedicatedIpPoolCommandInput,
    CreateDedicatedIpPoolCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateDedicatedIpPoolCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateDedicatedIpPoolCommandInput,
    CreateDedicatedIpPoolCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateDedicatedIpPoolCommand extends CreateDedicatedIpPoolCommand_base {
  protected static __types: {
    api: {
      input: CreateDedicatedIpPoolRequest;
      output: {};
    };
    sdk: {
      input: CreateDedicatedIpPoolCommandInput;
      output: CreateDedicatedIpPoolCommandOutput;
    };
  };
}
