import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-los-error-data-monitoring',
  templateUrl: './los-error-data-monitoring.component.html',
})
export class LOSErrorDataMonitoringComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  constructor(private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchLosErrorData.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLosErrorData.json";
  }

  async GetCallBack(ev: any) {
    if (ev.Key == "ReSend") {
      var LosAppObj = {
        TrxNo: ev.RowObj.AppNo
      };
      await this.http.post(URLConstant.ReSendLosR3DataToR2, LosAppObj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }
}
