import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { AppCollateralAccessoryObj } from "app/shared/model/AppCollateralAccessoryObj.Model";
import { AppCollateralAttrObj } from "app/shared/model/AppCollateralAttrObj.Model";
import { AppCollateralDocObj } from "app/shared/model/AppCollateralDocObj.Model";
import { AppCollateralObj } from "app/shared/model/AppCollateralObj.Model";
import { InputGridObj } from "app/shared/model/InputGridObj.Model";
import { UcViewGenericObj } from "app/shared/model/UcViewGenericObj.model";

@Component({
    selector: 'app-view-collateral-data',
    templateUrl: './view-collateral-data.component.html'
})
export class ViewCollateralDataComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  viewUOLObj: UcViewGenericObj = new UcViewGenericObj();
  
  AppId: number;  @Input() appId: number = 0;
  @Input() AppCollateralId: number = 0;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();
  AppCollateralDocs: Array<AppCollateralDocObj> = new Array<AppCollateralDocObj>();
  IsHidden: boolean = true;
  arrValue = [];
  @Output() outputTab: EventEmitter<boolean> = new EventEmitter();
  @Input() isMulti: boolean = false;
  IsReady: boolean = false;
  AppCollateralAttrObjs : Array<AppCollateralAttrObj> = new Array<AppCollateralAttrObj>();
  AppCollateralAccessoryObjs : Array<AppCollateralAccessoryObj> = new Array<AppCollateralAccessoryObj>();
  inputGridObj: InputGridObj = new InputGridObj();

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    });}

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCollateralData.json";
    this.viewUOLObj.viewInput = "./assets/ucviewgeneric/viewCollateralDataUserOwnerLocation.json";
    this.inputGridObj.pagingJson = "./assets/ucgridview/app-view/gridAppCollateralAccessory.json";
  
    if(this.AppCollateralId!=0){
      this.arrValue.push(this.AppCollateralId);
      this.viewGenericObj.whereValue = this.arrValue;
      this.viewUOLObj.whereValue = this.arrValue;
      this.IsReady = true;
      await this.http.post<Array<AppCollateralDocObj>>(URLConstant.GetListAppCollateralDocsByAppCollateralId, {Id: this.AppCollateralId}).toPromise().then(
        (response) => {
          this.AppCollateralDocs = response["AppCollateralDocs"];
        }
      );
    }else{
      await this.http.post<AppCollateralObj>(URLConstant.GetAppCollateralByAppId, {Id: this.AppId}).toPromise().then(
        (response) => {
          this.AppCollateralObj = response;        
          this.arrValue.push(this.AppCollateralObj.AppCollateralId);
          this.viewGenericObj.whereValue = this.arrValue;
          this.viewUOLObj.whereValue = this.arrValue;
          this.IsReady = false;
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

  Back(){
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
  