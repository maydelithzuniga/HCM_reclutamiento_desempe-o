import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetContactListRequest, GetContactListResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetContactListCommandInput extends GetContactListRequest {}
export interface GetContactListCommandOutput extends GetContactListResponse, __MetadataBearer {}
declare const GetContactListCommand_base: {
  new (
    input: GetContactListCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetContactListCommandInput,
    GetContactListCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetContactListCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetContactListCommandInput,
    GetContactListCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetContactListCommand extends GetContactListCommand_base {
  protected static __types: {
    api: {
      input: GetContactListRequest;
      output: GetContactListResponse;
    };
    sdk: {
      input: GetContactListCommandInput;
      output: GetContactListCommandOutput;
    };
  };
}
