import { createPaginator } from "@smithy/core";
import { ListEmailIdentityCertificatesCommand, } from "../commands/ListEmailIdentityCertificatesCommand";
import { SESv2Client } from "../SESv2Client";
export const paginateListEmailIdentityCertificates = createPaginator(SESv2Client, ListEmailIdentityCertificatesCommand, "NextToken", "NextToken", "PageSize");
