import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  DeleteMultiRegionEndpointRequest,
  DeleteMultiRegionEndpointResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface DeleteMultiRegionEndpointCommandInput extends DeleteMultiRegionEndpointRequest {}
export interface DeleteMultiRegionEndpointCommandOutput
  extends DeleteMultiRegionEndpointResponse, __MetadataBearer {}
declare const DeleteMultiRegionEndpointCommand_base: {
  new (
    input: DeleteMultiRegionEndpointCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteMultiRegionEndpointCommandInput,
    DeleteMultiRegionEndpointCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DeleteMultiRegionEndpointCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DeleteMultiRegionEndpointCommandInput,
    DeleteMultiRegionEndpointCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DeleteMultiRegionEndpointCommand extends DeleteMultiRegionEndpointCommand_base {
  protected static __types: {
    api: {
      input: DeleteMultiRegionEndpointRequest;
      output: DeleteMultiRegionEndpointResponse;
    };
    sdk: {
      input: DeleteMultiRegionEndpointCommandInput;
      output: DeleteMultiRegionEndpointCommandOutput;
    };
  };
}
