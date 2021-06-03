export class RefUserObj {
  refUserId: number;
  username: string;
  password: string;
  isLockedOut: boolean;
  isActive: boolean;
  refEmpId: number;
  newPass: string;
  oldPass: string;
  newPassVerif: any;
  isReset: boolean;
  loggedInMethod: string;

  constructor() { this.refUserId = 0 }
}
