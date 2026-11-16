import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutEmailIdentityMailFromAttributesRequest,
  PutEmailIdentityMailFromAttributesResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutEmailIdentityMailFromAttributesCommandInput extends PutEmailIdentityMailFromAttributesRequest {}
export interface PutEmailIdentityMailFromAttributesCommandOutput
  extends PutEmailIdentityMailFromAttributesResponse, __MetadataBearer {}
declare const PutEmailIdentityMailFromAttributesCommand_base: {
  new (
    input: PutEmailIdentityMailFromAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityMailFromAttributesCommandInput,
    PutEmailIdentityMailFromAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutEmailIdentityMailFromAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityMailFromAttributesCommandInput,
    PutEmailIdentityMailFromAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutEmailIdentityMailFromAttributesCommand extends PutEmailIdentityMailFromAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutEmailIdentityMailFromAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutEmailIdentityMailFromAttributesCommandInput;
      output: PutEmailIdentityMailFromAttributesCommandOutput;
    };
  };
}
