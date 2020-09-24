import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

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

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    });}

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCollateralData.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];

    this.viewUOLObj.viewInput = "./assets/ucviewgeneric/viewCollateralDataUserOwnerLocation.json";
    this.viewUOLObj.viewEnvironment = environment.losUrl;
    this.viewUOLObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];

    if(this.AppCollateralId!=0){
      this.arrValue.push(this.AppCollateralId);
      this.viewGenericObj.whereValue = this.arrValue;
      this.viewUOLObj.whereValue = this.arrValue;
      this.IsReady = true;
      this.http.post<Array<AppCollateralDocObj>>(URLConstant.GetListAppCollateralDocsByAppCollateralId, {AppCollateralId: this.AppCollateralId}).subscribe(
        (response) => {
          this.AppCollateralDocs = response["AppCollateralDocs"];
        }
      );
    }else{
      this.http.post<AppCollateralObj>(URLConstant.GetAppCollateralByAppId, {AppId: this.AppId}).subscribe(
        (response) => {
          this.AppCollateralObj = response;        
          this.arrValue.push(this.AppCollateralObj.AppCollateralId);
          this.IsReady = true;
          this.http.post<Array<AppCollateralDocObj>>(URLConstant.GetListAppCollateralDocsByAppCollateralId, this.AppCollateralObj).subscribe(
            (response) => {
              this.AppCollateralDocs = response["AppCollateralDocs"];
    
            }
          );
        });
    }
  }

  Back(){
    this.outputTab.emit(this.IsHidden);
  }
}
