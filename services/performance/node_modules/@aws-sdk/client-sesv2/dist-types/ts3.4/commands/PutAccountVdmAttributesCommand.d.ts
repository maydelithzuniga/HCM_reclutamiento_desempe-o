import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutAccountVdmAttributesRequest,
  PutAccountVdmAttributesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutAccountVdmAttributesCommandInput extends PutAccountVdmAttributesRequest {}
export interface PutAccountVdmAttributesCommandOutput
  extends PutAccountVdmAttributesResponse, __MetadataBearer {}
declare const PutAccountVdmAttributesCommand_base: {
  new (
    input: PutAccountVdmAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutAccountVdmAttributesCommandInput,
    PutAccountVdmAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutAccountVdmAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutAccountVdmAttributesCommandInput,
    PutAccountVdmAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutAccountVdmAttributesCommand extends PutAccountVdmAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutAccountVdmAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutAccountVdmAttributesCommandInput;
      output: PutAccountVdmAttributesCommandOutput;
    };
  };
}
