import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  GetDomainDeliverabilityCampaignRequest,
  GetDomainDeliverabilityCampaignResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface GetDomainDeliverabilityCampaignCommandInput extends GetDomainDeliverabilityCampaignRequest {}
export interface GetDomainDeliverabilityCampaignCommandOutput
  extends GetDomainDeliverabilityCampaignResponse, __MetadataBearer {}
declare const GetDomainDeliverabilityCampaignCommand_base: {
  new (
    input: GetDomainDeliverabilityCampaignCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDomainDeliverabilityCampaignCommandInput,
    GetDomainDeliverabilityCampaignCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: GetDomainDeliverabilityCampaignCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    GetDomainDeliverabilityCampaignCommandInput,
    GetDomainDeliverabilityCampaignCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class GetDomainDeliverabilityCampaignCommand extends GetDomainDeliverabilityCampaignCommand_base {
  protected static __types: {
    api: {
      input: GetDomainDeliverabilityCampaignRequest;
      output: GetDomainDeliverabilityCampaignResponse;
    };
    sdk: {
      input: GetDomainDeliverabilityCampaignCommandInput;
      output: GetDomainDeliverabilityCampaignCommandOutput;
    };
  };
}
