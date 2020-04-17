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
  ListObj: any = new Array<LifeInsDObj>();
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

  LifeInscoBranchName: Array<object>;
  MrLifeInsPaidMethodCode: any;
  AppLifeInsHId: any;

  ngOnInit() {
      this.LifeInsObj.AppId = this.AppId;
      console.log(this.LifeInsObj);
      this.http.post(AdInsConstant.GetAppLifeInsHByAppId, this.LifeInsObj).subscribe(
        (response) => {
          console.log("response: ");
          console.log(response);
          this.result = response;
          this.AppLifeInsHId = this.result.AppLifeInsHId;
          for(let i =0; i<this.result.ListAppLifeInsD.length;i++){
            this.AppLifeInsD[i] = this.result.ListAppLifeInsD[i]["AppLifeInsDId"];
          }
          console.log(this.AppLifeInsD);
          if(this.result.AppLifeInsHId != 0){
            this.mode="edit";
            this.show = true;
            this.initAppLifeInsD();
            this.IsChecked = true;
            this.LifeInsForm.patchValue({
              IsChecked: true,
              LifeInscoBranchName: this.result.LifeInscoBranchName,
              MrLifeInsPaidMethodCode: this.result.MrLifeInsPaidMethodCode,
              TotalLifeInsCptlzAmt: this.result.TotalLifeInsCptlzAmt,
              NewCoverNotes: this.result.NewCoverNotes,
              InscoAdminFeeAmt: this.result.InscoAdminFeeAmt
            })
          }
          else{
            this.mode="add";
            this.show=false;
          }
          this.initPaidMethod();
          this.initBranchName();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  initPaidMethod(){
    var paidMethodObj = {
      RefMasterTypeCode: "LIFE_INS_PAY_METHOD",
      RowVersion: ""
    }
    this.http.post(AdInsConstant.GetListActiveRefMaster, paidMethodObj).subscribe(
      (response) => {
        this.MrLifeInsPaidMethodCode = response["ReturnObject"];
        this.LifeInsForm.patchValue({
          MrLifeInsPaidMethodCode: this.MrLifeInsPaidMethodCode[0].Key
        });
      }
    );
  }

  initBranchName(){
    var LifeInscoBranchNameObj = {
      MrVendorCategory: "LIFE_INSCO_BRANCH",
      OfficeCode: "HO",
      RowVersion: ""
    }
    this.http.post<Array<object>>(AdInsConstant.GetListVendorByCategoryCodeAndOfficeCode, LifeInscoBranchNameObj).subscribe(
      (response) => {
        this.LifeInscoBranchName = response;
      }
    );

  }

  initAppLifeInsD(){
    var lifeInsObj = new LifeInsObj();
    lifeInsObj.AppId = this.AppId;
    lifeInsObj.MrLifeInsPaidMethodCode = "PAID_IN_ADV";
    this.http.post(AdInsConstant.InitAppLifeInsH, lifeInsObj).subscribe(
      (response) => {
        this.ListObj = response["ListAppLifeInsD"]
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checked() {
    this.IsChecked = this.LifeInsForm.controls.IsChecked.value;
    if (this.IsChecked) {
      this.show =true;
      this.initAppLifeInsD();
    } else {
      this.show = false;
    }
  
  }

  setValue() {
    if (this.IsChecked) {
      this.LifeInsObj.LifeInscoBranchCode= this.LifeInsForm.controls.LifeInscoBranchName.value;
      this.LifeInsObj.LifeInscoBranchName = this.LifeInscoBranchName.find(i=>i["VendorCode"]== this.LifeInsForm.controls.LifeInscoBranchName.value)["VendorName"];
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
      this.LifeInsObj.AppLifeInsHId = this.AppLifeInsHId;
      for(let i =0;i<this.AppLifeInsD.length;i++){
        this.LifeInsObj.ListAppLifeInsD[i].AppLifeInsDId = this.AppLifeInsD[i]
      }
      this.http.post(AdInsConstant.EditAppLifeInsH, this.LifeInsObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
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
      this.LifeInsObj.ListAppLifeInsD[i] = new LifeInsDObj();
      this.LifeInsObj.ListAppLifeInsD[i].InsuredName = this.ListObj[i]["InsuredName"];
      this.LifeInsObj.ListAppLifeInsD[i].Age = this.ListObj[i]["Age"];
      this.LifeInsObj.ListAppLifeInsD[i].MrCustTypeCode = this.ListObj[i]["MrCustTypeCode"];
      
    } else {
      console.log("event unchecked");
      console.log(i);
    }
  }

}
