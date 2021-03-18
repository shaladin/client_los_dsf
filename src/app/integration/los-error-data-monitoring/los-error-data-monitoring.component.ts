import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { environment } from 'environments/environment';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-los-error-data-monitoring',
  templateUrl: './los-error-data-monitoring.component.html',
})
export class LOSErrorDataMonitoringComponent implements OnInit {

  inputPagingObj: any;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private toastr: NGXToastrService) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchLosErrorData.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLosErrorData.json";
  }

  async GetCallBack(ev: any) {
    console.log(ev);

    if (ev.Key == "ReSend") {
      var LosAppObj = {
        TrxNo: ev.RowObj.AppNo
      };
      await this.http.post(URLConstant.ReSendLosR3DataToR2, LosAppObj).toPromise().then(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
        }
      );
    }
  }
}
