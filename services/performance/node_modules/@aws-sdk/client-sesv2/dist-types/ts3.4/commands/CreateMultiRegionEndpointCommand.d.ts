import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CreateMultiRegionEndpointRequest,
  CreateMultiRegionEndpointResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface CreateMultiRegionEndpointCommandInput extends CreateMultiRegionEndpointRequest {}
export interface CreateMultiRegionEndpointCommandOutput
  extends CreateMultiRegionEndpointResponse, __MetadataBearer {}
declare const CreateMultiRegionEndpointCommand_base: {
  new (
    input: CreateMultiRegionEndpointCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateMultiRegionEndpointCommandInput,
    CreateMultiRegionEndpointCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: CreateMultiRegionEndpointCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    CreateMultiRegionEndpointCommandInput,
    CreateMultiRegionEndpointCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class CreateMultiRegionEndpointCommand extends CreateMultiRegionEndpointCommand_base {
  protected static __types: {
    api: {
      input: CreateMultiRegionEndpointRequest;
      output: CreateMultiRegionEndpointResponse;
    };
    sdk: {
      input: CreateMultiRegionEndpointCommandInput;
      output: CreateMultiRegionEndpointCommandOutput;
    };
  };
}
