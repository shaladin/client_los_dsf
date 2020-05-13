import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LifeInsObj } from 'app/shared/model/LifeInsObj.Model';
import { LifeInsDObj } from 'app/shared/model/LifeInsDObj.Model';

@Component({
  selector: 'app-life-insurance-data',
  templateUrl: './life-insurance-data.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class LifeInsuranceDataComponent implements OnInit {

  @Input() AppId: any;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  inputGridObj: any;
  show: any;
  LifeInsObj: LifeInsObj = new LifeInsObj();
  LifeInsDObj: LifeInsDObj;
  IsChecked: any;
  mode: string = "add";
  ListObj: Array<LifeInsDObj> = new Array<LifeInsDObj>();
  AppLifeInsD: any = new Array();
  result: any;

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
    TotalLifeInsCptlzAmt: [''],
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
    this.http.post(AdInsConstant.GetAppLifeInsHByAppId, this.LifeInsObj).subscribe(
      (response) => {
        console.log("response: ");
        console.log(response);
        this.result = response;
        this.AppLifeInsHId = this.result.AppLifeInsHId;
        if (this.result.ListAppLifeInsD != null && this.result.ListAppLifeInsD != undefined) {
          for (let i = 0; i < this.result.ListAppLifeInsD.length; i++) {
            this.AppLifeInsD[i] = this.result.ListAppLifeInsD[i]["AppLifeInsDId"];
          }
        }
        console.log(this.AppLifeInsD);
        if (this.result.AppLifeInsHId != 0) {
          this.mode = "edit";
          this.show = true;
          this.IsChecked = true;
          this.ListObj = new Array<LifeInsDObj>();
          this.ListObj = [...this.result.ListAppLifeInsD];
          // if (this.ListObj.length > 0) {
          //   for(let i=0;i<this.ListObj.length;i++){
          //     this.ObjSelected(checked,i){
          //     }
          //   }
          // }
          this.LifeInsObj.ListAppLifeInsD = new Array<LifeInsDObj>();
          this.LifeInsObj.ListAppLifeInsD = [...this.result.ListAppLifeInsD];
          this.LifeInsForm.patchValue({
            IsChecked: true,
            LifeInscoBranchName: this.result.LifeInscoBranchCode,
            MrLifeInsPaidMethodCode: this.result.MrLifeInsPaidMethodCode,
            TotalLifeInsCptlzAmt: this.result.TotalLifeInsCptlzAmt,
            NewCoverNotes: this.result.NewCoverNotes,
            InscoAdminFeeAmt: this.result.InscoAdminFeeAmt
          })
        }
        else {
          this.mode = "add";
          this.show = false;
        }

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
    await this.http.post(AdInsConstant.GetListActiveRefMaster, paidMethodObj).toPromise().then(
      (response) => {
        this.MrLifeInsPaidMethodCode = response["ReturnObject"];
        this.LifeInsForm.patchValue({
          MrLifeInsPaidMethodCode: this.MrLifeInsPaidMethodCode[0].Key
        });
      }
    );
  }

  async initBranchName() {
    var LifeInscoBranchNameObj = {
      MrVendorCategory: "LIFE_INSCO_BRANCH",
      OfficeCode: "HO",
      RowVersion: ""
    }
    await this.http.post<Array<object>>(AdInsConstant.GetListVendorByCategoryCodeAndOfficeCode, LifeInscoBranchNameObj).toPromise().then(
      (response) => {
        this.LifeInscoBranchName = response;
      }
    );

  }

  initAppLifeInsD() {
    var lifeInsObj = new LifeInsObj();
    lifeInsObj.AppId = this.AppId;
    lifeInsObj.MrLifeInsPaidMethodCode = "PAID_IN_ADV";
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
      this.initAppLifeInsD();
      console.log(this.LifeInsObj.ListAppLifeInsD);
    } else {
      this.show = false;
      this.ClearForm();
      console.log(this.LifeInsObj.ListAppLifeInsD);

    }

  }

  setValue() {
    if (this.IsChecked) {
      this.LifeInsObj.LifeInscoBranchCode = this.LifeInsForm.controls.LifeInscoBranchName.value;
      this.LifeInsObj.LifeInscoBranchName = this.LifeInscoBranchName.find(i => i["VendorCode"] == this.LifeInsForm.controls.LifeInscoBranchName.value)["VendorName"];
      this.LifeInsObj.MrLifeInsPaidMethodCode = this.LifeInsForm.controls.MrLifeInsPaidMethodCode.value;
      this.LifeInsObj.TotalLifeInsCptlzAmt = this.LifeInsForm.controls.TotalLifeInsCptlzAmt.value;
      this.LifeInsObj.NewCoverNotes = this.LifeInsForm.controls.NewCoverNotes.value;
      this.LifeInsObj.InscoAdminFeeAmt = this.LifeInsForm.controls.InscoAdminFeeAmt.value;
      this.LifeInsObj.AppId = this.AppId;
    } else {
    }
  }

  calculateFee(object){
    object.LifeInscoBranchCode = this.LifeInsForm.controls.LifeInscoBranchName.value;
    this.http.post(AdInsConstant.CalculateRate, object).subscribe(
      response => {
        console.log(response);
        this.result = response;
        for(let i =0;i<this.result.length;i++){
          this.LifeInsObj.ListAppLifeInsD[i].CustRate = this.result[i].CustRate;
          this.LifeInsObj.ListAppLifeInsD[i].BaseRate = this.result[i].BaseRate;
          this.LifeInsObj.ListAppLifeInsD[i].InscoRate = this.result[i].InscoRate;
          this.LifeInsObj.ListAppLifeInsD[i].SumInsured = this.result[i].SumInsured;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  calculateDisc(object){
    this.http.post(AdInsConstant.CalculateDisc, object).subscribe(
      response => {
        console.log(response);
        this.result = response;
        for(let i =0;i<this.result.length;i++){
          this.LifeInsObj.ListAppLifeInsD[i].DiscRate = this.result[i].DiscRate;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  Save() {
    this.setValue();
    this.calculateFee(this.LifeInsObj.ListAppLifeInsD);
    if (this.mode == "edit") {
      if(this.IsChecked){
        this.LifeInsObj.AppId = this.AppId;
        this.LifeInsObj.AppLifeInsHId = this.AppLifeInsHId;
        for (let i = 0; i < this.AppLifeInsD.length; i++) {
          this.LifeInsObj.ListAppLifeInsD[i].AppLifeInsDId = this.AppLifeInsD[i]
        }
        this.http.post(AdInsConstant.EditAppLifeInsH, this.LifeInsObj).subscribe(
          response => {
            this.toastr.successMessage(response["message"]);
            // this.wizard.goToNextStep()
            this.outputTab.emit();
          },
          error => {
            console.log(error);
          }
        );

      }else{
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
    }else {
      this.http.post(AdInsConstant.AddAppLifeInsH, this.LifeInsObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          // this.wizard.goToNextStep()
          this.outputTab.emit();
        },
        (error) => {
          console.log(error);
        }
      );

    }
  }

  cek() {
    this.calculateDisc(this.LifeInsObj.ListAppLifeInsD);
  }

  ObjSelected(event, i) {
    if (event.target.checked) {
      console.log("event checked");
      console.log(this.ListObj[i]);
      var LifeInsD = new LifeInsDObj();
      LifeInsD.InsuredName = this.ListObj[i]["InsuredName"];
      LifeInsD.Age = this.ListObj[i]["Age"];
      LifeInsD.MrCustTypeCode = this.ListObj[i]["MrCustTypeCode"];
      LifeInsD.SeqNo = i+1;
      this.LifeInsObj.ListAppLifeInsD[i] = LifeInsD;
    } else {
      console.log("event unchecked");
      this.LifeInsObj.ListAppLifeInsD.splice(i, 1);
    }
  }


  ClearForm() {
    this.LifeInsForm = this.fb.group({
      IsChecked: [false],
      LifeInscoBranchName: [''],
      MrLifeInsPaidMethodCode: [''],
      TotalLifeInsCptlzAmt: [''],
      NewCoverNotes: [''],
      InscoAdminFeeAmt: [''],
    });
  }

}
