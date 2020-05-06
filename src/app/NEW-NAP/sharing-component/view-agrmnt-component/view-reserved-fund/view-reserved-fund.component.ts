import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { DatePipe } from '@angular/common';

@Component({
  selector: "agrmnt-view-reserved-fund",
  templateUrl: "./view-reserved-fund.component.html",
  providers: [NGXToastrService]
})
export class ViewAgrmntReservedFundComponent implements OnInit {

  @Input() agrmntId: any;


  agrmntObj = {
    AgrmntId: 0,
  };

  AppObj: any;
  RsvFundObj: any;
  totalRsvFund: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    //this.route.queryParams.subscribe(params => {
    //  if (params['AppId'] != null) {
    //    this.agrmntId = params['AppId'];
    //  }
    //});
  }


  ngOnInit() {
    this.agrmntObj.AgrmntId = this.agrmntId;
    this.GetRsvFundData();

  }

  GetRsvFundData() {
    this.http.post(AdInsConstant.GetListAgrmntReservedFundByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        console.log(response);
        this.RsvFundObj = response["ReturnObject"];
        if (this.RsvFundObj != null) {
          for (let i = 0; i < this.RsvFundObj.length; i++) {
            this.totalRsvFund = this.RsvFundObj[i].ReservedFundAmt;
          }
        }
      }
    );
  }

}
