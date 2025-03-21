import { ResolveFn } from "@angular/router";
import { EmailConfig, LdapConfig } from "../models/data";
import { inject } from "@angular/core";
import { ConfigsService } from "../services";


/**
 * Resolves the email configuration.
 *
 * @returns A promise of the email configuration.
 */
export const getEmailConfigResolver: ResolveFn<EmailConfig> = () => inject(ConfigsService).getEmail();

export const getLdapConfigResolver: ResolveFn<LdapConfig> = () => inject(ConfigsService).getLdap();
