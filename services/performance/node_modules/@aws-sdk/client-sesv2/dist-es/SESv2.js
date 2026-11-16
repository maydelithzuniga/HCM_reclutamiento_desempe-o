import { createAggregatedClient } from "@smithy/core/client";
import { AssociateEmailIdentityCertificateCommand, } from "./commands/AssociateEmailIdentityCertificateCommand";
import { BatchGetMetricDataCommand, } from "./commands/BatchGetMetricDataCommand";
import { CancelExportJobCommand, } from "./commands/CancelExportJobCommand";
import { CreateConfigurationSetCommand, } from "./commands/CreateConfigurationSetCommand";
import { CreateConfigurationSetEventDestinationCommand, } from "./commands/CreateConfigurationSetEventDestinationCommand";
import { CreateContactCommand, } from "./commands/CreateContactCommand";
import { CreateContactListCommand, } from "./commands/CreateContactListCommand";
import { CreateCustomVerificationEmailTemplateCommand, } from "./commands/CreateCustomVerificationEmailTemplateCommand";
import { CreateDedicatedIpPoolCommand, } from "./commands/CreateDedicatedIpPoolCommand";
import { CreateDeliverabilityTestReportCommand, } from "./commands/CreateDeliverabilityTestReportCommand";
import { CreateEmailIdentityCommand, } from "./commands/CreateEmailIdentityCommand";
import { CreateEmailIdentityPolicyCommand, } from "./commands/CreateEmailIdentityPolicyCommand";
import { CreateEmailTemplateCommand, } from "./commands/CreateEmailTemplateCommand";
import { CreateExportJobCommand, } from "./commands/CreateExportJobCommand";
import { CreateImportJobCommand, } from "./commands/CreateImportJobCommand";
import { CreateMultiRegionEndpointCommand, } from "./commands/CreateMultiRegionEndpointCommand";
import { CreateTenantCommand, } from "./commands/CreateTenantCommand";
import { CreateTenantResourceAssociationCommand, } from "./commands/CreateTenantResourceAssociationCommand";
import { DeleteConfigurationSetCommand, } from "./commands/DeleteConfigurationSetCommand";
import { DeleteConfigurationSetEventDestinationCommand, } from "./commands/DeleteConfigurationSetEventDestinationCommand";
import { DeleteContactCommand, } from "./commands/DeleteContactCommand";
import { DeleteContactListCommand, } from "./commands/DeleteContactListCommand";
import { DeleteCustomVerificationEmailTemplateCommand, } from "./commands/DeleteCustomVerificationEmailTemplateCommand";
import { DeleteDedicatedIpPoolCommand, } from "./commands/DeleteDedicatedIpPoolCommand";
import { DeleteEmailIdentityCommand, } from "./commands/DeleteEmailIdentityCommand";
import { DeleteEmailIdentityPolicyCommand, } from "./commands/DeleteEmailIdentityPolicyCommand";
import { DeleteEmailTemplateCommand, } from "./commands/DeleteEmailTemplateCommand";
import { DeleteMultiRegionEndpointCommand, } from "./commands/DeleteMultiRegionEndpointCommand";
import { DeleteSuppressedDestinationCommand, } from "./commands/DeleteSuppressedDestinationCommand";
import { DeleteTenantCommand, } from "./commands/DeleteTenantCommand";
import { DeleteTenantResourceAssociationCommand, } from "./commands/DeleteTenantResourceAssociationCommand";
import { DisassociateEmailIdentityCertificateCommand, } from "./commands/DisassociateEmailIdentityCertificateCommand";
import { GetAccountCommand, } from "./commands/GetAccountCommand";
import { GetBlacklistReportsCommand, } from "./commands/GetBlacklistReportsCommand";
import { GetConfigurationSetCommand, } from "./commands/GetConfigurationSetCommand";
import { GetConfigurationSetEventDestinationsCommand, } from "./commands/GetConfigurationSetEventDestinationsCommand";
import { GetContactCommand, } from "./commands/GetContactCommand";
import { GetContactListCommand, } from "./commands/GetContactListCommand";
import { GetCustomVerificationEmailTemplateCommand, } from "./commands/GetCustomVerificationEmailTemplateCommand";
import { GetDedicatedIpCommand, } from "./commands/GetDedicatedIpCommand";
import { GetDedicatedIpPoolCommand, } from "./commands/GetDedicatedIpPoolCommand";
import { GetDedicatedIpsCommand, } from "./commands/GetDedicatedIpsCommand";
import { GetDeliverabilityDashboardOptionsCommand, } from "./commands/GetDeliverabilityDashboardOptionsCommand";
import { GetDeliverabilityTestReportCommand, } from "./commands/GetDeliverabilityTestReportCommand";
import { GetDomainDeliverabilityCampaignCommand, } from "./commands/GetDomainDeliverabilityCampaignCommand";
import { GetDomainStatisticsReportCommand, } from "./commands/GetDomainStatisticsReportCommand";
import { GetEmailAddressInsightsCommand, } from "./commands/GetEmailAddressInsightsCommand";
import { GetEmailIdentityCommand, } from "./commands/GetEmailIdentityCommand";
import { GetEmailIdentityPoliciesCommand, } from "./commands/GetEmailIdentityPoliciesCommand";
import { GetEmailTemplateCommand, } from "./commands/GetEmailTemplateCommand";
import { GetExportJobCommand, } from "./commands/GetExportJobCommand";
import { GetImportJobCommand, } from "./commands/GetImportJobCommand";
import { GetMessageInsightsCommand, } from "./commands/GetMessageInsightsCommand";
import { GetMultiRegionEndpointCommand, } from "./commands/GetMultiRegionEndpointCommand";
import { GetReputationEntityCommand, } from "./commands/GetReputationEntityCommand";
import { GetSuppressedDestinationCommand, } from "./commands/GetSuppressedDestinationCommand";
import { GetTenantCommand } from "./commands/GetTenantCommand";
import { ListConfigurationSetsCommand, } from "./commands/ListConfigurationSetsCommand";
import { ListContactListsCommand, } from "./commands/ListContactListsCommand";
import { ListContactsCommand, } from "./commands/ListContactsCommand";
import { ListCustomVerificationEmailTemplatesCommand, } from "./commands/ListCustomVerificationEmailTemplatesCommand";
import { ListDedicatedIpPoolsCommand, } from "./commands/ListDedicatedIpPoolsCommand";
import { ListDeliverabilityTestReportsCommand, } from "./commands/ListDeliverabilityTestReportsCommand";
import { ListDomainDeliverabilityCampaignsCommand, } from "./commands/ListDomainDeliverabilityCampaignsCommand";
import { ListEmailIdentitiesCommand, } from "./commands/ListEmailIdentitiesCommand";
import { ListEmailIdentityCertificatesCommand, } from "./commands/ListEmailIdentityCertificatesCommand";
import { ListEmailTemplatesCommand, } from "./commands/ListEmailTemplatesCommand";
import { ListExportJobsCommand, } from "./commands/ListExportJobsCommand";
import { ListImportJobsCommand, } from "./commands/ListImportJobsCommand";
import { ListMultiRegionEndpointsCommand, } from "./commands/ListMultiRegionEndpointsCommand";
import { ListRecommendationsCommand, } from "./commands/ListRecommendationsCommand";
import { ListReputationEntitiesCommand, } from "./commands/ListReputationEntitiesCommand";
import { ListResourceTenantsCommand, } from "./commands/ListResourceTenantsCommand";
import { ListSuppressedDestinationsCommand, } from "./commands/ListSuppressedDestinationsCommand";
import { ListTagsForResourceCommand, } from "./commands/ListTagsForResourceCommand";
import { ListTenantResourcesCommand, } from "./commands/ListTenantResourcesCommand";
import { ListTenantsCommand, } from "./commands/ListTenantsCommand";
import { PutAccountDedicatedIpWarmupAttributesCommand, } from "./commands/PutAccountDedicatedIpWarmupAttributesCommand";
import { PutAccountDetailsCommand, } from "./commands/PutAccountDetailsCommand";
import { PutAccountPricingAttributesCommand, } from "./commands/PutAccountPricingAttributesCommand";
import { PutAccountSendingAttributesCommand, } from "./commands/PutAccountSendingAttributesCommand";
import { PutAccountSuppressionAttributesCommand, } from "./commands/PutAccountSuppressionAttributesCommand";
import { PutAccountVdmAttributesCommand, } from "./commands/PutAccountVdmAttributesCommand";
import { PutConfigurationSetArchivingOptionsCommand, } from "./commands/PutConfigurationSetArchivingOptionsCommand";
import { PutConfigurationSetDeliveryOptionsCommand, } from "./commands/PutConfigurationSetDeliveryOptionsCommand";
import { PutConfigurationSetReputationOptionsCommand, } from "./commands/PutConfigurationSetReputationOptionsCommand";
import { PutConfigurationSetSendingOptionsCommand, } from "./commands/PutConfigurationSetSendingOptionsCommand";
import { PutConfigurationSetSuppressionOptionsCommand, } from "./commands/PutConfigurationSetSuppressionOptionsCommand";
import { PutConfigurationSetTrackingOptionsCommand, } from "./commands/PutConfigurationSetTrackingOptionsCommand";
import { PutConfigurationSetVdmOptionsCommand, } from "./commands/PutConfigurationSetVdmOptionsCommand";
import { PutDedicatedIpInPoolCommand, } from "./commands/PutDedicatedIpInPoolCommand";
import { PutDedicatedIpPoolScalingAttributesCommand, } from "./commands/PutDedicatedIpPoolScalingAttributesCommand";
import { PutDedicatedIpWarmupAttributesCommand, } from "./commands/PutDedicatedIpWarmupAttributesCommand";
import { PutDeliverabilityDashboardOptionCommand, } from "./commands/PutDeliverabilityDashboardOptionCommand";
import { PutEmailIdentityConfigurationSetAttributesCommand, } from "./commands/PutEmailIdentityConfigurationSetAttributesCommand";
import { PutEmailIdentityDkimAttributesCommand, } from "./commands/PutEmailIdentityDkimAttributesCommand";
import { PutEmailIdentityDkimSigningAttributesCommand, } from "./commands/PutEmailIdentityDkimSigningAttributesCommand";
import { PutEmailIdentityFeedbackAttributesCommand, } from "./commands/PutEmailIdentityFeedbackAttributesCommand";
import { PutEmailIdentityMailFromAttributesCommand, } from "./commands/PutEmailIdentityMailFromAttributesCommand";
import { PutSuppressedDestinationCommand, } from "./commands/PutSuppressedDestinationCommand";
import { PutTenantSuppressionAttributesCommand, } from "./commands/PutTenantSuppressionAttributesCommand";
import { SendBulkEmailCommand, } from "./commands/SendBulkEmailCommand";
import { SendCustomVerificationEmailCommand, } from "./commands/SendCustomVerificationEmailCommand";
import { SendEmailCommand } from "./commands/SendEmailCommand";
import { TagResourceCommand, } from "./commands/TagResourceCommand";
import { TestRenderEmailTemplateCommand, } from "./commands/TestRenderEmailTemplateCommand";
import { UntagResourceCommand, } from "./commands/UntagResourceCommand";
import { UpdateConfigurationSetCommand, } from "./commands/UpdateConfigurationSetCommand";
import { UpdateConfigurationSetEventDestinationCommand, } from "./commands/UpdateConfigurationSetEventDestinationCommand";
import { UpdateContactCommand, } from "./commands/UpdateContactCommand";
import { UpdateContactListCommand, } from "./commands/UpdateContactListCommand";
import { UpdateCustomVerificationEmailTemplateCommand, } from "./commands/UpdateCustomVerificationEmailTemplateCommand";
import { UpdateEmailIdentityPolicyCommand, } from "./commands/UpdateEmailIdentityPolicyCommand";
import { UpdateEmailTemplateCommand, } from "./commands/UpdateEmailTemplateCommand";
import { UpdateReputationEntityCustomerManagedStatusCommand, } from "./commands/UpdateReputationEntityCustomerManagedStatusCommand";
import { UpdateReputationEntityPolicyCommand, } from "./commands/UpdateReputationEntityPolicyCommand";
import { paginateGetDedicatedIps } from "./pagination/GetDedicatedIpsPaginator";
import { paginateListConfigurationSets } from "./pagination/ListConfigurationSetsPaginator";
import { paginateListContactLists } from "./pagination/ListContactListsPaginator";
import { paginateListContacts } from "./pagination/ListContactsPaginator";
import { paginateListCustomVerificationEmailTemplates, } from "./pagination/ListCustomVerificationEmailTemplatesPaginator";
import { paginateListDedicatedIpPools } from "./pagination/ListDedicatedIpPoolsPaginator";
import { paginateListDeliverabilityTestReports } from "./pagination/ListDeliverabilityTestReportsPaginator";
import { paginateListDomainDeliverabilityCampaigns } from "./pagination/ListDomainDeliverabilityCampaignsPaginator";
import { paginateListEmailIdentities } from "./pagination/ListEmailIdentitiesPaginator";
import { paginateListEmailIdentityCertificates } from "./pagination/ListEmailIdentityCertificatesPaginator";
import { paginateListEmailTemplates } from "./pagination/ListEmailTemplatesPaginator";
import { paginateListExportJobs } from "./pagination/ListExportJobsPaginator";
import { paginateListImportJobs } from "./pagination/ListImportJobsPaginator";
import { paginateListMultiRegionEndpoints } from "./pagination/ListMultiRegionEndpointsPaginator";
import { paginateListRecommendations } from "./pagination/ListRecommendationsPaginator";
import { paginateListReputationEntities } from "./pagination/ListReputationEntitiesPaginator";
import { paginateListResourceTenants } from "./pagination/ListResourceTenantsPaginator";
import { paginateListSuppressedDestinations } from "./pagination/ListSuppressedDestinationsPaginator";
import { paginateListTenantResources } from "./pagination/ListTenantResourcesPaginator";
import { paginateListTenants } from "./pagination/ListTenantsPaginator";
import { SESv2Client } from "./SESv2Client";
const commands = {
    AssociateEmailIdentityCertificateCommand,
    BatchGetMetricDataCommand,
    CancelExportJobCommand,
    CreateConfigurationSetCommand,
    CreateConfigurationSetEventDestinationCommand,
    CreateContactCommand,
    CreateContactListCommand,
    CreateCustomVerificationEmailTemplateCommand,
    CreateDedicatedIpPoolCommand,
    CreateDeliverabilityTestReportCommand,
    CreateEmailIdentityCommand,
    CreateEmailIdentityPolicyCommand,
    CreateEmailTemplateCommand,
    CreateExportJobCommand,
    CreateImportJobCommand,
    CreateMultiRegionEndpointCommand,
    CreateTenantCommand,
    CreateTenantResourceAssociationCommand,
    DeleteConfigurationSetCommand,
    DeleteConfigurationSetEventDestinationCommand,
    DeleteContactCommand,
    DeleteContactListCommand,
    DeleteCustomVerificationEmailTemplateCommand,
    DeleteDedicatedIpPoolCommand,
    DeleteEmailIdentityCommand,
    DeleteEmailIdentityPolicyCommand,
    DeleteEmailTemplateCommand,
    DeleteMultiRegionEndpointCommand,
    DeleteSuppressedDestinationCommand,
    DeleteTenantCommand,
    DeleteTenantResourceAssociationCommand,
    DisassociateEmailIdentityCertificateCommand,
    GetAccountCommand,
    GetBlacklistReportsCommand,
    GetConfigurationSetCommand,
    GetConfigurationSetEventDestinationsCommand,
    GetContactCommand,
    GetContactListCommand,
    GetCustomVerificationEmailTemplateCommand,
    GetDedicatedIpCommand,
    GetDedicatedIpPoolCommand,
    GetDedicatedIpsCommand,
    GetDeliverabilityDashboardOptionsCommand,
    GetDeliverabilityTestReportCommand,
    GetDomainDeliverabilityCampaignCommand,
    GetDomainStatisticsReportCommand,
    GetEmailAddressInsightsCommand,
    GetEmailIdentityCommand,
    GetEmailIdentityPoliciesCommand,
    GetEmailTemplateCommand,
    GetExportJobCommand,
    GetImportJobCommand,
    GetMessageInsightsCommand,
    GetMultiRegionEndpointCommand,
    GetReputationEntityCommand,
    GetSuppressedDestinationCommand,
    GetTenantCommand,
    ListConfigurationSetsCommand,
    ListContactListsCommand,
    ListContactsCommand,
    ListCustomVerificationEmailTemplatesCommand,
    ListDedicatedIpPoolsCommand,
    ListDeliverabilityTestReportsCommand,
    ListDomainDeliverabilityCampaignsCommand,
    ListEmailIdentitiesCommand,
    ListEmailIdentityCertificatesCommand,
    ListEmailTemplatesCommand,
    ListExportJobsCommand,
    ListImportJobsCommand,
    ListMultiRegionEndpointsCommand,
    ListRecommendationsCommand,
    ListReputationEntitiesCommand,
    ListResourceTenantsCommand,
    ListSuppressedDestinationsCommand,
    ListTagsForResourceCommand,
    ListTenantResourcesCommand,
    ListTenantsCommand,
    PutAccountDedicatedIpWarmupAttributesCommand,
    PutAccountDetailsCommand,
    PutAccountPricingAttributesCommand,
    PutAccountSendingAttributesCommand,
    PutAccountSuppressionAttributesCommand,
    PutAccountVdmAttributesCommand,
    PutConfigurationSetArchivingOptionsCommand,
    PutConfigurationSetDeliveryOptionsCommand,
    PutConfigurationSetReputationOptionsCommand,
    PutConfigurationSetSendingOptionsCommand,
    PutConfigurationSetSuppressionOptionsCommand,
    PutConfigurationSetTrackingOptionsCommand,
    PutConfigurationSetVdmOptionsCommand,
    PutDedicatedIpInPoolCommand,
    PutDedicatedIpPoolScalingAttributesCommand,
    PutDedicatedIpWarmupAttributesCommand,
    PutDeliverabilityDashboardOptionCommand,
    PutEmailIdentityConfigurationSetAttributesCommand,
    PutEmailIdentityDkimAttributesCommand,
    PutEmailIdentityDkimSigningAttributesCommand,
    PutEmailIdentityFeedbackAttributesCommand,
    PutEmailIdentityMailFromAttributesCommand,
    PutSuppressedDestinationCommand,
    PutTenantSuppressionAttributesCommand,
    SendBulkEmailCommand,
    SendCustomVerificationEmailCommand,
    SendEmailCommand,
    TagResourceCommand,
    TestRenderEmailTemplateCommand,
    UntagResourceCommand,
    UpdateConfigurationSetCommand,
    UpdateConfigurationSetEventDestinationCommand,
    UpdateContactCommand,
    UpdateContactListCommand,
    UpdateCustomVerificationEmailTemplateCommand,
    UpdateEmailIdentityPolicyCommand,
    UpdateEmailTemplateCommand,
    UpdateReputationEntityCustomerManagedStatusCommand,
    UpdateReputationEntityPolicyCommand,
};
const paginators = {
    paginateGetDedicatedIps,
    paginateListConfigurationSets,
    paginateListContactLists,
    paginateListContacts,
    paginateListCustomVerificationEmailTemplates,
    paginateListDedicatedIpPools,
    paginateListDeliverabilityTestReports,
    paginateListDomainDeliverabilityCampaigns,
    paginateListEmailIdentities,
    paginateListEmailIdentityCertificates,
    paginateListEmailTemplates,
    paginateListExportJobs,
    paginateListImportJobs,
    paginateListMultiRegionEndpoints,
    paginateListRecommendations,
    paginateListReputationEntities,
    paginateListResourceTenants,
    paginateListSuppressedDestinations,
    paginateListTenantResources,
    paginateListTenants,
};
export class SESv2 extends SESv2Client {
}
createAggregatedClient(commands, SESv2, { paginators });
