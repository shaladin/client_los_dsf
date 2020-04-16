import { Component, OnInit, Input } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { LifeInsObj } from 'app/shared/model/LifeInsObj.Model';
import { LifeInsDObj } from 'app/shared/model/LifeInsDObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-app-life-ins',
  templateUrl: './app-life-ins.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class AppLifeInsComponent implements OnInit {

  @Input() AppId: any;
  inputGridObj: any;
  show: any;
  LifeInsObj: LifeInsObj = new LifeInsObj();
  LifeInsDObj: LifeInsDObj;
  IsChecked: any;
  mode: string = "add";
  ListObj: any = new Array();
  AppLifeInsD: any = new Array();
  result: any;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.mode = params["mode"];
      this.AppId = params["AppId"];
    })
  }

  LifeInsForm = this.fb.group({
    IsChecked : [false],
    LifeInscoBranchName: [''],
    MrLifeInsPaidMethodCode: [''],
    TotalLifeInsCptlzAmt: [''],
    NewCoverNotes: [''],
    InscoAdminFeeAmt: [''],
  });

  LifeInscoBranchName: any;
  MrLifeInsPaidMethodCode: any;

  ngOnInit() {

    if (this.mode == "edit") {
      // var LifeInsObj = new LifeInsObj();
      this.show = true;
      this.LifeInsObj.AppId = this.AppId;
      console.log(this.LifeInsObj);
      this.http.post(AdInsConstant.GetAppLifeInsHByAppId, LifeInsObj).subscribe(
        (response) => {
          this.result = response;
          console.log("response: ");
          console.log(response);
          this.LifeInsForm.patchValue({
            LifeInscoBranchName: this.result.LifeInsObj.LifeInscoBranchName,
            MrLifeInsPaidMethodCode: this.result.LifeInsObj.MrLifeInsPaidMethodCode,
            TotalLifeInsCptlzAmt: this.result.LifeInsObj.TotalLifeInsCptlzAmt,
            NewCoverNotes: this.result.appGuarantorPersonalObj.NewCoverNotes,
            InscoAdminFeeAmt: this.result.appGuarantorPersonalObj.InscoAdminFeeAmt
          })
        },
        (error) => {
          console.log(error);
        }
      );
    }

      var LifeInscoBranchNameObj = {
        MrVendorCategory: "LIFE_INSCO_BRANCH",
        OfficeCode: "HO",
        RowVersion: ""
      }
      var paidMethodObj = {
        RefMasterTypeCode: "LIFE_INS_PAY_METHOD",
        RowVersion: ""
      }

      this.http.post(AdInsConstant.GetListVendorByCategoryCodeAndOfficeCode, LifeInscoBranchNameObj).subscribe(
        (response) => {
          console.log("response :");
          console.log(response);
          this.LifeInscoBranchName = response;
          this.LifeInsObj.LifeInscoBranchCode = response["VendorCode"];
          console.log(this.LifeInsObj.LifeInscoBranchCode);
          // this.LifeInsForm.patchValue({
          //   LifeInscoBranchName: this.LifeInscoBranchName[0].MasterCode
          // });
        }
      );
      this.http.post(AdInsConstant.GetListActiveRefMaster, paidMethodObj).subscribe(
        (response) => {
          this.MrLifeInsPaidMethodCode = response["ReturnObject"];
          this.LifeInsForm.patchValue({
            MrLifeInsPaidMethodCode: this.MrLifeInsPaidMethodCode[0].Key
          });
        }
      );
  }

  checked() {
    this.IsChecked = this.LifeInsForm.controls.IsChecked.value;
    if (this.IsChecked) {
      this.show =true;
      var lifeInsObj = new LifeInsObj();
      lifeInsObj.AppId = this.AppId;
      lifeInsObj.MrLifeInsPaidMethodCode = "PAID_IN_ADV";
      this.http.post(AdInsConstant.InitAppLifeInsH, lifeInsObj).subscribe(
        (response) => {
          console.log("response: ");
          console.log(response);
          this.ListObj = response["ListAppLifeInsD"]
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.show = false;
    }
  
  }

  setValue() {
    if (this.IsChecked ) {
      this.LifeInsObj.LifeInscoBranchName = this.LifeInsForm.controls.LifeInscoBranchName.value;
      this.LifeInsObj.MrLifeInsPaidMethodCode = this.LifeInsForm.controls.MrLifeInsPaidMethodCode.value;
      this.LifeInsObj.TotalLifeInsCptlzAmt = this.LifeInsForm.controls.TotalLifeInsCptlzAmt.value;
      this.LifeInsObj.NewCoverNotes = this.LifeInsForm.controls.NewCoverNotes.value;
      this.LifeInsObj.InscoAdminFeeAmt = this.LifeInsForm.controls.InscoAdminFeeAmt.value;
      this.LifeInsObj.AppId = this.AppId;
    } else {
    }
  }

  Save() {
    this.setValue();
    if (this.mode == "edit") {
      this.LifeInsObj.AppId = this.AppId;
      this.http.post(AdInsConstant.EditAppLifeInsH, this.LifeInsObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          // this.router.navigate(["/Guarantor/paging"]);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.http.post(AdInsConstant.AddAppLifeInsH, this.LifeInsObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          // this.router.navigate(["/Guarantor/paging"]);
        },
        (error) => {
          console.log(error);
        }
      );

    }
  }

  ObjSelected(event, i) {
    if (event.target.checked) {
      console.log("event checked");
      console.log(i);
      console.log(this.ListObj[i]);
      // this.LifeInsObj.LifeInsDObj = new LifeInsDObj();
      this.LifeInsObj.LifeInsDObj.InsuredName = this.ListObj[i].InsuredName;
      this.LifeInsObj.LifeInsDObj.Age = this.ListObj[i].Age;
      this.LifeInsObj.LifeInsDObj.MrCustTypeCode = this.ListObj[i].MrCustTypeCode;
      
    } else {
      console.log("event unchecked");
      console.log(i);
    }
  }

}
