import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MatTabChangeEvent } from '@angular/material';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { LtkMainInfoComponent } from '../ltkm-mi/ltkm-mi.component';
import { LtkmApprovalHistComponent } from './ltkm-approval-history-data/ltkm-approval-history-data.component';

@Component({
  selector: 'app-ltkm-view',
  templateUrl: './ltkm-view-component.html',
})
export class LtkmViewComponent implements OnInit {

  LtkmCustId: number;
  arrValue = [];
  CustTypeCode: string = "";
  AppCustObj: any;
  @ViewChild("mainInfoContainerA", { read: ViewContainerRef }) mainInfoContainer: ViewContainerRef;
  @ViewChild(LtkmApprovalHistComponent) ltkmApprovalHistComponent;
  IsFromApp : boolean = false;
  bizTemplateCode : string = "";
  isDmsReady: boolean;
  dmsObj: DMSObj;
  AppId: number;

  LtkmNo: string;
  constructor(private route: ActivatedRoute, private http: HttpClient,  private componentFactoryResolver: ComponentFactoryResolver) { 
    this.route.queryParams.subscribe(params => {
      this.LtkmCustId = params["LtkmCustId"];
    })
  }

  async ngOnInit() {
    this.AppId = 0;
    this.arrValue.push(this.LtkmCustId);
    this.GetLtkmCust();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LtkMainInfoComponent);
    const component = this.mainInfoContainer.createComponent(componentFactory);
    component.instance.arrValue = this.arrValue;
  }

  GetLtkmCust() {
    this.http.post(URLConstant.GetLtkmCustById, { Id: this.LtkmCustId }).subscribe(
      (response) => {
        this.CustTypeCode = response["MrCustTypeCode"];
        
        this.http.post(URLConstant.getLtkmReqByLtkmCustId, { Id: this.LtkmCustId }).subscribe(
          (response) => {
            if(response["ReturnObject"] != undefined)
            {
              this.LtkmNo = response["ReturnObject"]["LtkmNo"];
              if(response["ReturnObject"]["LtkmSrc"] == 'APP'){
                this.IsFromApp = true;
                this.AppId = response["ReturnObject"]["AppId"];
              }
            }
          }
        );
      }
    );
  }
  tabChangeEvent( tabChangeEvent : MatTabChangeEvent){
    if(tabChangeEvent.index == 0){
      this.GetLtkmCust();
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LtkMainInfoComponent);
    this.mainInfoContainer.clear();
    const component = this.mainInfoContainer.createComponent(componentFactory);
    component.instance.arrValue = this.arrValue;
  }

}
