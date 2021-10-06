import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './environment-variables.class';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      errors
        .map((error) => {
          const variableErrors = Object.entries(error.constraints)
            .map(([errorKey, message]) => `    [${errorKey}]: ${message}`)
            .join('\n');

          return `\n===============\nVariable: ${error.property} \n${variableErrors}\n===============`;
        })
        .join('\n')
    );
  }

  return validatedConfig;
}
