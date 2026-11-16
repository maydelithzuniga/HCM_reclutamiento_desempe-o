import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { ListEmailIdentitiesRequest, ListEmailIdentitiesResponse } from "../models/models_0";
export { __MetadataBearer };
export interface ListEmailIdentitiesCommandInput extends ListEmailIdentitiesRequest {}
export interface ListEmailIdentitiesCommandOutput
  extends ListEmailIdentitiesResponse, __MetadataBearer {}
declare const ListEmailIdentitiesCommand_base: {
  new (
    input: ListEmailIdentitiesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListEmailIdentitiesCommandInput,
    ListEmailIdentitiesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListEmailIdentitiesCommandInput]
  ): import("@smithy/core/client").CommandImpl<
    ListEmailIdentitiesCommandInput,
    ListEmailIdentitiesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListEmailIdentitiesCommand extends ListEmailIdentitiesCommand_base {
  protected static __types: {
    api: {
      input: ListEmailIdentitiesRequest;
      output: ListEmailIdentitiesResponse;
    };
    sdk: {
      input: ListEmailIdentitiesCommandInput;
      output: ListEmailIdentitiesCommandOutput;
    };
  };
}
