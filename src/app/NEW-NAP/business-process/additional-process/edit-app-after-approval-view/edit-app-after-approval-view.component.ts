import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/UcInputApprovalGeneralInfoObj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/UcInputApprovalHistoryObj.Model';
import { UcInputApprovalObj } from 'app/shared/model/UcInputApprovalObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit-app-after-approval-view',
  templateUrl: './edit-app-after-approval-view.component.html',
  styleUrls: ['./edit-app-after-approval-view.component.css']
})
export class EditAppAfterApprovalViewComponent implements OnInit {
  EditAppAftApvTrxHId: number;
  ChangeSummaryObj: any;
  taskId: number;
  instanceId: number;
  ApvReqId: number;
  inputObj: any;
  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  arrValue = [];
  BizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  agrmntId: number;
  isReady: boolean = false;

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private toastr: NGXToastrService,
    private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      if (params["EditAppAftApvTrxHId"] != null) {
        this.EditAppAftApvTrxHId = params["EditAppAftApvTrxHId"];
        this.taskId = params["TaskId"];
        
        // this.ApvReqId = params["ApvReqId"];
      }
      if(params["AgrmntId"] != null){
        this.agrmntId = params["AgrmntId"];
      }
    });
  }

  async ngOnInit() {
    await this.getData();
    this.arrValue.push(this.agrmntId);
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewAgrMainInfoEditAppAfterApv.json";
    this.viewGenericObj.whereValue = this.arrValue;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "AgrmntNo",
        environment: environment.losR3Web
      },
    ];
    this.isReady = true;
  }

  async getData()
  {
    let reqGetEditAppAftApv : GenericObj = new GenericObj();
    reqGetEditAppAftApv.Id = this.EditAppAftApvTrxHId;
    await this.http.post(URLConstant.GetEditAppAftApvTrxForChangeSummaryByEditAppAftApvTrxHId, reqGetEditAppAftApv).subscribe(
      (response) => {
        this.ChangeSummaryObj = response["ReturnObject"];
      
      });
  }

  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){ 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);  
    }
  }
}
