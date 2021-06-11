import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppReservedFundObj } from 'app/shared/model/AppReservedFundObj.model';

@Component({
  selector: "view-reserved-fund",
  templateUrl: "./view-reserved-fund.component.html",
  providers: [NGXToastrService]
})
export class ViewReservedFundComponent implements OnInit {
  @Input() appId: number;
  RsvFundObj: Array<AppReservedFundObj> = new Array<AppReservedFundObj>();
  totalRsvFund: number = 0;

  constructor(private http: HttpClient) {
    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.appId = params['AppId'];
    //  }
    //});
  }

  ngOnInit() {
    this.GetRsvFundData();
  }

  GetRsvFundData() {
    this.http.post(URLConstant.GetListAppReservedFundByAppId, { Id: this.appId }).subscribe(
      (response) => {
        this.RsvFundObj = response[CommonConstant.ReturnObj];
        if (this.RsvFundObj != null) {
          for (let i = 0; i < this.RsvFundObj.length; i++) {
            this.totalRsvFund = this.RsvFundObj[i].ReservedFundAmt;
          }
        }
      }
    );
  }
}
