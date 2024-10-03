export interface IEnvVarsInterface {
  PORT: number;
  DATABASE_URL: string;

  STRIPE_SECRET: string;

  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;

  STRIPE_ENDPOINT_SECRET: string;
}
