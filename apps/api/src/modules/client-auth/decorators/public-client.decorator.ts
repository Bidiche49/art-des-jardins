import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_CLIENT_KEY } from '../guards/client-auth.guard';

export const PublicClient = () => SetMetadata(IS_PUBLIC_CLIENT_KEY, true);
