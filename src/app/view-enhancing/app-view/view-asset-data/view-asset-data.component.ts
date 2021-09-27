import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AllAssetDataObj } from 'app/shared/model/AllAssetDataObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';

@Component({
  selector: "view-asset-data",
  templateUrl: "./view-asset-data.component.html"
})
export class ViewAssetDataComponent implements OnInit {
  getAppUrl: any;
  getAllAssetDataUrl: any;
  @Input() appId: number = 0;
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
    this.getAllAssetDataUrl = URLConstant.GetAllAssetDataByAppId;
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
        this.appAssetObj.Id = this.appAssetId;
        await this.GetAllAssetData(this.appAssetObj);
      }
      else {
        this.initUrl();
        await this.GetAllAssetData(this.appObj);
      }
      if(this.AppAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionCode != null || this.AppAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionCode != undefined) {
        await this.GetProfessionName(this.AppAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionCode);
      }

      this.http.post(URLConstant.GetViewAppCollateralObjByAppId, {Id: this.appId}).subscribe(
        response => {
          this.appCollateralList = response["AppCollateralObjs"];
        }
      );

      this.IsReady = true;
    }
  }

  async GetProfessionName(professionCode: string) {
    await this.http.post(URLConstant.GetRefProfessionByCode, { Code: professionCode }).toPromise().then(
      (response) => {
        this.AppAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionName = response["ProfessionName"]
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
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