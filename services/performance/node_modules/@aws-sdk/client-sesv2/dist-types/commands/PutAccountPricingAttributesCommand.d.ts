import type { MetadataBearer as __MetadataBearer } from "@smithy/types";
import type { PutAccountPricingAttributesRequest, PutAccountPricingAttributesResponse } from "../models/models_0";
/**
 * @public
 */
export type { __MetadataBearer };
/**
 * @public
 *
 * The input for {@link PutAccountPricingAttributesCommand}.
 */
export interface PutAccountPricingAttributesCommandInput extends PutAccountPricingAttributesRequest {
}
/**
 * @public
 *
 * The output of {@link PutAccountPricingAttributesCommand}.
 */
export interface PutAccountPricingAttributesCommandOutput extends PutAccountPricingAttributesResponse, __MetadataBearer {
}
declare const PutAccountPricingAttributesCommand_base: {
    new (input: PutAccountPricingAttributesCommandInput): import("@smithy/core/client").CommandImpl<PutAccountPricingAttributesCommandInput, PutAccountPricingAttributesCommandOutput, import("..").SESv2ClientResolvedConfig, import("..").ServiceInputTypes, import("..").ServiceOutputTypes>;
    new (input: PutAccountPricingAttributesCommandInput): import("@smithy/core/client").CommandImpl<PutAccountPricingAttributesCommandInput, PutAccountPricingAttributesCommandOutput, import("..").SESv2ClientResolvedConfig, import("..").ServiceInputTypes, import("..").ServiceOutputTypes>;
    getEndpointParameterInstructions(): import("@smithy/types").EndpointParameterInstructions;
};
/**
 * <p>Set the pricing plan for your Amazon SES account.</p>
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { SESv2Client, PutAccountPricingAttributesCommand } from "@aws-sdk/client-sesv2"; // ES Modules import
 * // const { SESv2Client, PutAccountPricingAttributesCommand } = require("@aws-sdk/client-sesv2"); // CommonJS import
 * // import type { SESv2ClientConfig } from "@aws-sdk/client-sesv2";
 * const config = {}; // type is SESv2ClientConfig
 * const client = new SESv2Client(config);
 * const input = { // PutAccountPricingAttributesRequest
 *   Plan: "NONE" || "ESSENTIALS" || "PRO" || "ENTERPRISE", // required
 * };
 * const command = new PutAccountPricingAttributesCommand(input);
 * const response = await client.send(command);
 * // {};
 *
 * ```
 *
 * @param PutAccountPricingAttributesCommandInput - {@link PutAccountPricingAttributesCommandInput}
 * @returns {@link PutAccountPricingAttributesCommandOutput}
 * @see {@link PutAccountPricingAttributesCommandInput} for command's `input` shape.
 * @see {@link PutAccountPricingAttributesCommandOutput} for command's `response` shape.
 * @see {@link SESv2ClientResolvedConfig | config} for SESv2Client's `config` shape.
 *
 * @throws {@link BadRequestException} (client fault)
 *  <p>The input you provided is invalid.</p>
 *
 * @throws {@link ConflictException} (client fault)
 *  <p>If there is already an ongoing account details update under review.</p>
 *
 * @throws {@link TooManyRequestsException} (client fault)
 *  <p>Too many requests have been made to the operation.</p>
 *
 * @throws {@link SESv2ServiceException}
 * <p>Base exception class for all service exceptions from SESv2 service.</p>
 *
 *
 * @public
 */
export declare class PutAccountPricingAttributesCommand extends PutAccountPricingAttributesCommand_base {
    /** @internal type navigation helper, not in runtime. */
    protected static __types: {
        api: {
            input: PutAccountPricingAttributesRequest;
            output: {};
        };
        sdk: {
            input: PutAccountPricingAttributesCommandInput;
            output: PutAccountPricingAttributesCommandOutput;
        };
    };
}
