import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutConfigurationSetTrackingOptionsRequest,
  PutConfigurationSetTrackingOptionsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutConfigurationSetTrackingOptionsCommandInput extends PutConfigurationSetTrackingOptionsRequest {}
export interface PutConfigurationSetTrackingOptionsCommandOutput
  extends PutConfigurationSetTrackingOptionsResponse, __MetadataBearer {}
declare const PutConfigurationSetTrackingOptionsCommand_base: {
  new (
    input: PutConfigurationSetTrackingOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetTrackingOptionsCommandInput,
    PutConfigurationSetTrackingOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutConfigurationSetTrackingOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetTrackingOptionsCommandInput,
    PutConfigurationSetTrackingOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutConfigurationSetTrackingOptionsCommand extends PutConfigurationSetTrackingOptionsCommand_base {
  protected static __types: {
    api: {
      input: PutConfigurationSetTrackingOptionsRequest;
      output: {};
    };
    sdk: {
      input: PutConfigurationSetTrackingOptionsCommandInput;
      output: PutConfigurationSetTrackingOptionsCommandOutput;
    };
  };
}
