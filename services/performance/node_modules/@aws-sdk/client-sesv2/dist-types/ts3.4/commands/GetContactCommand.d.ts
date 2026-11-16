import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetContactRequest, GetContactResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetContactCommandInput extends GetContactRequest {}
export interface GetContactCommandOutput extends GetContactResponse, __MetadataBearer {}
declare const GetContactCommand_base: {
  new (
    input: GetContactCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetContactCommandInput,
    GetContactCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetContactCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetContactCommandInput,
    GetContactCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetContactCommand extends GetContactCommand_base {
  protected static __types: {
    api: {
      input: GetContactRequest;
      output: GetContactResponse;
    };
    sdk: {
      input: GetContactCommandInput;
      output: GetContactCommandOutput;
    };
  };
}
