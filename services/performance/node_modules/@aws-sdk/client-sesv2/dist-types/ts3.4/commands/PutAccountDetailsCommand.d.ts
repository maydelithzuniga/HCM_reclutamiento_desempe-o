import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutAccountDetailsRequest, PutAccountDetailsResponse } from "../models/models_0";
export { __MetadataBearer };
export interface PutAccountDetailsCommandInput extends PutAccountDetailsRequest {}
export interface PutAccountDetailsCommandOutput
  extends PutAccountDetailsResponse, __MetadataBearer {}
declare const PutAccountDetailsCommand_base: {
  new (
    input: PutAccountDetailsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutAccountDetailsCommandInput,
    PutAccountDetailsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutAccountDetailsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutAccountDetailsCommandInput,
    PutAccountDetailsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutAccountDetailsCommand extends PutAccountDetailsCommand_base {
  protected static __types: {
    api: {
      input: PutAccountDetailsRequest;
      output: {};
    };
    sdk: {
      input: PutAccountDetailsCommandInput;
      output: PutAccountDetailsCommandOutput;
    };
  };
}
