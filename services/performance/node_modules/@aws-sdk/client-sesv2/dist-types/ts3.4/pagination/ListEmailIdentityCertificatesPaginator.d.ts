import { Paginator } from "@smithy/types";
import {
  ListEmailIdentityCertificatesCommandInput,
  ListEmailIdentityCertificatesCommandOutput,
} from "../commands/ListEmailIdentityCertificatesCommand";
import { SESv2PaginationConfiguration } from "./Interfaces";
export declare const paginateListEmailIdentityCertificates: (
  config: SESv2PaginationConfiguration,
  input: ListEmailIdentityCertificatesCommandInput,
  ...rest: any[]
) => Paginator<ListEmailIdentityCertificatesCommandOutput>;
