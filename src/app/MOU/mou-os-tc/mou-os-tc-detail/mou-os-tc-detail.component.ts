import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from 'app/MOU/mou-customer-request/mou-cust-tc/mou-cust-tc.component';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';

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
  viewObj: string;
  link: any;
  resultData: any;
  mouCustObject: MouCustObj = new MouCustObj();
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["MouCustId"];

      if (params["MrMouTypeCode"] != null) {
        this.mouType = params["MrMouTypeCode"];
      }
    })
  }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewMouHeader.json";
    this.mouCustObject.MouCustId = this.MouCustId;
    this.http.post(AdInsConstant.GetMouCustById, this.mouCustObject).subscribe(
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
    this.router.navigate(["/Mou/Cust/OutstandingTC/Paging"]);
  }

  saveMouTc() {
    if (this.mouType == AdInsConstant.GENERAL) {
      this.mouTcGeneral.Save();
    }
    else if (this.mouType == AdInsConstant.FACTORING) {
      this.mouTcFactoring.Save();
    }
  }
  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          // this.link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"];
          // window.open(this.link, '_blank');
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
