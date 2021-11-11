import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppSubsidyObj } from 'app/shared/model/app-subsidy-obj.model';
import { AppFeeObj } from 'app/shared/model/app-fee-obj.model';
import { AppFinDataObj } from 'app/shared/model/app-fin-data/app-fin-data.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { InstallmentObj } from 'app/shared/model/app-fin-data/installment-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: "view-financial",
  templateUrl: "./view-financial.component.html",
  providers: [NGXToastrService]
})

export class ViewFinancialComponent implements OnInit {
  @Input() AppId: number;
  listSubsidy: Array<AppSubsidyObj> = new Array<AppSubsidyObj>();
  listAppFeeObj: Array<AppFeeObj> = new Array<AppFeeObj>();
  appFinDataObj: AppFinDataObj = new AppFinDataObj();
  appObj: NapAppModel = new NapAppModel();
  listInstallment: Array<InstallmentObj> = new Array<InstallmentObj>();

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.getFinancialData();
  }

  getFinancialData() {
    var reqObj = { Id: this.AppId };
    this.http.post(URLConstant.GetFinancialDataByAppIdForView, reqObj).subscribe(
      (response) => {
        this.listSubsidy = response["AppSubsidyObjs"];
        this.listAppFeeObj = response["AppFeeObjs"];
        this.appFinDataObj = response["AppFinDataObj"];
        this.appObj = response["AppObj"];
        this.listInstallment = response["InstallmentObjs"];
      });
  }

}
