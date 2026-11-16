import type { Paginator } from "@smithy/types";
import { ListConfigurationSetsCommandInput, ListConfigurationSetsCommandOutput } from "../commands/ListConfigurationSetsCommand";
import type { SESv2PaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListConfigurationSets: (config: SESv2PaginationConfiguration, input: ListConfigurationSetsCommandInput, ...rest: any[]) => Paginator<ListConfigurationSetsCommandOutput>;
