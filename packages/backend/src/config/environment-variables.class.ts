import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export enum ConnectionProtocol {
  Http = 'http',
  Https = 'https',
}

function getEnumValues(target: Record<string, unknown>) {
  return Object.values(target).join(', ');
}

export class EnvironmentVariables {
  @IsEnum(Environment, {
    message: `Available values: ${getEnumValues(Environment)}`,
  })
  @IsOptional()
  NODE_ENV?: Environment;

  @Min(1)
  @Max(65535)
  @IsInt()
  @IsOptional()
  PORT?: number;

  @IsEnum(ConnectionProtocol, {
    message: `Available values: ${getEnumValues(ConnectionProtocol)}`,
  })
  @IsOptional()
  CONNECTION_PROTOCOL?: ConnectionProtocol;

  @IsString()
  @IsOptional()
  MONGO_URL?: string;

  @IsString()
  @IsOptional()
  MONGO_DB_NAME?: string;

  @Min(1)
  @IsInt()
  @IsOptional()
  SESSION_MAX_AGE?: number;

  @MinLength(32)
  @IsString()
  @IsOptional()
  SESSION_SECRET?: string;
}
