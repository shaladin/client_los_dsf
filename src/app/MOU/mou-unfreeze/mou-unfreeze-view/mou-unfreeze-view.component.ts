import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UcInputApprovalGeneralInfoObj } from 'app/shared/model/uc-input-approval-general-info-obj.model';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { UcInputApprovalObj } from 'app/shared/model/uc-input-approval-obj.model';
import { UcViewGenericObj } from "app/shared/model/uc-view-generic-obj.model";
import { environment } from "environments/environment";

@Component({
  selector: 'app-mou-unfreeze-view',
  templateUrl: './mou-unfreeze-view.component.html'
})
export class MouUnfreezeViewComponent implements OnInit {
  TrxId: number;
  TrxNo : string;
  taskId: number;
  instanceId: number;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  viewGenericTrxObj: UcViewGenericObj = new UcViewGenericObj();

  InputApvObj : UcInputApprovalObj;
  InputApprovalHistoryObj : UcInputApprovalHistoryObj;
  UcInputApprovalGeneralInfoObj : UcInputApprovalGeneralInfoObj;
  IsReady: boolean = false;
  ApvReqId: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: NGXToastrService,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params["TrxId"] != null) {
        this.TrxId = params["TrxId"];
        this.TrxNo = params["TrxNo"];
      }
    });
  }

  ngOnInit() {
    var arrValue= [];
    arrValue.push(this.TrxId);
    this.viewGenericObj.viewInput =
      "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];

     this.viewGenericTrxObj.viewInput =
    "./assets/ucviewgeneric/viewMouFreezeTrxMainInfo.json";
     this.viewGenericTrxObj.whereValue = arrValue;

  }

  GetCallBack(e) {
  }
}
