import { Component, OnInit } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdminProcessService } from 'app/NEW-NAP/business-process/admin-process/admin-process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agrmnt-activation-detail',
  templateUrl: './agrmnt-activation-detail.component.html',
  styleUrls: ['./agrmnt-activation-detail.component.scss'],
  providers: [AdminProcessService, NGXToastrService]
})
export class AgrmntActivationDetailComponent implements OnInit {
  arrValue = [];
  AssetObj: any;
  AppFees: Object;
  AppFinData: Object;
  listSelectedId: any = new Array();
  tempListId: any = new Array();
  tempData: any = new Array();
  arrAddCrit: any;
  arrCrit: any;
  AppId: number;
  isOverwrite: boolean;
  AgrmntNo: string;
  CreateDt: Date;
  WfTaskListId: number;
  TrxNo: string;

  constructor(private toastr: NGXToastrService, private route: ActivatedRoute, private adminProcessSvc: AdminProcessService,private router: Router,private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.WfTaskListId = params["WFTaskListId"];
      this.TrxNo = params["TrxNo"];
    });
  }

  ngOnInit() {
    this.ClaimTask(this.WfTaskListId);
    var obj = {
      AppId: this.AppId
    };

    this.adminProcessSvc.GetListAppAssetAgrmntActivation(obj).subscribe((response) => {
      this.AssetObj = response["ListAppAsset"];
    });

  }

  async ClaimTask(WfTaskListId) {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: WfTaskListId, pUserID: currentUserContext["UserName"], isLoading: false };
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(() => { });
  }

  addToTemp() {
    if (this.listSelectedId.length != 0) {
      for (var i = 0; i < this.listSelectedId.length; i++) {
        this.tempListId.push(this.listSelectedId[i]);
      }
      for (var i = 0; i < this.listSelectedId.length; i++) {
        var object = this.AssetObj.find(x => x.AppAssetId == this.listSelectedId[i]);
        this.tempData.push(object);
      }

      var obj = {
        AppId: this.AppId,
        ListAppAssetId: this.tempListId
      };

      this.adminProcessSvc.GetListAppAssetAgrmntActivation(obj).subscribe((response) => {
        this.AssetObj = response["ListAppAsset"];
      });
      var objFinDataAndFee = {
        AppId: this.AppId,
        ListAppAssetId: this.listSelectedId
      };
      this.adminProcessSvc.GetAppFinDataAndFeeByAppIdAndListAppAssetId(objFinDataAndFee).subscribe((response) => {
        this.AppFees = response["ListAppFeeObj"];
        this.AppFinData = response["AppFinDataObj"];
      })

    } else {
      this.toastr.typeErrorCustom("Please select at least one Asset");
    }
  }
  Checked(AppAssetId: any, isChecked: any): void {
    if (isChecked) {
      this.listSelectedId.push(AppAssetId);
    } else {
      const index = this.listSelectedId.indexOf(AppAssetId)
      console.log(index);
      if (index > -1) { this.listSelectedId.splice(index, 1); }
    }
    console.log('Sel', this.listSelectedId);
  }
  Submit() {
    var Obj = {
      CreateDt: this.CreateDt,
      ListAppAssetId: this.listSelectedId,
      TaskListId: this.WfTaskListId,
      TransactionNo: this.TrxNo
    }
    this.adminProcessSvc.SubmitAgrmntActivationByHuman(Obj).subscribe((response) => {
      this.toastr.successMessage(response["message"]);
      this.router.navigate(["AgrmntActivation/Paging"]);
    })
  }
}
