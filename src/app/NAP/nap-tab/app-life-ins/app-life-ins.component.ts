import { Component, OnInit, Input } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { LifeInsObj } from 'app/shared/model/LifeInsObj.Model';
import { LifeInsDObj } from 'app/shared/model/LifeInsDObj.Model';

@Component({
  selector: 'app-app-life-ins',
  templateUrl: './app-life-ins.component.html',
  styleUrls: ['./app-life-ins.component.scss'],
  providers: [NGXToastrService]
})
export class AppLifeInsComponent implements OnInit {

  @Input() AppId: any;
  inputGridObj: any;
  show: any;
  LifeInsObj: LifeInsObj = new LifeInsObj();
  LifeInsDObj: LifeInsDObj;
  IsCustCover: any;
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
    LifeInscoBranchName: [''],
    MrLifeInsPaidMethodCode: [''],
    TotalLifeInsCptlzAmt: [''],
    NewCoverNotes: [''],
    InscoAdminFeeAmt: [''],
  });

  LifeInscoBranchName: any;
  MrLifeInsPaidMethodCode: any;

  ngOnInit() {
    // this.LifeInsObj = new LifeInsObj();

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

      this.http.post(AdInsConstant.GetVendorByCategoryCodeAndOfficeCode, LifeInscoBranchNameObj).subscribe(
        (response) => {
          console.log("response :");
          console.log(response);
          this.LifeInscoBranchName = response["ReturnObject"];
          this.LifeInsForm.patchValue({
            LifeInscoBranchName: this.LifeInscoBranchName[0].MasterCode
          });
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

  checked(event) {
    if (event.target.checked) {
      this.show =true;
      this.IsCustCover = true;
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
      this.IsCustCover = false;
    }
  
  }

  setValue() {
    if (this.IsCustCover == true) {
      this.LifeInsObj.IsCustCover = this.IsCustCover;
      this.LifeInsObj.LifeInscoBranchName = this.LifeInsForm.controls.LifeInscoBranchName.value;
      this.LifeInsObj.MrLifeInsPaidMethodCode = this.LifeInsForm.controls.MrLifeInsPaidMethodCode.value;
      this.LifeInsObj.TotalLifeInsCptlzAmt = this.LifeInsForm.controls.TotalLifeInsCptlzAmt.value;
      this.LifeInsObj.NewCoverNotes = this.LifeInsForm.controls.NewCoverNotes.value;
      this.LifeInsObj.InscoAdminFeeAmt = this.LifeInsForm.controls.InscoAdminFeeAmt.value;
      this.LifeInsObj.AppId = this.AppId;
    } else {
      this.LifeInsObj.IsCustCover = this.IsCustCover;
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
