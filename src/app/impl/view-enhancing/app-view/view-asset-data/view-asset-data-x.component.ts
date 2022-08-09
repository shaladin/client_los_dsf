import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AllAssetDataObj } from 'app/shared/model/all-asset-data-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';

@Component({
  selector: "view-asset-data-x",
  templateUrl: "./view-asset-data-x.component.html"
})
export class ViewAssetDataXComponent implements OnInit {
  getAppUrl: any;
  getAllAssetDataUrl: any;
  @Input() appId: number = 0;
  @Input() agrmntId: number = 0;
  @Input() BizTemplateCode: string = "";
  appAssetId: number = 0;
  appObj = {
    Id: 0
  };
  appAssetObj = {
    Id: 0
  };
  
  AppObj: any;
  AppAssetObj: any;
  totalRsvFund: number = 0;
  totalHalfResponseAppAssetAttrObjs: number = 0;
  listAsset: Array<any> = new Array<any>();
  allAssetDataObj: AllAssetDataObj;
  inputGridObj: InputGridObj = new InputGridObj();
  appCollateralList: Array<any>;
  IsHidden: boolean = true;
  AppCollateralId: number;
  IsReady: boolean = false;
  SalesName: string;
  AdminName: string;
  ManagerName: string;
  SerialNoLabelCollateralList: Array<string> = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
     if (params['AppId'] != null) {
       this.appId = params['AppId'];
     }
     if (params['AppAssetId'] != null) {
      this.appAssetId = params['AppAssetId'];
    }
    });
  }

  initUrl() {
    this.getAppUrl = URLConstant.GetAppById;
    this.getAllAssetDataUrl = this.agrmntId != 0 ? URLConstant.GetAllAssetDataByAgrmntId : URLConstant.GetAllAssetDataByAppId;
  }

  initSingleAssetUrl(){
    this.getAppUrl = URLConstant.GetAppById;
    this.getAllAssetDataUrl = URLConstant.GetAllAssetDataByAppAssetId;
  }

  async ngOnInit(): Promise<void> {
    this.inputGridObj.pagingJson = "./assets/ucgridview/app-view/gridAppAssetAccessoryCF4W.json";

    this.appObj.Id = this.appId;
    if(this.BizTemplateCode === CommonConstant.OPL) {
      await this.GetListAllAssetData();
    }
    else {
      if (this.appAssetId != 0) {
        this.initSingleAssetUrl();
        this.appAssetObj.Id = this.agrmntId != 0 ? this.agrmntId : this.appAssetId;
        await this.GetAllAssetData(this.appAssetObj);
      }
      else {
        this.initUrl();
        this.appObj.Id = this.agrmntId != 0 ? this.agrmntId : this.appId;
        await this.GetAllAssetData(this.appObj);
      }

      if(this.agrmntId != 0){
        this.GetListAppCollateralByAgrmntId(this.agrmntId);
      }
      else{
        this.GetListAppCollateralByAppId(this.appId);
      }

      this.IsReady = true;
    }

    if(!this.AppAssetObj.ResponseSalesPersonSupp)
    {
      let name;
      
      this.AppAssetObj.ResponseAdminHeadSupp == null ? '' : this.AppAssetObj.ResponseAdminHeadSupp.SupplEmpName;
      if(!name)
      {
        name = this.AppAssetObj.ResponseBranchManagerSupp.SupplEmpName
      }
      this.SalesName = name;
      this.AdminName = name;
      this.ManagerName = name;
    }
  }

  async GetListAppCollateralByAgrmntId(AgrmntId: number) {
    this.http.post(URLConstant.GetViewAppCollateralObjByAgrmntId, {Id: AgrmntId}).subscribe(
      response => {
        this.appCollateralList = response["AppCollateralObjs"];
        this.GetSerialNoList();
      }
    );
  }

  async GetListAppCollateralByAppId(AppId: number) {
    this.http.post(URLConstant.GetViewAppCollateralObjByAppId, {Id: AppId}).subscribe(
      response => {
        this.appCollateralList = response["AppCollateralObjs"];
        this.GetSerialNoList();
      }
    );
  }

  async GetSerialNoList()
  {
    let reqByListCodes: GenericListByCodeObj = new GenericListByCodeObj();

    this.appCollateralList.forEach(x => {
      reqByListCodes.Codes.push(x.AssetTypeCode);
    });
    
    let x = [];
    let temp = 0;
    for(let i = 0; i < reqByListCodes.Codes.length; i++)
    {
      await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
        Code: this.appCollateralList[i].AssetTypeCode
      }).toPromise().then(
        (response) => {
          if(i == 0)
          {
            response[CommonConstant.ReturnObj].length <= 3? temp = response[CommonConstant.ReturnObj].length : temp = 3;
          }
          else
          {
            response[CommonConstant.ReturnObj].length >= temp? (response[CommonConstant.ReturnObj].length >= 3? temp = 3 : temp = response[CommonConstant.ReturnObj].length) : temp = temp;
          }
        });

      x = reqByListCodes.Codes.filter(f => f == reqByListCodes.Codes[i]);
    }

    if(x.length == reqByListCodes.Codes.length)
    {
      await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
        Code: this.appCollateralList[0].AssetTypeCode
      }).toPromise().then(
        (response) => {
          for(let i = 0; i < temp; i++)
          {
            this.SerialNoLabelCollateralList.push(response[CommonConstant.ReturnObj][i].SerialNoLabel)
          }
        });
    }
    else
    {
      for(let i = 0; i < temp; i++)
      {
        this.SerialNoLabelCollateralList.push("Serial No " + (i+1))
      }
    }
  }
  
  async GetAllAssetData(obj: any) {
    await this.http.post(this.getAllAssetDataUrl, obj).toPromise().then(
      (response) => {
        this.AppAssetObj = response;
        if(this.AppAssetObj.ResponseAppAssetAttrObjs != null) {
          this.totalHalfResponseAppAssetAttrObjs = Math.ceil(this.AppAssetObj.ResponseAppAssetAttrObjs.length/2);
        }

        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = this.AppAssetObj.ResponseAppAssetAccessoryObjs;
      }
    );
  }

  async GetListAllAssetData() {
    await this.http.post(URLConstant.GetListAllAssetDataByAppId, this.appObj).toPromise().then(
      (response) => {
        this.AppAssetObj = response[CommonConstant.ReturnObj];

        if (this.AppAssetObj.length > 0) {
          for(let i = 0; i < this.AppAssetObj.length; i++) {
            this.allAssetDataObj = new AllAssetDataObj();

            this.allAssetDataObj.AppAssetObj.AppAssetId = this.AppAssetObj[i].ResponseAppAssetObj.AppAssetId;
            this.allAssetDataObj.AppAssetObj.AppId = this.AppAssetObj[i].ResponseAppAssetObj.AppId;
            this.allAssetDataObj.AppAssetObj.AssetSeqNo = this.AppAssetObj[i].ResponseAppAssetObj.AssetSeqNo;
            this.allAssetDataObj.AppAssetObj.AppAssetNo = this.AppAssetObj[i].ResponseAssetDataOplObj.AppAssetNo;
            this.allAssetDataObj.AppAssetObj.FullAssetName = this.AppAssetObj[i].ResponseAppAssetObj.FullAssetName;
            this.allAssetDataObj.AppAssetObj.Color = this.AppAssetObj[i].ResponseAppAssetObj.Color;
            this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.AppAssetObj[i].ResponseAppAssetObj.MrAssetConditionCode;
            this.allAssetDataObj.AppAssetObj.AssetPriceAmt = this.AppAssetObj[i].ResponseAssetDataOplObj.AssetPriceBefDiscAmt;
            this.allAssetDataObj.AppAssetObj.Discount = this.AppAssetObj[i].ResponseAssetDataOplObj.DiscountAmt;

            this.listAsset.push(this.allAssetDataObj);
          }
        }
      }
    );
  }

  viewDetailCollateralHandler(AppCollateralId){
    this.IsHidden = false;
    this.AppCollateralId = AppCollateralId;
  }

  getValue(event){
    this.IsHidden = event;
  }
}