import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  DisassociateEmailIdentityCertificateRequest,
  DisassociateEmailIdentityCertificateResponse,
} from "../models/models_0";
export { __MetadataBearer };
export interface DisassociateEmailIdentityCertificateCommandInput extends DisassociateEmailIdentityCertificateRequest {}
export interface DisassociateEmailIdentityCertificateCommandOutput
  extends DisassociateEmailIdentityCertificateResponse, __MetadataBearer {}
declare const DisassociateEmailIdentityCertificateCommand_base: {
  new (
    input: DisassociateEmailIdentityCertificateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DisassociateEmailIdentityCertificateCommandInput,
    DisassociateEmailIdentityCertificateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: DisassociateEmailIdentityCertificateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    DisassociateEmailIdentityCertificateCommandInput,
    DisassociateEmailIdentityCertificateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class DisassociateEmailIdentityCertificateCommand extends DisassociateEmailIdentityCertificateCommand_base {
  protected static __types: {
    api: {
      input: DisassociateEmailIdentityCertificateRequest;
      output: {};
    };
    sdk: {
      input: DisassociateEmailIdentityCertificateCommandInput;
      output: DisassociateEmailIdentityCertificateCommandOutput;
    };
  };
}
