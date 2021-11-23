import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { DatePipe } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppReservedFundObj } from 'app/shared/model/app-reserved-fund-obj.model';
@Component({
  selector: "view-reserved-fund",
  templateUrl: "./view-reserved-fund.component.html",
  providers: [NGXToastrService]
})
export class ViewReservedFundComponent implements OnInit {
  @Input() appId: any;


  appObj = {
    AppId: 0,
  };

  AppObj: any;
  RsvFundObj: Array<AppReservedFundObj> = new Array<AppReservedFundObj>();
  totalRsvFund: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.appId = params['AppId'];
    //  }
    //});
  }

  ngOnInit() {
    this.appObj.AppId = this.appId;
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
