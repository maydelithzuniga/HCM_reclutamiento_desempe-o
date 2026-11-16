import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetAccountRequest, GetAccountResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetAccountCommandInput extends GetAccountRequest {}
export interface GetAccountCommandOutput extends GetAccountResponse, __MetadataBearer {}
declare const GetAccountCommand_base: {
  new (
    input: GetAccountCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetAccountCommandInput,
    GetAccountCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [GetAccountCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    GetAccountCommandInput,
    GetAccountCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetAccountCommand extends GetAccountCommand_base {
  protected static __types: {
    api: {
      input: {};
      output: GetAccountResponse;
    };
    sdk: {
      input: GetAccountCommandInput;
      output: GetAccountCommandOutput;
    };
  };
}
