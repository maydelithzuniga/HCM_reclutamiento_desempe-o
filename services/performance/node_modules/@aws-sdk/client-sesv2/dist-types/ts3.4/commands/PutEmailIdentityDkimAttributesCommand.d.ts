import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutEmailIdentityDkimAttributesRequest,
  PutEmailIdentityDkimAttributesResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutEmailIdentityDkimAttributesCommandInput extends PutEmailIdentityDkimAttributesRequest {}
export interface PutEmailIdentityDkimAttributesCommandOutput
  extends PutEmailIdentityDkimAttributesResponse, __MetadataBearer {}
declare const PutEmailIdentityDkimAttributesCommand_base: {
  new (
    input: PutEmailIdentityDkimAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityDkimAttributesCommandInput,
    PutEmailIdentityDkimAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutEmailIdentityDkimAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityDkimAttributesCommandInput,
    PutEmailIdentityDkimAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutEmailIdentityDkimAttributesCommand extends PutEmailIdentityDkimAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutEmailIdentityDkimAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutEmailIdentityDkimAttributesCommandInput;
      output: PutEmailIdentityDkimAttributesCommandOutput;
    };
  };
}
