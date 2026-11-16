import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutConfigurationSetReputationOptionsRequest,
  PutConfigurationSetReputationOptionsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutConfigurationSetReputationOptionsCommandInput extends PutConfigurationSetReputationOptionsRequest {}
export interface PutConfigurationSetReputationOptionsCommandOutput
  extends PutConfigurationSetReputationOptionsResponse, __MetadataBearer {}
declare const PutConfigurationSetReputationOptionsCommand_base: {
  new (
    input: PutConfigurationSetReputationOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetReputationOptionsCommandInput,
    PutConfigurationSetReputationOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutConfigurationSetReputationOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetReputationOptionsCommandInput,
    PutConfigurationSetReputationOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutConfigurationSetReputationOptionsCommand extends PutConfigurationSetReputationOptionsCommand_base {
  protected static __types: {
    api: {
      input: PutConfigurationSetReputationOptionsRequest;
      output: {};
    };
    sdk: {
      input: PutConfigurationSetReputationOptionsCommandInput;
      output: PutConfigurationSetReputationOptionsCommandOutput;
    };
  };
}
