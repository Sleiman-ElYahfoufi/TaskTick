import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_ONLY = 'isAdminOnly';
export const AdminOnly = () => SetMetadata(IS_ADMIN_ONLY, true); 