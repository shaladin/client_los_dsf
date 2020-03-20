import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-app-guarantor',
  templateUrl: './app-guarantor.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class AppGuarantorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.param = params["AppGuarantorId"];
      this.param1 = params["MrGuarantorTypeCode"]
      console.log(params);
      this.mode = params["mode"];
      if (this.mode == "edit") {
        var tempCrit = new CriteriaObj();
        tempCrit.propName = this.key;
        tempCrit.restriction = "Eq";
        tempCrit.value = this.param;
        this.criteria.push(tempCrit);
      }
    })
  }

  param : string;
  param1 : string;
  key: any;
  criteria: CriteriaObj[] = [];
  CustTypeObj: any;
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  mode: string;
  getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;

  CustDataForm = this.fb.group({
    MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]]
  });

  AppGuarantorId:any;
  MrCustTypeCode:any;
  ngOnInit() {
    if (this.mode == "edit") {
      this.MrCustTypeCode = this.param1.toUpperCase();
      this.bindCustTypeObj(this.MrCustTypeCode);
      this.CustDataForm.controls.MrCustTypeCode.disable();
    }
    else {
      this.bindCustTypeObj();
    }
  }

  bindCustTypeObj(MrCustTypeCode? : string) {
    this.refMasterObj.RefMasterTypeCode = "CUST_TYPE";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        console.log("Response");
        console.log(response);
        this.CustTypeObj = response["ReturnObject"];
        if (this.CustTypeObj.length > 0) {
          if(MrCustTypeCode == undefined){
            this.CustDataForm.patchValue({
              MrCustTypeCode: this.CustTypeObj[0].Key
            });
          }
          else{
            this.CustDataForm.patchValue({
              MrCustTypeCode: MrCustTypeCode
            });
          }
        }
      }
    );
  }

}
