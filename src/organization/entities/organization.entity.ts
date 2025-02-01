import { validateOrReject } from 'class-validator';
import { Client } from 'src/client/entities/client.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/users.entity';

export class Organization {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  profilePhoto?: string;
  users: User[];
  clients: Client[];
  products: Product[];
  orders: Order[];
  // roles: Role[];
  // messages: Message[];

  constructor(partial: Partial<Organization>) {
    Object.assign(this, partial);
    validateOrReject(this);
  }
}
