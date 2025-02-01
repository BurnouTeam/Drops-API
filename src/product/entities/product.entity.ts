import { Organization } from 'src/organization/entities/organization.entity';

export class Product {
  id: number;
  name: string;
  price: number;
  status: ProductType;
  quantity: number;
  details?: string;
  imageUrl?: string;
  organizationId: number;
  organization: Organization;
}

export class ProductType {
  id: number;
  name: string;
}
