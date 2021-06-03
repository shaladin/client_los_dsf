export class LeaveManagementObj {
  leaveMngmtId: number;
  transactionNo: string;
  empName: string;
  jobPosition: string;
  startDt: Date;
  endDt: Date;
  status: string;
  reason: string;
  verifBy: string;
  taskId: number;
  workingDateTime: any;
  userName: string;

  constructor() { this.leaveMngmtId = 0; }
}
