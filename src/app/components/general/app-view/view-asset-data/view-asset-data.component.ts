import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AllAssetDataObj } from 'app/shared/model/all-asset-data-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';

@Component({
  selector: "view-asset-data",
  templateUrl: "./view-asset-data.component.html"
})
export class ViewAssetDataComponent implements OnInit {
  getAppUrl: string;
  getAllAssetDataUrl: string;
  @Input() appId: number = 0;
  @Input() agrmntId: number = 0;
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
  inputGridObj: InputGridObj = new InputGridObj();
  appCollateralList: Array<any>;
  IsHidden: boolean = true;
  AppCollateralId: number;

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

    if (this.appAssetId != 0) {
      this.initSingleAssetUrl();
      this.appAssetObj.Id = this.appAssetId;
      await this.GetAllAssetData(this.appAssetObj);
    }
    else {
      this.initUrl();
      this.appObj.Id = this.appId;
      await this.GetAllAssetData(this.appObj);
    }

    if(this.AppAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionCode != null || this.AppAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionCode != undefined) {
      await this.GetProfessionName(this.AppAssetObj.ResponseAppCollateralRegistrationObj.OwnerProfessionCode);
    }

    if(this.agrmntId != 0){
      this.GetListAppCollateralByAgrmntId(this.agrmntId);
    }
    else{
      this.GetListAppCollateralByAppId(this.appId);
    }   
    
  }

  async GetAllAssetData(obj: any) {
    await this.http.post(this.getAllAssetDataUrl, obj).toPromise().then(
      (response: AllAssetDataObj) => {
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

  async GetListAppCollateralByAgrmntId(AgrmntId: number) {
    this.http.post(URLConstant.GetViewAppCollateralObjByAgrmntId, {Id: AgrmntId}).subscribe(
      response => {
        this.appCollateralList = response["AppCollateralObjs"];
      }
    );
  }

  async GetListAppCollateralByAppId(AppId: number) {
    this.http.post(URLConstant.GetViewAppCollateralObjByAppId, {Id: AppId}).subscribe(
      response => {
        this.appCollateralList = response["AppCollateralObjs"];
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