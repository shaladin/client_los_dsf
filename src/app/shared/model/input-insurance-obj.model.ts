export class InputInsuranceObj {
    AppId: number;
    BizTemplateCode: string;
    ShowCancel: boolean;
    IsMultiAsset: boolean;
    IsReady: boolean;
    
    constructor(){
        this.AppId = 0;
        this.BizTemplateCode = "";
        this.ShowCancel = true;
        this.IsMultiAsset = true;
        this.IsReady = false;
    }
  }