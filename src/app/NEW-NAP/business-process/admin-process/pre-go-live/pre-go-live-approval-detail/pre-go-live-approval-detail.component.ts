import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-pre-go-live-approval-detail',
  templateUrl: './pre-go-live-approval-detail.component.html',
  styleUrls: ['./pre-go-live-approval-detail.component.scss']
})
export class PreGoLiveApprovalDetailComponent implements OnInit {
  inputObj: { taskId: any; instanceId: any; approvalBaseUrl: string; };
  viewObj: string;
  TrxNo : any;
  AgrmntNo : any;
  result: any;
  result2: any;
  result3: any;
  result4: any;
  result5: any;
  result6: any;

  AppNo : any;
  NumOfAsset : any;
  Tenor : any;
  InstaAmt : any;
  DeliveryDt : any;
  ProdOfferingName : any;
  WayOfFinancing : any;
  CustNo : any;
  CustName : any;
  OfficeName : any;
  PurposeOfFinancing : any;
  


  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.TrxNo = params["TrxNo"];
      var obj = {
        taskId: params["TaskId"],
        instanceId: params["InstanceId"],
        approvalBaseUrl: "http://r3app-server/APPROVAL"
      }

      this.inputObj = obj;
    });
  }

  ngOnInit() {
    
    var Obj = {
      AgrmntNo: this.TrxNo,
      RowVersion : ""
    }
    this.http.post(AdInsConstant.GetAgrmntByAppIdGetAgrmntByAgrmntNo, Obj).subscribe(
      (response) => {
        this.result = response;
        this.AgrmntNo = this.result.AgrmntNo;
        this.CustNo = this.result.CustNo;
        this.CustName = this.result.CustName;
        this.OfficeName = this.result.OfficeName;
        this.NumOfAsset = this.result.NumOfAsset;
        this.Tenor = this.result.Tenor;
        this.ProdOfferingName = this.result.ProdOfferingName;
        console.log(this.result);
        var Obj2 = {
          ProdOfferingCode : this.result.ProdOfferingCode,
          RefProdCompntCode : "WAY_OF_FINANCING",
          RowVersion : ""
        }
        this.http.post(AdInsConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForApproval, Obj2).subscribe(
          (response) => {
            this.result2 = response;
            this.WayOfFinancing = this.result2.CompntValueDesc;
           console.log(this.result2);
          }
        );

        var Obj3 = {
          ProdOfferingCode : this.result.ProdOfferingCode,
          RefProdCompntCode : "PURPOSE_OF_FINANCING",
          RowVersion : ""
        }
        this.http.post(AdInsConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCodeForApproval, Obj3).subscribe(
          (response) => {
            this.result3 = response;
            this.PurposeOfFinancing = this.result3.CompntValueDesc;
           console.log(this.result3);
          }
        );


        var Obj4 = {
          AppId : this.result.AppId,
          RowVersion : ""
        }
        this.http.post(AdInsConstant.GetAppByIds, Obj4).subscribe(
          (response) => {
            this.result4 = response;
            this.AppNo = this.result4.AppNo;
           console.log(this.result4);
          }
        );

        var Obj5 = {
          AgrmntId : this.result.AgrmntId,
          RowVersion : ""
        }
        this.http.post(AdInsConstant.GetDeliveryOrderHByAgrmntId, Obj5).subscribe(
          (response) => {
            this.result5 = response;
            this.DeliveryDt = this.result5.DeliveryDt;
           console.log(this.result5);
          }
        );

        this.http.post(AdInsConstant.GetAgrmntFinDataByAgrmntId, Obj5).subscribe(
          (response) => {
            this.result6 = response;
            this.InstaAmt = this.result6.InstaAmt;
           console.log(this.result6);
          }
        );

      }
    );

    

  }
}
