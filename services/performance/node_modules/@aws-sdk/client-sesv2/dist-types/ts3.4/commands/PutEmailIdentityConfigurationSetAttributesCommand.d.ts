import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutEmailIdentityConfigurationSetAttributesRequest,
  PutEmailIdentityConfigurationSetAttributesResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutEmailIdentityConfigurationSetAttributesCommandInput extends PutEmailIdentityConfigurationSetAttributesRequest {}
export interface PutEmailIdentityConfigurationSetAttributesCommandOutput
  extends PutEmailIdentityConfigurationSetAttributesResponse, __MetadataBearer {}
declare const PutEmailIdentityConfigurationSetAttributesCommand_base: {
  new (
    input: PutEmailIdentityConfigurationSetAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityConfigurationSetAttributesCommandInput,
    PutEmailIdentityConfigurationSetAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutEmailIdentityConfigurationSetAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityConfigurationSetAttributesCommandInput,
    PutEmailIdentityConfigurationSetAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutEmailIdentityConfigurationSetAttributesCommand extends PutEmailIdentityConfigurationSetAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutEmailIdentityConfigurationSetAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutEmailIdentityConfigurationSetAttributesCommandInput;
      output: PutEmailIdentityConfigurationSetAttributesCommandOutput;
    };
  };
}
