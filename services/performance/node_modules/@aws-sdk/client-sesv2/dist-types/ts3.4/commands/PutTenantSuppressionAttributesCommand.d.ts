import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutTenantSuppressionAttributesRequest,
  PutTenantSuppressionAttributesResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface PutTenantSuppressionAttributesCommandInput extends PutTenantSuppressionAttributesRequest {}
export interface PutTenantSuppressionAttributesCommandOutput
  extends PutTenantSuppressionAttributesResponse, __MetadataBearer {}
declare const PutTenantSuppressionAttributesCommand_base: {
  new (
    input: PutTenantSuppressionAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutTenantSuppressionAttributesCommandInput,
    PutTenantSuppressionAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: PutTenantSuppressionAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutTenantSuppressionAttributesCommandInput,
    PutTenantSuppressionAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutTenantSuppressionAttributesCommand extends PutTenantSuppressionAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutTenantSuppressionAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutTenantSuppressionAttributesCommandInput;
      output: PutTenantSuppressionAttributesCommandOutput;
    };
  };
}
