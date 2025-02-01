export class CreateEventDto {
  eventType: string;
  data: {
    message: string,
    value: any,
  }
}
