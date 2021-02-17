import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from 'app/MOU/mou-customer-request/mou-cust-tc/mou-cust-tc.component';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-mou-os-tc-detail',
  templateUrl: './mou-os-tc-detail.component.html',
  providers: [NGXToastrService]

})
export class MouOsTcDetailComponent implements OnInit {
  @ViewChild("MouTcGeneral") public mouTcGeneral: MouCustTcComponent;
  @ViewChild("MouTcFactoring") public mouTcFactoring: MouCustTcComponent;
  MouCustId: number = 0;
  mouType: string;
  link: any;
  resultData: any;
  mouCustObject: MouCustObj = new MouCustObj();

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];

      if (params["MrMouTypeCode"] != null) {
        this.mouType = params["MrMouTypeCode"];
      }
    })
  }

  ngOnInit() {
    this.mouCustObject.MouCustId = this.MouCustId;
    this.http.post(URLConstant.GetMouCustById, this.mouCustObject).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
      }
    );
  }

  getValue(response) {
    if (response["StatusCode"].toString() == "200") {
      this.redirect();
    }
  }

  back() {
    this.redirect();
  }

  redirect() {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_CUST_OUTSTANDING_TC_PAGING],{});
  }

  saveMouTc() {
    if (this.mouType == CommonConstant.GENERAL) {
      this.mouTcGeneral.Save();
    }
    else if (this.mouType == CommonConstant.FACTORING) {
      this.mouTcFactoring.Save();
    }
  }
}
