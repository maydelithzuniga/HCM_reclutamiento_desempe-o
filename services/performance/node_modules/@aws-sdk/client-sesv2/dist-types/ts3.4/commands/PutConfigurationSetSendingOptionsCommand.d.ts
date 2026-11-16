import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutConfigurationSetSendingOptionsRequest,
  PutConfigurationSetSendingOptionsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutConfigurationSetSendingOptionsCommandInput extends PutConfigurationSetSendingOptionsRequest {}
export interface PutConfigurationSetSendingOptionsCommandOutput
  extends PutConfigurationSetSendingOptionsResponse, __MetadataBearer {}
declare const PutConfigurationSetSendingOptionsCommand_base: {
  new (
    input: PutConfigurationSetSendingOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetSendingOptionsCommandInput,
    PutConfigurationSetSendingOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutConfigurationSetSendingOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetSendingOptionsCommandInput,
    PutConfigurationSetSendingOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutConfigurationSetSendingOptionsCommand extends PutConfigurationSetSendingOptionsCommand_base {
  protected static __types: {
    api: {
      input: PutConfigurationSetSendingOptionsRequest;
      output: {};
    };
    sdk: {
      input: PutConfigurationSetSendingOptionsCommandInput;
      output: PutConfigurationSetSendingOptionsCommandOutput;
    };
  };
}
