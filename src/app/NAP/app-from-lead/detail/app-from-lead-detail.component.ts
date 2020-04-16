import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, CheckboxControlValueAccessor } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';

@Component({
  selector: 'app-app-from-lead-detail',
  templateUrl: './app-from-lead-detail.component.html',
  providers: [NGXToastrService]
})
export class AppFromLeadDetailComponent implements OnInit {

  param;
  ProductOfferingIdentifier;
  ProductOfferingNameIdentifier;
  leadId: number;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(params => {
      this.leadId = params["LeadId"];
    })
  }

  NapAppForm = this.fb.group({
    MouCustId: [''],
    LeadId: [''],
    AppNo: [''],
    OriOfficeCode: [''],
    OriOfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    ProdOfferingCode: [''],
    ProdOfferingName: [''],
    ProdOfferingVersion: [''],
    AppCreatedDt: [''],
    AppStat: [''],
    AppCurrStep: [''],
    AppLastStep: [''],
    CurrCode: [''],
    LobCode: [''],
    RefProdTypeCode: [''],
    Tenor: 0,
    NumOfInst: 0,
    PayFreqCode: [''],
    MrFirstInstTypeCode: "-",
    NumOfAsset: 1,
    MrLcCalcMethodCode: [''],
    LcInstRatePrml: [''],
    LcInsRatePrml: [''],
    MrAppSourceCode: "-",
    MrWopCode: "-",
    SrvyOrderNo: [''],
    ApvDt: [''],
    SalesHeadNo: [''],
    SalesNotes: [''],
    SalesOfficerNo: "-",
    CreditAdminNo: [''],
    CreditAnalystNo: [''],
    CreditRiskNo: [''],
    DataEntryNo: [''],
    MrSalesRecommendCode: [''],
    MrCustNotifyOptCode: "-",
    PreviousAppId: [''],
    IsAppInitDone: [''],
    MrOrderInfoCode: [''],
    ApprovalStat: [''],
    RsvField1: [''],
    RsvField2: [''],
    RsvField3: [''],
    RsvField4: [''],
    RsvField5: ['']
  });

  inputLookupObjCopyProduct;
  inputLookupObjName;
  officeItems;
  user;

  leadObj: LeadObj;

  async ngOnInit() : Promise<void> {
    this.user = JSON.parse(localStorage.getItem("UserAccess"));
    this.MakeLookUpObj();
    await this.GetLead();
    this.NapAppForm.patchValue({
      CrtOfficeCode: this.user.OfficeCode,
      CrtOfficeName: this.user.OfficeName,
    });
  }

  arrAddCrit;
  MakeLookUpObj(){   
    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObjName.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObjName.pagingJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.genericJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.nameSelect = this.NapAppForm.controls.ProdOfferingName.value;
    
    this.arrAddCrit = new Array();

    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE ";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.MrOfficeTypeCode];
    this.arrAddCrit.push(addCrit);

    this.inputLookupObjName.addCritInput = this.arrAddCrit;
  }

  async GetLead() {
    var obj = new LeadObj();
    obj.LeadId = this.leadId;

    await this.http.post(AdInsConstant.GetLeadByLeadId, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.leadObj = response as LeadObj;
        this.NapAppForm.patchValue({
          OriOfficeCode: this.leadObj.OriOfficeCode,
          OriOfficeName: this.leadObj.OriOfficeName,
          LeadId: this.leadObj.LeadId
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  CheckValue(obj){
    if(obj.MrWopCode == null){
      obj.MrWopCode = "";
    }
    if(obj.SalesOfficerNo == null){
      obj.SalesOfficerNo = "";
    }
    if(obj.MrAppSourceCode == null){
      obj.MrAppSourceCode = "";
    }
    if(obj.MrCustNotifyOptCode == null){
      obj.MrCustNotifyOptCode = "";
    }
    if(obj.MrFirstInstTypeCode == null){
      obj.MrFirstInstTypeCode = "";
    }

    return obj;
  }

  SaveForm() {
    var napAppObj = new NapAppModel();
    napAppObj = this.NapAppForm.value;
    napAppObj.AppCreatedDt = this.user.BusinessDt;
    napAppObj.IsAppInitDone = false;
    napAppObj.AppStat = AdInsConstant.AppStepNew;
    napAppObj.AppCurrStep = AdInsConstant.AppStepNew;
    napAppObj = this.CheckValue(napAppObj);
    this.http.post(AdInsConstant.AddAppFromLead, napAppObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["Nap/AppAddDetail"], { queryParams: { "AppId": response["AppId"] } });
      },
      (error) => {
        console.log(error);
      }
    );

  }

  test(){
    var napAppObj = new NapAppModel();
    napAppObj = this.NapAppForm.value;
    napAppObj.AppCreatedDt = this.user.BusinessDt;
    napAppObj.IsAppInitDone = false;
    napAppObj.AppStat = AdInsConstant.AppStepNew;
    napAppObj.AppCurrStep = AdInsConstant.AppStepNew;

    napAppObj = this.CheckValue(napAppObj);
    console.log(napAppObj);
}

  getLookupAppResponseName(ev: any) {
    console.log(ev);
    var url = environment.FoundationR3Url + AdInsConstant.GetListProdOfferingDByProdOfferingCode;
    var obj = {
      ProdOfferingCode: ev.ProdOfferingCode
    };
    var tempLobCode;
    var tempCurrCode;
    var tempPayFreqCode;
    var tempRefProdTypeCode;
    this.http.post(url,obj).subscribe(
      (response) => {
        var temp = response["ReturnObject"];
        for(var i=0;i<temp.length;i++){
          if(temp[i].RefProdCompntCode == "LOB"){
            tempLobCode = temp[i].CompntValue;
          }else if(temp[i].RefProdCompntCode == "CURR"){
            tempCurrCode = temp[i].CompntValue;
          }else if(temp[i].RefProdCompntCode == "PAYFREQ"){
            tempPayFreqCode = temp[i].CompntValue;
          }else if(temp[i].RefProdCompntCode == "PROD_TYPE"){
            tempRefProdTypeCode = temp[i].CompntValue;
          }else{
            console.log("Not");
          }
        }
        this.NapAppForm.patchValue({
          ProdOfferingCode: ev.ProdOfferingCode,
          ProdOfferingName: ev.ProdOfferingName,
          ProdOfferingVersion: ev.ProdOfferingVersion,
          CurrCode: tempCurrCode,
          LobCode: tempLobCode,
          PayFreqCode: tempPayFreqCode,
          RefProdTypeCode: tempRefProdTypeCode
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
