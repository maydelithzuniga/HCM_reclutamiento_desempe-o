import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { PutConfigurationSetVdmOptionsRequest } from "../models/models_0";
import { PutConfigurationSetVdmOptionsResponse } from "../models/models_1";
export { __MetadataBearer };
export interface PutConfigurationSetVdmOptionsCommandInput extends PutConfigurationSetVdmOptionsRequest {}
export interface PutConfigurationSetVdmOptionsCommandOutput
  extends PutConfigurationSetVdmOptionsResponse, __MetadataBearer {}
declare const PutConfigurationSetVdmOptionsCommand_base: {
  new (
    input: PutConfigurationSetVdmOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetVdmOptionsCommandInput,
    PutConfigurationSetVdmOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutConfigurationSetVdmOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetVdmOptionsCommandInput,
    PutConfigurationSetVdmOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutConfigurationSetVdmOptionsCommand extends PutConfigurationSetVdmOptionsCommand_base {
  protected static __types: {
    api: {
      input: PutConfigurationSetVdmOptionsRequest;
      output: {};
    };
    sdk: {
      input: PutConfigurationSetVdmOptionsCommandInput;
      output: PutConfigurationSetVdmOptionsCommandOutput;
    };
  };
}
