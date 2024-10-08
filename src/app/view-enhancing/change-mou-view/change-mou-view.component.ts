import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-change-mou-view',
  templateUrl: './change-mou-view.component.html'
})
export class ChangeMouViewComponent implements OnInit {
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
  Status: string;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private adInsHelperService: AdInsHelperService) {
    this.route.queryParams.subscribe(params => {
      if (params["ChangeMouTrxId"] != null)
        this.ChangeMouTrxId = params["ChangeMouTrxId"];
    });

  }

  ngOnInit() {
    this.arrValue.push(this.ChangeMouTrxId);
    this.http.post(URLConstant.GetChangeMouTrxbyTrxId, { Id: this.ChangeMouTrxId }).subscribe(
      (responseCMT) => {
        this.MouCustId = responseCMT["MouCustId"];
        this.Status = responseCMT["Status"];
        this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
          (responseMC : MouCustObj) => {
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
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }
}
