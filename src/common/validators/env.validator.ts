import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  API_KEY: string;

  @IsString()
  @IsNotEmpty()
  API_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  API_VERSION: string;

  @IsString()
  @IsNotEmpty()
  API_LANGUAGE: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
