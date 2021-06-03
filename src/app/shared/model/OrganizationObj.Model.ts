export class OrganizationObj {
  refOrgId: number;
  orgName: string;
  hierarchyNo: string;
  isActive: boolean;
  parentId: number;
  oldParentId: number;

  constructor() { this.refOrgId = 0; }
}
