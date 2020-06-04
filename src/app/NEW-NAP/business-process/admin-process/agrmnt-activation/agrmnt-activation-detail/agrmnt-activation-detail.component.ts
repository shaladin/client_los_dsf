import { Component, OnInit } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdminProcessService } from 'app/NEW-NAP/business-process/admin-process/admin-process.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private toastr: NGXToastrService, private route: ActivatedRoute, private adminProcessSvc: AdminProcessService,private router: Router,) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.WfTaskListId = params["WFTaskListId"];
      this.TrxNo = params["TrxNo"];
    });
  }

  ngOnInit() {
    this.arrValue.push(this.AppId);
    var obj = {
      AppId: this.AppId
    };

    this.adminProcessSvc.GetListAppAssetAgrmntActivation(obj).subscribe((response) => {
      console.log(response);
      this.AssetObj = response["ListAppAsset"];
      console.log(this.AssetObj);
    });

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
        ListAppAssetId: this.tempListId
      };
      this.adminProcessSvc.GetAppFinDataAndFeeByAppIdAndListAppAssetId(objFinDataAndFee).subscribe((response) => {
        this.AppFees = response["ListAppFeeObj"];
        this.AppFinData = response["AppFinDataObj"];
      })

      this.listSelectedId = new Array();

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
      ListAppAssetId: this.tempListId,
      TaskListId: this.WfTaskListId,
      TransactionNo: this.TrxNo
    }
    this.adminProcessSvc.SubmitAgrmntActivationByHuman(Obj).subscribe((response) => {
      this.toastr.successMessage(response["message"]);
      this.router.navigate(["/Nap/AdminProcess/AgrmntActivation/Paging"]);
    })
  }

  deleteFromTemp(AppAssetId: string) {
    if (confirm('Are you sure to delete this record?')) {
      var index : number = this.tempListId.indexOf(AppAssetId);
      if (index > -1) {
        this.tempListId.splice(index, 1);
        this.tempData.splice(index, 1);
      }
      var obj = {
        AppId: this.AppId,
        ListAppAssetId: this.tempListId
      };

      this.adminProcessSvc.GetListAppAssetAgrmntActivation(obj).subscribe((response) => {
        this.AssetObj = response["ListAppAsset"];
      });

    }
  }
}
