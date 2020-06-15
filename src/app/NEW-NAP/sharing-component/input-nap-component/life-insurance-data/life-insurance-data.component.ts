import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LifeInsObj } from 'app/shared/model/LifeInsObj.Model';
import { LifeInsDObj } from 'app/shared/model/LifeInsDObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';

@Component({
  selector: 'app-life-insurance-data',
  templateUrl: './life-insurance-data.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class LifeInsuranceDataComponent implements OnInit {

  @Input() AppId: any;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  inputGridObj: any;
  show: any;
  LifeInsObj: LifeInsObj = new LifeInsObj();
  LifeInsDObj: LifeInsDObj;
  IsChecked: any;
  mode: string = "add";
  ListObj: Array<LifeInsDObj> = new Array<LifeInsDObj>();
  AppLifeInsD: any = new Array();
  result: any;

  minInsLength: number = 1;
  maxInsLength: number = 99;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.mode = params["mode"];
      this.AppId = params["AppId"];
    })
  }

  LifeInsForm = this.fb.group({
    IsChecked: [false],
    LifeInscoBranchName: [''],
    MrLifeInsPaidMethodCode: [''],
    PaidInAdvPrcnt: [''],
    NewCoverNotes: [''],
    InscoAdminFeeAmt: [''],
  });

  LifeInscoBranchName: Array<object>;
  MrLifeInsPaidMethodCode: any;
  AppLifeInsHId: any;

  async ngOnInit(): Promise<void> {
    await this.initPaidMethod();
    await this.initBranchName();
    this.LifeInsObj.AppId = this.AppId;
    console.log(this.LifeInsObj);

    this.http.post<AppCustObj>(AdInsConstant.GetAppCustByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        if (response.MrCustTypeCode == "COMPANY") {
          this.LifeInsForm.controls["IsChecked"].disable();
        }
      },
      (error) => {
        console.log(error);
      });

    this.http.post(AdInsConstant.GetAppLifeInsHByAppId, this.LifeInsObj).subscribe(
      (response) => {
        this.result = response;
        this.AppLifeInsHId = this.result.AppLifeInsHId;
        console.log(this.AppLifeInsD);
        if (this.result.AppLifeInsHId != 0) {
          this.mode = "edit";
          this.show = true;
          this.IsChecked = true;
          this.LifeInsForm.patchValue({
            IsChecked: true,
            LifeInscoBranchName: this.result.LifeInscoBranchCode,
            MrLifeInsPaidMethodCode: this.result.MrLifeInsPaidMethodCode,
            PaidInAdvPrcnt: 100-this.result.PaidInAdvPrcnt,
            NewCoverNotes: this.result.NewCoverNotes,
            InscoAdminFeeAmt: this.result.InscoAdminFeeAmt
          })
          this.checked();
        }
        else {
          this.mode = "add";
          this.show = false;
        }
        this.PremiMethodForm();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async initPaidMethod() {
    var paidMethodObj = {
      RefMasterTypeCode: "LIFE_INS_PAY_METHOD",
      RowVersion: ""
    }
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, paidMethodObj).toPromise().then(
      (response) => {
        this.MrLifeInsPaidMethodCode = response["ReturnObject"];
        //this.LifeInsForm.patchValue({
        //  MrLifeInsPaidMethodCode: this.MrLifeInsPaidMethodCode[0].Key
        //});
      }
    );
  }
  LifeInscoBranchNameObj = {
    MrVendorCategory: "LIFE_INSCO_BRANCH",
    OfficeCode: "",
    RowVersion: ""
  }
  async initBranchName() {
    await this.http.post(AdInsConstant.GetAppById, { AppId: this.AppId }).toPromise().then(
      (response) => {
        this.LifeInscoBranchNameObj.OfficeCode = response["OriOfficeCode"];
      } 
    );
    console.log(this.LifeInscoBranchNameObj);
    await this.http.post<Array<object>>(AdInsConstant.GetListVendorByCategoryCodeAndOfficeCode, this.LifeInscoBranchNameObj).toPromise().then(
      (response) => {
        this.LifeInscoBranchName = response;
      }
    );

  }

  initAppLifeInsD() {
    var lifeInsObj = new LifeInsObj();
    lifeInsObj.AppId = this.AppId;
    this.http.post(AdInsConstant.InitAppLifeInsH, lifeInsObj).subscribe(
      (response) => {
        this.ListObj = new Array<LifeInsDObj>();
        this.ListObj = response["ListAppLifeInsD"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checked() {
    this.IsChecked = this.LifeInsForm.controls.IsChecked.value;
    if (this.IsChecked) {
      this.show = true;
      this.setValidator();
      this.initAppLifeInsD();
      console.log(this.LifeInsObj.ListAppLifeInsD);
    } else {
      this.show = false;
      this.unsetValidator();
    }

  }

  setValidator() {
    this.LifeInsForm.controls.LifeInscoBranchName.setValidators(Validators.required);
    this.LifeInsForm.controls.LifeInscoBranchName.updateValueAndValidity();
    this.LifeInsForm.controls.MrLifeInsPaidMethodCode.setValidators(Validators.required);
    this.LifeInsForm.controls.MrLifeInsPaidMethodCode.updateValueAndValidity();
    this.LifeInsForm.controls.PaidInAdvPrcnt.setValidators([Validators.required]);
    this.LifeInsForm.controls.PaidInAdvPrcnt.updateValueAndValidity();
    this.LifeInsForm.controls.InscoAdminFeeAmt.setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
    this.LifeInsForm.controls.InscoAdminFeeAmt.updateValueAndValidity();
  }
  unsetValidator() {
    this.LifeInsForm.controls.LifeInscoBranchName.clearValidators();
    this.LifeInsForm.controls.LifeInscoBranchName.updateValueAndValidity();
    this.LifeInsForm.controls.MrLifeInsPaidMethodCode.clearValidators();
    this.LifeInsForm.controls.MrLifeInsPaidMethodCode.updateValueAndValidity();
    this.LifeInsForm.controls.PaidInAdvPrcnt.clearValidators();
    this.LifeInsForm.controls.PaidInAdvPrcnt.updateValueAndValidity();
    this.LifeInsForm.controls.InscoAdminFeeAmt.clearValidators();
    this.LifeInsForm.controls.InscoAdminFeeAmt.updateValueAndValidity();
  }

  setValue() {
    if (this.IsChecked) {
      this.LifeInsObj.LifeInscoBranchCode = this.LifeInsForm.controls.LifeInscoBranchName.value;
      this.LifeInsObj.LifeInscoBranchName = this.LifeInscoBranchName.find(i => i["VendorCode"] == this.LifeInsForm.controls.LifeInscoBranchName.value)["VendorName"];
      this.LifeInsObj.MrLifeInsPaidMethodCode = this.LifeInsForm.controls.MrLifeInsPaidMethodCode.value;
      this.LifeInsObj.PaidInAdvPrcnt = this.LifeInsForm.controls.PaidInAdvPrcnt.value;
      this.LifeInsObj.NewCoverNotes = this.LifeInsForm.controls.NewCoverNotes.value;
      this.LifeInsObj.InscoAdminFeeAmt = this.LifeInsForm.controls.InscoAdminFeeAmt.value;
      this.LifeInsObj.AppId = this.AppId;
    } else {
    }
  }

  async calculateAdminFee(ev) {
    console.log(ev);
    var object = {
      AppId: this.AppId,
      VendorCode: ev.target.value
    }
    await this.http.post(AdInsConstant.GetRuleAdmFee, object).toPromise().then(
      response => {
        console.log(response);
        this.LifeInsObj.CustAdminFeeAmt = response["AdminFeeToCust"][0];
        this.LifeInsForm.patchValue({
          InscoAdminFeeAmt: response["AdminFeeFromInscoBranch"][0]
        })
      },
      error => {
        console.log(error);
      }
    );
  }

  isCoverCheck() {
    for (let i = 0; i < this.LifeInsObj.ListAppLifeInsD.length; i++) {
      console.log(this.LifeInsObj.ListAppLifeInsD[i].MrCustTypeCode);
      if (this.LifeInsObj.ListAppLifeInsD[i].MrCustTypeCode == "CUSTOMER") {
        this.LifeInsObj.IsCustCover = true;
      }
      if (this.LifeInsObj.ListAppLifeInsD[i].MrCustTypeCode == "SPOUSE") {
        this.LifeInsObj.IsSpouseCover = true;
      }
      if (this.LifeInsObj.ListAppLifeInsD[i].MrCustTypeCode == "GUARANTOR") {
        this.LifeInsObj.IsGuarantorCover = true;
      }
    }
  }

  checkSubject() {
    if (this.LifeInsObj.ListAppLifeInsD.length == 0) {
      this.toastr.errorMessage("Minimal 1 Subject ");
      return false;
    } else {
      return true;
    }
  }

  async SaveForm() {
    this.setValue();
    this.isCoverCheck();
    if (this.IsChecked) {
      if (this.checkSubject() == false) return;
      this.LifeInsObj.AppId = this.AppId;
      this.http.post(AdInsConstant.AddEditAppLifeInsH, this.LifeInsObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          // this.wizard.goToNextStep()
          this.outputTab.emit();
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.LifeInsObj.AppLifeInsHId = this.AppLifeInsHId;
      this.http.post(AdInsConstant.DeleteAppLifeIns, this.LifeInsObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          // this.wizard.goToNextStep()
          this.outputTab.emit();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  Cancel() {
    this.outputCancel.emit();
  }

  ObjSelected(event, i) {
    if (event.target.checked) {
      console.log("event checked");
      var LifeInsD = new LifeInsDObj();
      LifeInsD.InsuredName = this.ListObj[i]["InsuredName"];
      LifeInsD.Age = this.ListObj[i]["Age"];
      LifeInsD.MrCustTypeCode = this.ListObj[i]["MrCustTypeCode"];
      LifeInsD.SeqNo = i + 1;
      var object = {
        AppId: this.AppId,
        VendorCode: this.LifeInsForm.controls.LifeInscoBranchName.value,
        Age: LifeInsD.Age,
        SeqNo: LifeInsD.SeqNo
      }
      console.log("Object Checked : " + JSON.stringify(object));
      this.http.post(AdInsConstant.GetRuleRate, object).toPromise().then(
        response => {
          console.log(response);
          console.log(response["DiscRate"]);
          LifeInsD.BaseRate = response["BaseRate"];
          LifeInsD.CustRate = response["CustRate"];
          LifeInsD.InscoRate = response["InscoRate"];
          LifeInsD.SumInsured = response["SumInsured"];
          LifeInsD.DiscRate = response["DiscRate"];
        },
        error => {
          console.log(error);
        }
      );
      this.LifeInsObj.ListAppLifeInsD.push(LifeInsD);
      console.log(this.LifeInsObj.ListAppLifeInsD);
    } else {
      console.log("event unchecked");
      var index = this.LifeInsObj.ListAppLifeInsD.findIndex(x => x.InsuredName == this.ListObj[i].InsuredName);
      this.LifeInsObj.ListAppLifeInsD.splice(index, 1);
      console.log(this.LifeInsObj.ListAppLifeInsD[i]);
      console.log(this.LifeInsObj.ListAppLifeInsD);
    }
  }

  PremiMethodChanged(event) {
    if (event.target.value == "PAID_IN_ADV") {
      this.LifeInsForm.patchValue({
        PaidInAdvPrcnt: 0

      });
      this.LifeInsForm.controls["PaidInAdvPrcnt"].disable();
    }
    else if (event.target.value == "CPTLZ") {
      this.LifeInsForm.patchValue({
        PaidInAdvPrcnt: 100

      });
      this.LifeInsForm.controls["PaidInAdvPrcnt"].disable();
    }
    else {
      this.LifeInsForm.controls["PaidInAdvPrcnt"].enable();
    }
  }

  PremiMethodForm() {
    if (this.LifeInsForm.controls["MrLifeInsPaidMethodCode"].value == "PAID_IN_ADV") {
      this.LifeInsForm.patchValue({
        PaidInAdvPrcnt: 0

      });
      this.LifeInsForm.controls["PaidInAdvPrcnt"].disable();
    }
    else if (this.LifeInsForm.controls["MrLifeInsPaidMethodCode"].value == "CPTLZ") {
      this.LifeInsForm.patchValue({
        PaidInAdvPrcnt: 100

      });
      this.LifeInsForm.controls["PaidInAdvPrcnt"].disable();
    }
    else {
      this.LifeInsForm.controls["PaidInAdvPrcnt"].enable();
    }
  }

}
