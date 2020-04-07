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
  inputGridObj : any;
  show : any;
  AppLifeInsHId : any;
  LifeInsObj :LifeInsObj;
  LifeInsDObj : LifeInsDObj;
  IsCustCover :any;
  mode : string ="add";
  ListObj : any = new Array();
  AppLifeInsD : any = new Array();

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,private fb:FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.mode = params["mode"];
      this.AppLifeInsHId = params["AppLifeInsHId"];
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
  MrLifeInsPaidMethodCode:any;

  ngOnInit() {
    if (this.mode == "edit") {
      var LifeInsObj = new LifeInsObj();
      LifeInsObj.AppLifeInsHId = this.AppLifeInsHId;
      this.http.post(AdInsConstant.GetAppGuarantorPersonalByAppGuarantorId, LifeInsObj).subscribe(
        (response) => {
          console.log("response: ");
          console.log(response);
          this.LifeInsForm.patchValue({
            // LifeInscoBranchName : response.LifeInsObj.MrCustRelationshipCode,
            // MrLifeInsPaidMethodCode : response.LifeInsObj.MrIdTypeCode,
            // TotalLifeInsCptlzAmt : response.LifeInsObj.MrGenderCode,
            // NewCoverNotes : response.appGuarantorPersonalObj.IdNo,
            // InscoAdminFeeAmt : response.appGuarantorPersonalObj.MrMaritalStatCode
          })
        },
        (error) => {
          console.log(error);
        }
      );
    }else{

      this.LifeInsObj = new LifeInsObj();
  
      var LifeInscoBranchNameObj ={
        MrVendorCategory:"LIFE_INSCO_BRANCH",
        OfficeCode: "HO",
        RowVersion:""
      }
      var paidMethodObj ={
        RefMasterTypeCode:"LIFE_INS_PAY_METHOD",
        RowVersion:""
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
  }

  checked(event){
    if(event.target.checked){
      this.show =true;
      this.IsCustCover = true;
    
    var lifeInsObj = new LifeInsObj();
    lifeInsObj.AppId = "11";
    lifeInsObj.MrLifeInsPaidMethodCode ="PAID_IN_ADV";
    this.http.post(AdInsConstant.InitAppLifeInsH,lifeInsObj).subscribe(
      (response) => {
        console.log("response: ");
        console.log(response);
        console.log(response["ReturnObject"])
        // this.inputGridObj.resultData["Data"] = new Array();
        // this.inputGridObj.resultData.Data = response["ListAppLifeInsD"];
        this.ListObj = response["ListAppLifeInsD"]
        this.AppLifeInsHId = response["AppLifeInsHId"];
      },
      (error) => {
        console.log(error);
      }
    );
    }else{
      this.IsCustCover = false;
    }
  }

  Save(){
    if(this.IsCustCover==true){
      this.LifeInsObj.IsCustCover=this.IsCustCover;
      this.LifeInsObj.LifeInscoBranchName =this.LifeInsForm.controls.LifeInscoBranchName.value;
      this.LifeInsObj.MrLifeInsPaidMethodCode = this.LifeInsForm.controls.MrLifeInsPaidMethodCode.value;
      this.LifeInsObj.TotalLifeInsCptlzAmt = this.LifeInsForm.controls.TotalLifeInsCptlzAmt.value;
      this.LifeInsObj.NewCoverNotes = this.LifeInsForm.controls.NewCoverNotes.value;
      this.LifeInsObj.InscoAdminFeeAmt = this.LifeInsForm.controls.InscoAdminFeeAmt.value;
      this.LifeInsObj.AppId = "11";
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
    }else{
      this.LifeInsObj.IsCustCover=this.IsCustCover;
    }
  }

  ObjSelected(event,i){
    if(event.target.checked){
      console.log("event checked");
      console.log(i);
      console.log(this.ListObj[i]);
      // this.LifeInsObj.LifeInsDObj = new LifeInsDObj();
      this.LifeInsObj.LifeInsDObj.InsuredName = this.ListObj[i].InsuredName;
      this.LifeInsObj.LifeInsDObj.Age = this.ListObj[i].Age;
      this.LifeInsObj.LifeInsDObj.MrCustTypeCode = this.ListObj[i].MrCustTypeCode;
    }else{
      console.log("event unchecked");
      console.log(i);
    }
  }

}
