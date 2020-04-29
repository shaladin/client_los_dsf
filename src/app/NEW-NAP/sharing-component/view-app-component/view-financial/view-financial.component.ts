import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { DatePipe } from '@angular/common';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AppInsuranceObj } from 'app/shared/model/AppInsuranceObj.Model';
import { AppInsMainCvgObj } from 'app/shared/model/AppInsMainCvgObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';

@Component({
  selector: "view-financial",
  templateUrl: "./view-financial.component.html",
  providers: [NGXToastrService]
})
export class ViewFinancialComponent implements OnInit {
  @Input() AppId: any;
  listSubsidy: Array<AppSubsidyObj> = new Array<AppSubsidyObj>();



  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

  }

  

  ngOnInit() {
    this.getFinancialData();
  }

  getFinancialData(){
    var reqObj = {AppId: this.AppId};
    this.http.post(AdInsConstant.GetFinancialDataByAppIdForView, reqObj).subscribe(
      (response) => {
        console.log(response);
        this.listSubsidy = response["AppSubsidyObjs"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
