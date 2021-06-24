export class GeneralSettingObj {
  GeneralSettingId: number;
  GsCode: string;
  GsName: string;
  GsValue: string;
  GsDescr: string;
  RefModuleId: number;
  ModuleCode: string;
  ListGsCode : Array<string>;
  constructor() { this.GeneralSettingId = 0; this.ListGsCode = new Array();}
}
