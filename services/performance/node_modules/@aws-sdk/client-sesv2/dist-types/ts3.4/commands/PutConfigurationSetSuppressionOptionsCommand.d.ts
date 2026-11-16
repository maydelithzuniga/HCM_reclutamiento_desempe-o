import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutConfigurationSetSuppressionOptionsRequest,
  PutConfigurationSetSuppressionOptionsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutConfigurationSetSuppressionOptionsCommandInput extends PutConfigurationSetSuppressionOptionsRequest {}
export interface PutConfigurationSetSuppressionOptionsCommandOutput
  extends PutConfigurationSetSuppressionOptionsResponse, __MetadataBearer {}
declare const PutConfigurationSetSuppressionOptionsCommand_base: {
  new (
    input: PutConfigurationSetSuppressionOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetSuppressionOptionsCommandInput,
    PutConfigurationSetSuppressionOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutConfigurationSetSuppressionOptionsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutConfigurationSetSuppressionOptionsCommandInput,
    PutConfigurationSetSuppressionOptionsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutConfigurationSetSuppressionOptionsCommand extends PutConfigurationSetSuppressionOptionsCommand_base {
  protected static __types: {
    api: {
      input: PutConfigurationSetSuppressionOptionsRequest;
      output: {};
    };
    sdk: {
      input: PutConfigurationSetSuppressionOptionsCommandInput;
      output: PutConfigurationSetSuppressionOptionsCommandOutput;
    };
  };
}
