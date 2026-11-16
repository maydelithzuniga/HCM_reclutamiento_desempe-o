import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  TestRenderEmailTemplateRequest,
  TestRenderEmailTemplateResponse,
} from "../models/models_1";
export { __MetadataBearer };
export interface TestRenderEmailTemplateCommandInput extends TestRenderEmailTemplateRequest {}
export interface TestRenderEmailTemplateCommandOutput
  extends TestRenderEmailTemplateResponse, __MetadataBearer {}
declare const TestRenderEmailTemplateCommand_base: {
  new (
    input: TestRenderEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    TestRenderEmailTemplateCommandInput,
    TestRenderEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  new (
    input: TestRenderEmailTemplateCommandInput,
  ): import("@smithy/core/client").CommandImpl<
    TestRenderEmailTemplateCommandInput,
    TestRenderEmailTemplateCommandOutput,
    import("..").SESv2ClientResolvedConfig,
    import("..").ServiceInputTypes,
    import("..").ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
export declare class TestRenderEmailTemplateCommand extends TestRenderEmailTemplateCommand_base {
  protected static __types: {
    api: {
      input: TestRenderEmailTemplateRequest;
      output: TestRenderEmailTemplateResponse;
    };
    sdk: {
      input: TestRenderEmailTemplateCommandInput;
      output: TestRenderEmailTemplateCommandOutput;
    };
  };
}
