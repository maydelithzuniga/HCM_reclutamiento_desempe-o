import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutConfigurationSetArchivingOptionsRequest,
  PutConfigurationSetArchivingOptionsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutConfigurationSetArchivingOptionsCommandInput extends PutConfigurationSetArchivingOptionsRequest {}
export interface PutConfigurationSetArchivingOptionsCommandOutput
  extends PutConfigurationSetArchivingOptionsResponse, __MetadataBearer {}
declare const PutConfigurationSetArchivingOptionsCommand_base: {
  new (
    input: PutConfigurationSetArchivingOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetArchivingOptionsCommandInput,
    PutConfigurationSetArchivingOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutConfigurationSetArchivingOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetArchivingOptionsCommandInput,
    PutConfigurationSetArchivingOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutConfigurationSetArchivingOptionsCommand extends PutConfigurationSetArchivingOptionsCommand_base {
  protected static __types: {
    api: {
      input: PutConfigurationSetArchivingOptionsRequest;
      output: {};
    };
    sdk: {
      input: PutConfigurationSetArchivingOptionsCommandInput;
      output: PutConfigurationSetArchivingOptionsCommandOutput;
    };
  };
}
