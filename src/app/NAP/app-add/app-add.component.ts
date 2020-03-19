import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';

@Component({
  selector: 'app-app-add',
  templateUrl: './app-add.component.html',
  styleUrls: ['./app-add.component.scss'],
  providers: [NGXToastrService]
})
export class AppAddComponent implements OnInit {

  param;
  ProductOfferingIdentifier;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService
  ) { }

  NapAppForm = this.fb.group({
    MouCustId : [''],
    LeadId : [''],
    AppNo : [''],
    OriOfficeCode : [''],
    OriOfficeName : [''],
    CrtOfficeCode : [''],
    CrtOfficeName : [''],
    ProdOfferingCode : [''],
    ProdOfferingName : [''],
    ProdOfferingVersion : [''],
    AppCreatedDt : [''],
    AppStat : [''],
    AppCurrStep : [''],
    AppLastStep : [''],
    CurrCode : [''],
    LobCode : [''],
    RefProdTypeCode : [''],
    Tenor : [''],
    NumOfInst : [''],
    PayFreqCode : [''],
    MrFirstInstTypeCode : [''],
    NumOfAsset : [''],
    MrLcCalcMethodCode : [''],
    LcInstRatePrml : [''],
    LcInsRatePrml : [''],
    MrAppSourceCode : [''],
    MrWopCode : [''],
    SrvyOrderNo : [''],
    ApvDt : [''],
    SalesHeadNo : [''],
    SalesNotes : [''],
    SalesOfficerNo : [''],
    CreditAdminNo : [''],
    CreditAnalystNo : [''],
    CreditRiskNo : [''],
    DataEntryNo : [''],
    MrSalesRecommendCode : [''],
    MrCustNotifyOptCode : [''],
    PreviousAppId : [''],
    IsAppInitDone : [''],
    MrOrderInfoCode : [''],
    ApprovalStat : [''],
    RsvField1 : [''],
    RsvField2 : [''],
    RsvField3 : [''],
    RsvField4 : [''],
    RsvField5 : ['']
  });

  inputLookupObj;
  officeItems;
  user;
  ngOnInit() {
    // Lookup Obj
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.losUrl;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupApp.json";

    console.log(this.inputLookupObj.urlQryPaging );
    

    // Office DDL
    var obj = {
      RowVersion: ""
    };
    var url = environment.FoundationR3Url + AdInsConstant.GetListKvpActiveRefOffice;
    this.http.post(url, obj).subscribe(
      (response) =>{
        console.log(response);
        this.officeItems = response["ReturnObject"];
        this.NapAppForm.patchValue({
          OriOfficeCode: this.officeItems[0].Key,
          OriOfficeName: this.officeItems[0].Value,
        });
      },
      (error) => {
        console.log(error);
      }
    );
    
    this.user = JSON.parse(localStorage.getItem("UserAccess"));
    if(this.user.MrOfficeTypeCode == "HO"){
      this.NapAppForm.controls.OriOfficeCode.disable();
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }else if(this.user.MrOfficeTypeCode == "Center Group"){
      this.NapAppForm.patchValue({
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }

    // Test Data
    console.log(this.user);
    console.log(this.NapAppForm);

  }

  SaveForm() {
    // this.router.navigate(["Nap/AppAddDetail"], { queryParams: { "AppId": response["AppId"] } });
    var napAppObj = new NapAppModel();
    napAppObj = this.NapAppForm.value;
    napAppObj.AppCreatedDt = this.user.BusinessDt;
    napAppObj.IsAppInitDone = false;
    napAppObj.AppStat = AdInsConstant.AppStepNew;
    napAppObj.AppCurrStep = AdInsConstant.AppStepNew;

    if(this.user.MrOfficeTypeCode == "HO"){
      napAppObj.OriOfficeCode = this.user.OfficeCode;
    }else if(this.user.MrOfficeTypeCode == "Center Group"){
      
    }
    console.log(napAppObj);

    var url = environment.losUrl + AdInsConstant.AddApp;
    this.http.post(url, napAppObj).subscribe(
      (response) =>{
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["Nap/AppAddDetail"], { queryParams: { "AppId": response["AppId"] } });
      },
      (error) => {
        console.log(error);
      }
    );

  }

  getLookupAppResponse(ev: any){
    console.log(ev);
    this.NapAppForm.patchValue({
      ProdOfferingCode: ev.ProdOfferingCode,
      ProdOfferingName: ev.ProdOfferingName,
      ProdOfferingVersion: ev.ProdOfferingVersion,
      AppNo: ev.AppNo,
      MouCustId: ev.MouCustId,
      LeadId: ev.LeadId,
      CurrCode: ev.CurrCode,
      LobCode: ev.LobCode,
      RefProdTypeCode: ev.RefProdTypeCode,
      Tenor: ev.Tenor,
      NumOfInst: ev.NumOfInst,
      NumOfAsset: ev.NumOfAsset,
      PayFreqCode: ev.PayFreqCode,
      MrFirstInstTypeCode: ev.MrFirstInstTypeCode,
      MrAppSourceCode: ev.MrAppSourceCode,
      MrWopCode: ev.MrWopCode,
      MrCustNotifyOptCode: ev.MrCustNotifyOptCode,
      SalesOfficerNo: ev.SalesOfficerNo
    });
    console.log(this.NapAppForm);
  }

  ChangeValueOffice(ev: any){
    // console.log(ev);
    this.NapAppForm.patchValue({
      OriOfficeCode: ev.target.selectedOptions[0].value,
      OriOfficeName: ev.target.selectedOptions[0].text
    });
    // console.log(this.NapAppForm);
  }

}
