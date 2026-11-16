import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutEmailIdentityFeedbackAttributesRequest,
  PutEmailIdentityFeedbackAttributesResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutEmailIdentityFeedbackAttributesCommandInput extends PutEmailIdentityFeedbackAttributesRequest {}
export interface PutEmailIdentityFeedbackAttributesCommandOutput
  extends PutEmailIdentityFeedbackAttributesResponse, __MetadataBearer {}
declare const PutEmailIdentityFeedbackAttributesCommand_base: {
  new (
    input: PutEmailIdentityFeedbackAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityFeedbackAttributesCommandInput,
    PutEmailIdentityFeedbackAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutEmailIdentityFeedbackAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityFeedbackAttributesCommandInput,
    PutEmailIdentityFeedbackAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutEmailIdentityFeedbackAttributesCommand extends PutEmailIdentityFeedbackAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutEmailIdentityFeedbackAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutEmailIdentityFeedbackAttributesCommandInput;
      output: PutEmailIdentityFeedbackAttributesCommandOutput;
    };
  };
}
