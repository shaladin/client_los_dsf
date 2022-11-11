export class AutoDebitRegistrationObj {
    AutoDebitRegistrationId: number;
    TransactionNo: string;
    AgrmntNo: string;
    BankCode: string;
    Status: string;
    RequestDate: Date;
    TransactionDate?: Date;
    CancellationDate?: Date;
    CancellationReason: string;
    CancellationNotes: string;
    RowVersion: string;
  }