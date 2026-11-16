import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListReputationEntitiesRequest, ListReputationEntitiesResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListReputationEntitiesCommandInput extends ListReputationEntitiesRequest {}
export interface ListReputationEntitiesCommandOutput
  extends ListReputationEntitiesResponse, __MetadataBearer {}
declare const ListReputationEntitiesCommand_base: {
  new (
    input: ListReputationEntitiesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListReputationEntitiesCommandInput,
    ListReputationEntitiesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListReputationEntitiesCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListReputationEntitiesCommandInput,
    ListReputationEntitiesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListReputationEntitiesCommand extends ListReputationEntitiesCommand_base {
  protected static __types: {
    api: {
      input: ListReputationEntitiesRequest;
      output: ListReputationEntitiesResponse;
    };
    sdk: {
      input: ListReputationEntitiesCommandInput;
      output: ListReputationEntitiesCommandOutput;
    };
  };
}
