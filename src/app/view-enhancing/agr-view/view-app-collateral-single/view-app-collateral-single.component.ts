import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { AppCollateralDocObj } from 'app/shared/model/app-collateral-doc-obj.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { AppCollateralAttrObj } from 'app/shared/model/app-collateral-attr-obj.model';
import { AppCollateralAccessoryObj } from 'app/shared/model/app-collateral-accessory-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-view-app-collateral-single',
  templateUrl: './view-app-collateral-single.component.html'
})
export class ViewAppCollateralSingleComponent implements OnInit {
  viewUOLObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() agrmntId: number = 0;
  @Input() AppCollateralId: number = 0;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();
  AppCollateralDocs: Array<AppCollateralDocObj> = new Array<AppCollateralDocObj>();
  AppCollateral: any;
  SerialNoLabelCollateralList: Array<string> = [];
  arrValue = [];
  IsHidden: boolean = true;
  @Output() outputTab: EventEmitter<boolean> = new EventEmitter();
  @Input() isMulti: boolean = false;
  IsReady: boolean = false;
  AppCollateralAttrObjs : Array<AppCollateralAttrObj> = new Array<AppCollateralAttrObj>();
  AppCollateralAccessoryObjs : Array<AppCollateralAccessoryObj> = new Array<AppCollateralAccessoryObj>();
  inputGridObj: InputGridObj = new InputGridObj();
  // Self Custom Changes CR Runner KTB 398912
  AppAssetDsf: any;
  // End Self Custom Changes CR Runner KTB 398912


  constructor(private http: HttpClient, private route: ActivatedRoute, private httpClient: HttpClient) {
  }

  async ngOnInit() {
    this.viewUOLObj.viewInput = "./assets/ucviewgeneric/viewCollateralDataUserOwnerLocation.json";
    this.inputGridObj.pagingJson = "./assets/ucgridview/app-view/gridAppCollateralAccessory.json";

    if (this.AppCollateralId != 0) {
      this.arrValue.push(this.AppCollateralId);
      this.viewUOLObj.whereValue = this.arrValue;
      this.IsReady = true;
      await this.http.post<Array<AppCollateralDocObj>>(URLConstant.GetListAppCollateralDocsByAppCollateralId, { Id: this.AppCollateralId }).toPromise().then(
        (response) => {
          this.AppCollateralDocs = response["AppCollateralDocs"];
        }
      );
    } else {
      await this.http.post<AppCollateralObj>(URLConstant.GetAppCollateralByAgrmntId, { Id: this.agrmntId }).toPromise().then(
        (response) => {
          this.AppCollateralObj = response;
          this.arrValue.push(this.AppCollateralObj.AppCollateralId);
          this.viewUOLObj.whereValue = this.arrValue;
          this.IsReady = true;
          this.AppCollateralId = this.AppCollateralObj.AppCollateralId;
          this.http.post<Array<AppCollateralDocObj>>(URLConstant.GetListAppCollateralDocsByAppCollateralId, { Id: this.AppCollateralObj.AppCollateralId }).subscribe(
            (response) => {
              this.AppCollateralDocs = response["AppCollateralDocs"];
            }
          );
        });
    }
    this.GetCollateralData();
  }

  Back() {
    this.outputTab.emit(this.IsHidden);
  }

  GetCollateralData(){

    this.http.post<Array<AppCollateralAttrObj>>(URLConstant.GetAppCollateralByAppCollateralIdForView, {Id: this.AppCollateralId }).subscribe(
      (response) => {
        this.AppCollateral = response;

        this.GetSerialNoList();
        // Self Custom Changes CR Runner KTB 398912
        let appAssetDsfObj = { Id:  this.AppCollateral.AppAssetId };
        this.GetAllAssetDataDsf(appAssetDsfObj);
        // End Self Custom Changes CR Runner KTB 398912
      }
    );

    this.http.post<Array<AppCollateralAttrObj>>(URLConstant.GetAppCollateralAttrByAppCollateralId, {Id: this.AppCollateralId }).subscribe(
      (response) => {
        this.AppCollateralAttrObjs = response["AppCollateralAttrObjs"];
      }
    );

    this.http.post<Array<AppCollateralAccessoryObj>>(URLConstant.GetAppCollateralAccessoriesListByAppCollateralId, {Id: this.AppCollateralId }).subscribe(
      (response) => {
        this.AppCollateralAccessoryObjs = response[CommonConstant.ReturnObj];
        
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = this.AppCollateralAccessoryObjs;
      }
    );
  }

  async GetSerialNoList()
  {
    let temp = 0;
    await this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
      Code: this.AppCollateral.AssetTypeCode
    }).toPromise().then(
      (response) => {
        response[CommonConstant.ReturnObj].length <= 3 ? temp = response[CommonConstant.ReturnObj].length : temp = 3; 
        for(let i = 0; i < temp; i++)
        {
          this.SerialNoLabelCollateralList.push(response[CommonConstant.ReturnObj][i].SerialNoLabel)
        }
      });
  }


  // Self Custom Changes CR Runner KTB 398912
  async GetAllAssetDataDsf(obj: any) {
    await this.http.post(URLConstantDsf.GetAppAssetByAppAssetIdDsf, obj).toPromise().then(
      (response) => {
        this.AppAssetDsf = response;
      }
    );
  }
  // End Self Custom Changes CR Runner KTB 398912
}
