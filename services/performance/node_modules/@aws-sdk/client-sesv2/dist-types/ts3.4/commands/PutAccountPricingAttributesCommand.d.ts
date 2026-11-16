import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutAccountPricingAttributesRequest,
  PutAccountPricingAttributesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutAccountPricingAttributesCommandInput extends PutAccountPricingAttributesRequest {}
export interface PutAccountPricingAttributesCommandOutput
  extends PutAccountPricingAttributesResponse, __MetadataBearer {}
declare const PutAccountPricingAttributesCommand_base: {
  new (
    input: PutAccountPricingAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutAccountPricingAttributesCommandInput,
    PutAccountPricingAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutAccountPricingAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutAccountPricingAttributesCommandInput,
    PutAccountPricingAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutAccountPricingAttributesCommand extends PutAccountPricingAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutAccountPricingAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutAccountPricingAttributesCommandInput;
      output: PutAccountPricingAttributesCommandOutput;
    };
  };
}
