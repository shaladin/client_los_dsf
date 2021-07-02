export class RefUserObj {
  RefUserId: number;
  Username: string;
  password: string;
  isLockedOut: boolean;
  isActive: boolean;
  refEmpId: number;
  newPass: string;
  oldPass: string;
  newPassVerif: any;
  isReset: boolean;
  loggedInMethod: string;

  constructor() { this.RefUserId = 0 }
}
