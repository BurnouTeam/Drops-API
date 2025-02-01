import { validateOrReject } from 'class-validator';
import { Organization } from 'src/organization/entities/organization.entity';

export class Client {
  name: string;
  phoneNumber: string;
  email: string;
  profilePhoto?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  country: string;
  organizationId: number;
  organization: Organization;

  constructor(partial: Partial<Client>) {
    Object.assign(this, partial);
    validateOrReject(this);
  }
}
