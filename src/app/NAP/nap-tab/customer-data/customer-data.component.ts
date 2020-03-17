import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { MainDataComponent } from './component/main-data/main-data.component';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.scss']
})

export class CustomerDataComponent implements OnInit {

  @ViewChild(MainDataComponent) mainDataComponent;


  CustDataForm = this.fb.group({
    MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]]
  });

  appId: any;
  refMasterObj = {
    RefMasterTypeCode: "",
  };
  countryObj = {
    CountryCode: ""
  };
  custDataObj: CustDataObj;
  custDataPersonalObj: CustDataPersonalObj;
  legalAddrObj: AddrObj;
  inputFieldLegalObj: InputFieldObj;
  residenceAddrObj: AddrObj;
  inputFieldResidenceObj: InputFieldObj;


  getRefMasterUrl: any;
  addEditCustDataPersonalUrl: any;
  getCustDataUrl: any;

  CustTypeObj: any;
  copyToResidenceTypeObj: any = [
    {
    Key: "LEGAL",
    Value: "Legal"
    },
  ];


  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(params => {
        this.appId = params["AppId"];
      })
     }

  ngOnInit() {
    this.initUrl();
    this.bindCustTypeObj();
    this.getCustData();
  }

  SaveForm(){
    if(this.CustDataForm.controls.MrCustTypeCode.value == AdInsConstant.CustTypePersonal){
      this.custDataPersonalObj = new CustDataPersonalObj();
      this.setCustPersonalObjForSave();
      this.http.post(this.addEditCustDataPersonalUrl, this.custDataPersonalObj).subscribe(
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

  setCustPersonalObjForSave(){
    this.setAppCust();
    this.setAppCustPersonal();
    this.setAppCustAddrLegal();
    this.setAppCustAddrResidence();
  }

  setAppCust(){
    this.custDataPersonalObj.AppCustObj.MrCustTypeCode = this.CustDataForm.controls.MrCustTypeCode.value;
    this.custDataPersonalObj.AppCustObj.CustName = this.mainDataComponent.InputLookupCustomerObj.nameSelect;
    this.custDataPersonalObj.AppCustObj.CustNo = this.mainDataComponent.selectedCustNo;
    this.custDataPersonalObj.AppCustObj.MrIdTypeCode = this.CustDataForm.controls["mainData"]["controls"].MrIdTypeCode.value;
    this.custDataPersonalObj.AppCustObj.IdNo = this.CustDataForm.controls["mainData"]["controls"].IdNo.value;
    this.custDataPersonalObj.AppCustObj.IdExpiredDt = this.CustDataForm.controls["mainData"]["controls"].IdExpiredDt.value;
    this.custDataPersonalObj.AppCustObj.TaxIdNo = this.CustDataForm.controls["mainData"]["controls"].TaxIdNo.value;
    this.custDataPersonalObj.AppCustObj.IsVip = this.CustDataForm.controls["mainData"]["controls"].IsVip.value;
    this.custDataPersonalObj.AppCustObj.CustModelCode = "PROF";
    this.custDataPersonalObj.AppCustObj.AppId = this.appId;
  }

  setAppCustPersonal(){
    this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustDataForm.controls["mainData"]["controls"].CustFullName.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode = this.CustDataForm.controls["mainData"]["controls"].MrGenderCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MotherMaidenName = this.CustDataForm.controls["mainData"]["controls"].MotherMaidenName.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode = this.CustDataForm.controls["mainData"]["controls"].MrMaritalStatCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthPlace = this.CustDataForm.controls["mainData"]["controls"].BirthPlace.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthDt = this.CustDataForm.controls["mainData"]["controls"].BirthDt.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrNationalityCode = this.CustDataForm.controls["mainData"]["controls"].MrNationalityCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode = this.mainDataComponent.selectedNationalityCountryCode;
    this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo1 = this.CustDataForm.controls["mainData"]["controls"].MobilePhnNo1.value;
    this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo2 = this.CustDataForm.controls["mainData"]["controls"].MobilePhnNo2.value;
    this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo3= this.CustDataForm.controls["mainData"]["controls"].MobilePhnNo3.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrEducationCode = this.CustDataForm.controls["mainData"]["controls"].MrEducationCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrReligionCode = this.CustDataForm.controls["mainData"]["controls"].MrReligionCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.Email1 = this.CustDataForm.controls["mainData"]["controls"].Email1.value;
    this.custDataPersonalObj.AppCustPersonalObj.Email2 = this.CustDataForm.controls["mainData"]["controls"].Email2.value;
    this.custDataPersonalObj.AppCustPersonalObj.Email3 = this.CustDataForm.controls["mainData"]["controls"].Email3.value;
    this.custDataPersonalObj.AppCustPersonalObj.FamilyCardNo = this.CustDataForm.controls["mainData"]["controls"].FamilyCardNo.value;
    this.custDataPersonalObj.AppCustPersonalObj.NoOfResidence = this.CustDataForm.controls["mainData"]["controls"].NoOfResidence.value;
    this.custDataPersonalObj.AppCustPersonalObj.NoOfDependents = this.CustDataForm.controls["mainData"]["controls"].NoOfDependents.value;
  }

  setAppCustAddrLegal(){
    this.custDataPersonalObj.AppCustAddrLegalObj.MrCustAddrTypeCode = AdInsConstant.AddrTypeLegal;
    this.custDataPersonalObj.AppCustAddrLegalObj.Addr = this.CustDataForm.controls["legalAddr"]["controls"].Addr.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode3 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode4 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Zipcode = this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode1 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode2 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.City = this.CustDataForm.controls["legalAddr"]["controls"].City.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea1.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Phn1 = this.CustDataForm.controls["legalAddr"]["controls"].Phn1.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnExt1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt1.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea2.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Phn2 = this.CustDataForm.controls["legalAddr"]["controls"].Phn2.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.PhnExt2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt2.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.FaxArea = this.CustDataForm.controls["legalAddr"]["controls"].FaxArea.value;
    this.custDataPersonalObj.AppCustAddrLegalObj.Fax = this.CustDataForm.controls["legalAddr"]["controls"].Fax.value;
  }

  setAppCustAddrResidence(){
    this.custDataPersonalObj.AppCustAddrResidenceObj.MrCustAddrTypeCode = AdInsConstant.AddrTypeResidence;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Addr = this.CustDataForm.controls["residenceAddr"]["controls"].Addr.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode3 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode3.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode4 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode4.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Zipcode = this.CustDataForm.controls["residenceAddrZipcode"]["controls"].value.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode1 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode1.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode2 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode2.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.City = this.CustDataForm.controls["residenceAddr"]["controls"].City.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.PhnArea1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea1.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Phn1 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn1.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.PhnExt1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt1.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.PhnArea2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea2.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Phn2 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn2.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.PhnExt2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt2.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.FaxArea = this.CustDataForm.controls["residenceAddr"]["controls"].FaxArea.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Fax = this.CustDataForm.controls["residenceAddr"]["controls"].Fax.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.MrHouseOwnershipCode = this.CustDataForm.controls["residenceAddr"]["controls"].MrHouseOwnershipCode.value;
  }

  CustTypeChanged(event){
    this.mainDataComponent.setCriteriaLookupCustomer(event.value);
  }

  test(){
    console.log(this.mainDataComponent);
    console.log(this.CustDataForm);
  }
  
  getCustData(){
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    this.http.post(this.getCustDataUrl, this.custDataObj).subscribe(
      (response) => {
        console.log(response);
        this.custDataPersonalObj = new CustDataPersonalObj();
        this.custDataPersonalObj.AppCustObj = response["AppCustObj"];
        this.custDataPersonalObj.AppCustPersonalObj = response["AppCustPersonalObj"];
        this.custDataPersonalObj.AppCustAddrLegalObj = response["AppCustAddrLegalObj"];
        this.custDataPersonalObj.AppCustAddrResidenceObj = response["AppCustAddrResidenceObj"];
        this.setAddrLegalObj();
        this.setAddrResidenceObj();
        this.CustDataForm.patchValue({
          MrCustTypeCode: this.custDataPersonalObj.AppCustObj.MrCustTypeCode
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setAddrLegalObj(){
    this.inputFieldLegalObj = new InputFieldObj();
    this.inputFieldLegalObj.inputLookupObj = new InputLookupObj();

    if(this.custDataPersonalObj.AppCustAddrLegalObj != undefined){
      this.legalAddrObj = new AddrObj();
      this.legalAddrObj.Addr = this.custDataPersonalObj.AppCustAddrLegalObj.Addr;
      this.legalAddrObj.AreaCode1 = this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode1;
      this.legalAddrObj.AreaCode2 = this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode2;
      this.legalAddrObj.AreaCode3 = this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode3;
      this.legalAddrObj.AreaCode4 = this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode4;
      this.legalAddrObj.City = this.custDataPersonalObj.AppCustAddrLegalObj.City;
      this.legalAddrObj.Fax = this.custDataPersonalObj.AppCustAddrLegalObj.Fax;
      this.legalAddrObj.FaxArea = this.custDataPersonalObj.AppCustAddrLegalObj.FaxArea;
      this.legalAddrObj.Phn1 = this.custDataPersonalObj.AppCustAddrLegalObj.Phn1;
      this.legalAddrObj.Phn2 = this.custDataPersonalObj.AppCustAddrLegalObj.Phn2;
      this.legalAddrObj.PhnArea1 = this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea1;
      this.legalAddrObj.PhnArea2 = this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea2;

      this.inputFieldLegalObj.inputLookupObj.nameSelect = this.custDataPersonalObj.AppCustAddrLegalObj.Zipcode;
      this.inputFieldLegalObj.inputLookupObj.jsonSelect = {Zipcode: this.custDataPersonalObj.AppCustAddrLegalObj.Zipcode};
    }
    

    
    
  }

  setAddrResidenceObj(){
    this.inputFieldResidenceObj = new InputFieldObj();
    this.inputFieldResidenceObj.inputLookupObj = new InputLookupObj();

    if(this.custDataPersonalObj.AppCustAddrResidenceObj != undefined){
      this.residenceAddrObj = new AddrObj();
      this.residenceAddrObj.Addr = this.custDataPersonalObj.AppCustAddrResidenceObj.Addr;
      this.residenceAddrObj.AreaCode1 = this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode1;
      this.residenceAddrObj.AreaCode2 = this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode2;
      this.residenceAddrObj.AreaCode3 = this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode3;
      this.residenceAddrObj.AreaCode4 = this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode4;
      this.residenceAddrObj.City = this.custDataPersonalObj.AppCustAddrResidenceObj.City;
      this.residenceAddrObj.Fax = this.custDataPersonalObj.AppCustAddrResidenceObj.Fax;
      this.residenceAddrObj.FaxArea = this.custDataPersonalObj.AppCustAddrResidenceObj.FaxArea;
      this.residenceAddrObj.Phn1 = this.custDataPersonalObj.AppCustAddrResidenceObj.Phn1;
      this.residenceAddrObj.Phn2 = this.custDataPersonalObj.AppCustAddrResidenceObj.Phn2;
      this.residenceAddrObj.PhnArea1 = this.custDataPersonalObj.AppCustAddrResidenceObj.PhnArea1;
      this.residenceAddrObj.PhnArea2 = this.custDataPersonalObj.AppCustAddrResidenceObj.PhnArea2;
      this.residenceAddrObj.MrHouseOwnershipCode = this.custDataPersonalObj.AppCustAddrResidenceObj.MrHouseOwnershipCode;
      
      this.inputFieldResidenceObj.inputLookupObj.nameSelect = this.custDataPersonalObj.AppCustAddrResidenceObj.Zipcode;
      this.inputFieldResidenceObj.inputLookupObj.jsonSelect = {Zipcode: this.custDataPersonalObj.AppCustAddrResidenceObj.Zipcode};
    }
  }

  initUrl(){
    this.addEditCustDataPersonalUrl = AdInsConstant.AddEditCustDataPersonal;
    this.getCustDataUrl = AdInsConstant.GetCustDataByAppId;
    this.getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
  }

  bindCustTypeObj(){
    this.refMasterObj.RefMasterTypeCode = "CUST_TYPE";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.CustTypeObj = response["ReturnObject"];
        if(this.CustTypeObj.length > 0){
          this.CustDataForm.patchValue({
            MrCustTypeCode: this.CustTypeObj[0].Key
          });
          this.mainDataComponent.setCriteriaLookupCustomer(this.CustTypeObj[0].Key);
        }
      }
    );
  }
}
