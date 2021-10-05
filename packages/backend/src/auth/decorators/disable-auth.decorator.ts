import { SetMetadata } from '@nestjs/common';
import { AUTH_DISABLED } from '../constants';

export const DisableAuth = () => SetMetadata(AUTH_DISABLED, true);
