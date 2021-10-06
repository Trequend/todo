import { validate } from './env.validation';
import { ConnectionProtocol, Environment } from './environment-variables.class';

export const configuration = () => {
  const environment = validate(process.env);

  if (environment.NODE_ENV === Environment.Production) {
    if (!environment.SESSION_SECRET) {
      throw new Error('SESSION_SECRET required in production mode');
    }
  }

  return {
    isProduction: environment.NODE_ENV === Environment.Production,
    port: environment.PORT || 8000,
    sessionMaxAge: environment.SESSION_MAX_AGE || 24 * 60 * 60 * 1000, // ONE DAY
    mongoUrl: environment.MONGO_URL || 'mongodb://localhost:27017/nest',
    isHttpsConnection:
      environment.CONNECTION_PROTOCOL === ConnectionProtocol.Https,
    sessionSecret:
      environment.SESSION_SECRET ||
      'DEV-SECRET:fdaguhiclkjasfbwqidinasjbcnizxncgauycgqucwancahsgyabgudnwudzhsgcfsafkaklsuysagbuycngwc',
  };
};

export type Config = ReturnType<typeof configuration>;
