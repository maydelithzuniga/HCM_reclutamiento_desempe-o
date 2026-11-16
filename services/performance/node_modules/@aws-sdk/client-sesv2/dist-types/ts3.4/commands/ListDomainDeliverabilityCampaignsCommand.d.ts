import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListDomainDeliverabilityCampaignsRequest,
  ListDomainDeliverabilityCampaignsResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface ListDomainDeliverabilityCampaignsCommandInput extends ListDomainDeliverabilityCampaignsRequest {}
export interface ListDomainDeliverabilityCampaignsCommandOutput
  extends ListDomainDeliverabilityCampaignsResponse, __MetadataBearer {}
declare const ListDomainDeliverabilityCampaignsCommand_base: {
  new (
    input: ListDomainDeliverabilityCampaignsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListDomainDeliverabilityCampaignsCommandInput,
    ListDomainDeliverabilityCampaignsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListDomainDeliverabilityCampaignsCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListDomainDeliverabilityCampaignsCommandInput,
    ListDomainDeliverabilityCampaignsCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListDomainDeliverabilityCampaignsCommand extends ListDomainDeliverabilityCampaignsCommand_base {
  protected static __types: {
    api: {
      input: ListDomainDeliverabilityCampaignsRequest;
      output: ListDomainDeliverabilityCampaignsResponse;
    };
    sdk: {
      input: ListDomainDeliverabilityCampaignsCommandInput;
      output: ListDomainDeliverabilityCampaignsCommandOutput;
    };
  };
}
