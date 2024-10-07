import 'dotenv/config';
import * as joi from 'joi';
import { IEnvVarsInterface } from 'src/interfaces/env-vars.interface';

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envsVars: IEnvVarsInterface = value;

export const envs = {
  port: envsVars.PORT,
  stripe_secret: envsVars.STRIPE_SECRET,
  stripe_success_url: envsVars.STRIPE_SUCCESS_URL,
  stripe_cancel_url: envsVars.STRIPE_CANCEL_URL,
  stripe_endpoint_secret: envsVars.STRIPE_ENDPOINT_SECRET,
  natsServers: envsVars.NATS_SERVERS,
};
