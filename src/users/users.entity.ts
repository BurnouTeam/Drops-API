export class User {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  refreshToken: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
