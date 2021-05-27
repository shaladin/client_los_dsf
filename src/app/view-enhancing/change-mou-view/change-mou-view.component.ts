import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';

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

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["ChangeMouTrxId"] != null)
        this.ChangeMouTrxId = params["ChangeMouTrxId"];
    });

  }
  
  ngOnInit() {
    this.arrValue.push(this.ChangeMouTrxId);
    this.http.post(URLConstant.GetChangeMouTrxbyTrxId, {ChangeMouTrxId : this.ChangeMouTrxId}).subscribe(
      (responseCMT) => {
        this.MouCustId = responseCMT["MouCustId"];  
        this.http.post(URLConstant.GetMouCustById, {MouCustId : this.MouCustId}).subscribe(
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
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }
}
