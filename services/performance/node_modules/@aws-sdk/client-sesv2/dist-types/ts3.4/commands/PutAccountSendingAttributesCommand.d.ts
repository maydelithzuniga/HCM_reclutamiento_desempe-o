import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutAccountSendingAttributesRequest,
  PutAccountSendingAttributesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutAccountSendingAttributesCommandInput extends PutAccountSendingAttributesRequest {}
export interface PutAccountSendingAttributesCommandOutput
  extends PutAccountSendingAttributesResponse, __MetadataBearer {}
declare const PutAccountSendingAttributesCommand_base: {
  new (
    input: PutAccountSendingAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutAccountSendingAttributesCommandInput,
    PutAccountSendingAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [PutAccountSendingAttributesCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    PutAccountSendingAttributesCommandInput,
    PutAccountSendingAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutAccountSendingAttributesCommand extends PutAccountSendingAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutAccountSendingAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutAccountSendingAttributesCommandInput;
      output: PutAccountSendingAttributesCommandOutput;
    };
  };
}
