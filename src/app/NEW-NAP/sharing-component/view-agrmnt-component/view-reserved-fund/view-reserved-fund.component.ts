import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: "agrmnt-view-reserved-fund",
  templateUrl: "./view-reserved-fund.component.html",
  providers: [NGXToastrService]
})
export class ViewAgrmntReservedFundComponent implements OnInit {
  @Input() agrmntId: number;
  RsvFundObj: any;
  totalRsvFund: number = 0;

  constructor(private http: HttpClient) {
    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.agrmntId = params['AppId'];
    //  }
    //});
  }

  ngOnInit() {
    this.GetRsvFundData();
  }

  GetRsvFundData() {
    this.http.post(URLConstant.GetListAgrmntReservedFundByAgrmntId, { Id: this.agrmntId }).subscribe(
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