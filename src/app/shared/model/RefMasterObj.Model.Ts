export class RefMasterObj {
    RefMasterId: number;
    MasterCode: string;
    Descr: string;
    RefMasterTypeCode: string;
    SeqNo: number;
    ReserveField1 : string;
    ReserveField2 : string;
    ReserveField3 : string;
    ReserveField4 : string;
    ReserveField5 : string;
    MappingCode : string;
    DefaultValue : string;
    IsDefaultValue : boolean;
    IsDeletable: boolean;
    isSystem: boolean;
    IsActive: boolean;
    RowVersion: string;
    constructor() { this.RefMasterId = 0; this.RowVersion = '' }
}