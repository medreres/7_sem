type Payload = {
  userId: number;
};

export class NewPointTransactionEvent {
  constructor(readonly payload: Payload) {}
}
