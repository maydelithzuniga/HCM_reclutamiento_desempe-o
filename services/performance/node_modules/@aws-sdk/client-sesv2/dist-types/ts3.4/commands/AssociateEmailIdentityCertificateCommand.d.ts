import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  AssociateEmailIdentityCertificateRequest,
  AssociateEmailIdentityCertificateResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface AssociateEmailIdentityCertificateCommandInput extends AssociateEmailIdentityCertificateRequest {}
export interface AssociateEmailIdentityCertificateCommandOutput
  extends AssociateEmailIdentityCertificateResponse, __MetadataBearer {}
declare const AssociateEmailIdentityCertificateCommand_base: {
  new (
    input: AssociateEmailIdentityCertificateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    AssociateEmailIdentityCertificateCommandInput,
    AssociateEmailIdentityCertificateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: AssociateEmailIdentityCertificateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    AssociateEmailIdentityCertificateCommandInput,
    AssociateEmailIdentityCertificateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class AssociateEmailIdentityCertificateCommand extends AssociateEmailIdentityCertificateCommand_base {
  protected static __types: {
    api: {
      input: AssociateEmailIdentityCertificateRequest;
      output: {};
    };
    sdk: {
      input: AssociateEmailIdentityCertificateCommandInput;
      output: AssociateEmailIdentityCertificateCommandOutput;
    };
  };
}
