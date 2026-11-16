import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  PutAccountSuppressionAttributesRequest,
  PutAccountSuppressionAttributesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface PutAccountSuppressionAttributesCommandInput extends PutAccountSuppressionAttributesRequest {}
export interface PutAccountSuppressionAttributesCommandOutput
  extends PutAccountSuppressionAttributesResponse, __MetadataBearer {}
declare const PutAccountSuppressionAttributesCommand_base: {
  new (
    input: PutAccountSuppressionAttributesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    PutAccountSuppressionAttributesCommandInput,
    PutAccountSuppressionAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [PutAccountSuppressionAttributesCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    PutAccountSuppressionAttributesCommandInput,
    PutAccountSuppressionAttributesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class PutAccountSuppressionAttributesCommand extends PutAccountSuppressionAttributesCommand_base {
  protected static __types: {
    api: {
      input: PutAccountSuppressionAttributesRequest;
      output: {};
    };
    sdk: {
      input: PutAccountSuppressionAttributesCommandInput;
      output: PutAccountSuppressionAttributesCommandOutput;
    };
  };
}
