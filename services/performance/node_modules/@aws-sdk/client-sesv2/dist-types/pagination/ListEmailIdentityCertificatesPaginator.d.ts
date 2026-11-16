import type { Paginator } from "@smithy/types";
import { ListEmailIdentityCertificatesCommandInput, ListEmailIdentityCertificatesCommandOutput } from "../commands/ListEmailIdentityCertificatesCommand";
import type { SESv2PaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListEmailIdentityCertificates: (config: SESv2PaginationConfiguration, input: ListEmailIdentityCertificatesCommandInput, ...rest: any[]) => Paginator<ListEmailIdentityCertificatesCommandOutput>;
