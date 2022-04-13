export class InputInsuranceObj {
    AppId: number;
    ShowCancel: boolean;
    IsMultiAsset: boolean;
    IsReady: boolean;
    
    constructor(){
        this.AppId = 0;
        this.ShowCancel = true;
        this.IsMultiAsset = true;
        this.IsReady = false;
    }
  }