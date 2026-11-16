import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  ListEmailIdentityCertificatesRequest,
  ListEmailIdentityCertificatesResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface ListEmailIdentityCertificatesCommandInput extends ListEmailIdentityCertificatesRequest {}
export interface ListEmailIdentityCertificatesCommandOutput
  extends ListEmailIdentityCertificatesResponse, __MetadataBearer {}
declare const ListEmailIdentityCertificatesCommand_base: {
  new (
    input: ListEmailIdentityCertificatesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListEmailIdentityCertificatesCommandInput,
    ListEmailIdentityCertificatesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: ListEmailIdentityCertificatesCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    ListEmailIdentityCertificatesCommandInput,
    ListEmailIdentityCertificatesCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class ListEmailIdentityCertificatesCommand extends ListEmailIdentityCertificatesCommand_base {
  protected static __types: {
    api: {
      input: ListEmailIdentityCertificatesRequest;
      output: ListEmailIdentityCertificatesResponse;
    };
    sdk: {
      input: ListEmailIdentityCertificatesCommandInput;
      output: ListEmailIdentityCertificatesCommandOutput;
    };
  };
}
