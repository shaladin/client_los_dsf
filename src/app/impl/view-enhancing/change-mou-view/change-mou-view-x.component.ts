import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-change-mou-view-x',
  templateUrl: './change-mou-view-x.component.html'
})
export class ChangeMouViewXComponent implements OnInit {
  ChangeMouTrxId: number;
  resultData: MouCustObj;
  isReady: boolean = false;
  MrMouTypeCode: string;
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;
  arrValue = [];
  MouCustId: number;
  ChangeMouTrxIdPrev: number;
  Status: string;
  TrxType: string;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["ChangeMouTrxId"] != null)
        this.ChangeMouTrxId = params["ChangeMouTrxId"];
    });

  }

  ngOnInit() {
    this.http.post(URLConstant.GetChangeMouTrxbyTrxId, { Id: this.ChangeMouTrxId }).subscribe(
      (responseCMT) => {
        this.MouCustId = responseCMT["MouCustId"];
        this.Status = responseCMT["Status"];
        this.TrxType = responseCMT["TrxType"];
        this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
          (responseMC : MouCustObj) => {
            this.arrValue.push(this.ChangeMouTrxId);
            this.resultData = responseMC;
            this.MrMouTypeCode = this.resultData.MrMouTypeCode;
            this.isReady = true;
          });
      });
  }

  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }
}
