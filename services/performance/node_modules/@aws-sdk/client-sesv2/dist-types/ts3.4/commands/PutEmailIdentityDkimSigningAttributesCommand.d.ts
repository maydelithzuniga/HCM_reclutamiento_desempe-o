import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutEmailIdentityDkimSigningAttributesRequest,
  PutEmailIdentityDkimSigningAttributesResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutEmailIdentityDkimSigningAttributesCommandInput extends PutEmailIdentityDkimSigningAttributesRequest {}
export interface PutEmailIdentityDkimSigningAttributesCommandOutput
  extends PutEmailIdentityDkimSigningAttributesResponse, __MetadataBearer {}
declare const PutEmailIdentityDkimSigningAttributesCommand_base: {
  new (
    input: PutEmailIdentityDkimSigningAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityDkimSigningAttributesCommandInput,
    PutEmailIdentityDkimSigningAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutEmailIdentityDkimSigningAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutEmailIdentityDkimSigningAttributesCommandInput,
    PutEmailIdentityDkimSigningAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutEmailIdentityDkimSigningAttributesCommand extends PutEmailIdentityDkimSigningAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutEmailIdentityDkimSigningAttributesRequest;
      output: PutEmailIdentityDkimSigningAttributesResponse;
    };
    sdk: {
      input: PutEmailIdentityDkimSigningAttributesCommandInput;
      output: PutEmailIdentityDkimSigningAttributesCommandOutput;
    };
  };
}
