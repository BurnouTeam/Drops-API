import { validateOrReject } from 'class-validator';

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  profilePhoto: string;
  roleId: number;
  organizationId: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    validateOrReject(this);
  }
}
