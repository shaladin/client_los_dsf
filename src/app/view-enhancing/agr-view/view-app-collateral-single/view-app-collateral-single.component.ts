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

@Component({
  selector: 'app-view-app-collateral-single',
  templateUrl: './view-app-collateral-single.component.html'
})
export class ViewAppCollateralSingleComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  viewUOLObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() agrmntId: number = 0;
  @Input() AppCollateralId: number = 0;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();
  AppCollateralDocs: Array<AppCollateralDocObj> = new Array<AppCollateralDocObj>();
  arrValue = [];
  IsHidden: boolean = true;
  @Output() outputTab: EventEmitter<boolean> = new EventEmitter();
  @Input() isMulti: boolean = false;
  IsReady: boolean = false;
  AppCollateralAttrObjs : Array<AppCollateralAttrObj> = new Array<AppCollateralAttrObj>();
  AppCollateralAccessoryObjs : Array<AppCollateralAccessoryObj> = new Array<AppCollateralAccessoryObj>();
  inputGridObj: InputGridObj = new InputGridObj();


  constructor(private http: HttpClient, private route: ActivatedRoute, private httpClient: HttpClient) {
  }

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCollateralData.json";
    this.viewUOLObj.viewInput = "./assets/ucviewgeneric/viewCollateralDataUserOwnerLocation.json";
    this.inputGridObj.pagingJson = "./assets/ucgridview/app-view/gridAppAssetAccessoryFL4W.json";

    if (this.AppCollateralId != 0) {
      this.arrValue.push(this.AppCollateralId);
      this.viewGenericObj.whereValue = this.arrValue;
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
          this.viewGenericObj.whereValue = this.arrValue;
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
}
