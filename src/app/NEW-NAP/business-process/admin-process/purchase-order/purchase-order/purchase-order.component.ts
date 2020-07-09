import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { WorkflowApiObj } from 'app/shared/model/Workflow/WorkFlowApiObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html'
})
export class PurchaseOrderComponent implements OnInit {
  urlDetail: string;
  lobCode: string;
  AppId: number;
  AgrmntId: number;
  TaskListId: any;
  arrValue: Array<number> = [];
  AppAssetList = [];
  tcForm: FormGroup = this.fb.group({
  });

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["LobCode"] != null) {
        this.lobCode = params["LobCode"];
      }
      switch (this.lobCode) {
        case "FL4W":
          this.urlDetail = "/Nap/FinanceLeasing/AdminProcess/PurchaseOrder/Detail";
          break;

        default:
          this.urlDetail = "/Nap/AdminProcess/PurchaseOrder/PO/Detail";
          break;
      }
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AgrmntId);
    var appAssetObj = {
      AgrmntId: this.AgrmntId
    }
    this.claimTask();
    this.http.post(URLConstant.GetAppAssetListByAgrmntId, appAssetObj).subscribe(
      (response) => {
        this.AppAssetList = response["ReturnObject"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  testData() {
    console.log(this.tcForm);
    console.log(this.tcForm.value);
  }

  SaveForm() {
    console.log("Save");
    var IsSave = false;
    if (this.AppAssetList.length != 0) {
      for (let i = 0; i < this.AppAssetList.length; i++) {
        if (this.AppAssetList[i].PurchaseOrderNo == undefined) {
          IsSave = false;
          this.toastr.typeErrorCustom("Please submit purchase order first!");
          break;
        } else {
          IsSave = true;
        }
      }
    } else {
      this.toastr.typeErrorCustom("Please submit purchase order first!");
    }

    if (IsSave) {
      var workflowModel: WorkflowApiObj = new WorkflowApiObj();
      workflowModel.TaskListId = this.TaskListId;
      workflowModel.ListValue = { "AgrmntId": this.AgrmntId.toString() };


      this.http.post(URLConstant.ResumeWorkflowPurchaseOrder, workflowModel).subscribe(
        (response) => {
          this.AppAssetList = response["ReturnObject"];
          this.router.navigate(["/Nap/AdminProcess/PurchaseOrder/Paging"]);
          this.toastr.successMessage(response["message"]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.TaskListId;
    wfClaimObj.pUserID = currentUserContext["UserName"];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }
  Cancel() {
    var BizTemplateCode = localStorage.getItem("BizTemplateCode")
    this.router.navigate(["/Nap/AdminProcess/PurchaseOrder/Paging"], { queryParams: { "BizTemplateCode": BizTemplateCode } });
  }
}
