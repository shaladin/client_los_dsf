import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-collateral-data',
  templateUrl: './view-collateral-data.component.html'
})
export class ViewCollateralDataComponent implements OnInit {
  viewObj: string;
  viewUOLObj: string;
  viewEnvironment: string;
  AppId: number;  @Input() appId: number = 0;
  @Input() AppCollateralId: number = 0;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();
  AppCollateralDocs: AppCollateralDocObj = new AppCollateralDocObj();
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
    this.viewObj = "./assets/ucviewgeneric/viewCollateralData.json";  
    this.viewUOLObj = "./assets/ucviewgeneric/viewCollateralDataUserOwnerLocation.json";
    if(this.AppCollateralId!=0){
      this.arrValue.push(this.AppCollateralId);
      this.IsReady = true;
      this.http.post<Array<AppCollateralDocObj>>(AdInsConstant.GetListAppCollateralDocsByAppCollateralId, {AppCollateralId: this.AppCollateralId}).subscribe(
        (response) => {
          this.AppCollateralDocs = response["AppCollateralDocs"];
        }
      );
    }else{
      this.http.post<AppCollateralObj>(AdInsConstant.GetAppCollateralByAppId, {AppId: this.AppId}).subscribe(
        (response) => {
          this.AppCollateralObj = response;        
          this.arrValue.push(this.AppCollateralObj.AppCollateralId);
          this.IsReady = true;
          this.http.post<Array<AppCollateralDocObj>>(AdInsConstant.GetListAppCollateralDocsByAppCollateralId, this.AppCollateralObj).subscribe(
            (response) => {
              this.AppCollateralDocs = response["AppCollateralDocs"];
    
            }
          );
        });
    }
    this.viewEnvironment = environment.losUrl;
  }

  Back(){
    this.outputTab.emit(this.IsHidden);
  }
}
