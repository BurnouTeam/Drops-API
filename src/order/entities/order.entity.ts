import { validateOrReject } from 'class-validator';

export class Order {
  id: number;
  clientId: string;
  organizationId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
    validateOrReject(this);
  }
}

export enum OrderStatus {
  pending = 'pending',
  shipped = 'shipped',
  completed = 'completed',
  recused = 'recused',
}
