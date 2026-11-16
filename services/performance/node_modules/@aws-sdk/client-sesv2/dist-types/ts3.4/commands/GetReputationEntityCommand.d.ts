import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { GetReputationEntityRequest, GetReputationEntityResponse } from "../models/models_0";
export { __MetadataBearer };
export interface GetReputationEntityCommandInput extends GetReputationEntityRequest {}
export interface GetReputationEntityCommandOutput
  extends GetReputationEntityResponse, __MetadataBearer {}
declare const GetReputationEntityCommand_base: {
  new (
    input: GetReputationEntityCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetReputationEntityCommandInput,
    GetReputationEntityCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetReputationEntityCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetReputationEntityCommandInput,
    GetReputationEntityCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetReputationEntityCommand extends GetReputationEntityCommand_base {
  protected static __types: {
    api: {
      input: GetReputationEntityRequest;
      output: GetReputationEntityResponse;
    };
    sdk: {
      input: GetReputationEntityCommandInput;
      output: GetReputationEntityCommandOutput;
    };
  };
}
