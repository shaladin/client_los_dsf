import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { RefLobObj } from 'app/shared/model/RefLobObj.Model';
import { VendorObj } from 'app/shared/model/Vendor.Model';
import { RefEmpForLookupObj } from 'app/shared/model/RefEmpForLookupObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-lead-input-main-info',
  templateUrl: './lead-input-main-info.component.html',
  providers: [DecimalPipe, NGXToastrService]
})
export class LeadInputMainInfoComponent implements OnInit {
  user: any;
  LeadId: string;
  addLead: string;
  editLead: string;
  getLeadByLeadId: string;
  returnLead: any;
  responseLead: any;
  leadObj: LeadObj;
  getLeadObj: LeadObj;
  cmoNameLookUpObj: InputLookupObj;
  surveyorNameLookUpObj: InputLookupObj;
  salesNameLookUpObj: InputLookupObj;
  agencyLookUpObj: InputLookupObj;
  tempCmoUsername: any;
  tempSurveyorUsername: any;
  tempSalesUsername: any;
  tempAgencyCode: any;
  getListRefOffice: string;
  getListActiveRefMasterUrl: string;
  getVendorByVendorCode: string;
  getLeadPersonalForLookup: string;
  listRefOffice: Array<any>;
  refOfficeObj: RefOfficeObj;
  listRefLob: Array<any>;
  refLobObj: RefLobObj;
  leadSource: RefMasterObj;
  listLeadSource: Array<any>;
  vendorObj: VendorObj;
  returnVendorObj: any;
  pageType: string = "add";
  leadPersonalLookUpObj: InputLookupObj;
  cmoObj: RefEmpForLookupObj;
  returnCmoObj: any;
  surveyorObj: RefEmpForLookupObj;
  returnSurveyorObj: any;
  salesObj: RefEmpForLookupObj;
  returnSalesObj: any;
  leadIdExist: string;
  getExistLeadObj: LeadObj;
  returnExistLead: any;
  vendorExistObj: VendorObj;
  returnVendorExistObj: any;
  cmoExistObj: RefEmpForLookupObj;
  returnCmoExistObj: any;
  surveyorExistObj: RefEmpForLookupObj;
  returnSurveyorExistObj: any;
  salesExistObj: RefEmpForLookupObj;
  returnSalesExistObj: any;
  leadExistObj: LeadObj;
  returnLeadExistObj: any;
  MainInfoForm = this.fb.group({
    OfficeCode: ['', [Validators.required]],
    OfficeName: [''],
    CrtOfficeCode: [''],
    OrderNo: [''],
    LobCode: ['', [Validators.required]],
    LeadSource: ['', [Validators.required]],
  });
  leadUrl: any;
  WfTaskListId: number;
  isCopyButtonDisabled: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.addLead = URLConstant.AddLead;
    this.editLead = URLConstant.EditLead;
    this.getLeadByLeadId = URLConstant.GetLeadByLeadId;
    this.getListRefOffice = URLConstant.GetListKvpActiveRefOfficeForPaging;
    this.getListActiveRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.getVendorByVendorCode = URLConstant.GetVendorByVendorCode;
    this.getLeadPersonalForLookup = URLConstant.GetLeadPersonalForLookupCopy;
    this.route.queryParams.subscribe(params => {
      if (params["mode"] != null) {
        this.pageType = params["mode"];
      }
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      if (params["WfTaskListId"] != null) {
        this.WfTaskListId = params["WfTaskListId"];
      }
      
    });
  }

  AddView(){
    AdInsHelper.OpenLeadViewByLeadId(this.LeadId);
  }

  backHandler(){
    if(this.pageType == "update"){
        AdInsHelper.RedirectUrl(this.router,["/Lead/LeadUpdate/Paging"],{});
      }
      else{
        AdInsHelper.RedirectUrl(this.router,["/Lead/Lead/Paging"],{});
      }
  
  }

  getLookUpAgency(event) {
    this.tempAgencyCode = event.VendorCode;
  }

  getLookUpCmoName(event) {
    this.tempCmoUsername = event.Username;
  }

  getLookUpSurveyorName(event) {
    this.tempSurveyorUsername = event.Username;
  }

  getLookUpSalesName(event) {
    this.tempSalesUsername = event.Username;
  }

  getLookUpLead(event) {
    this.leadIdExist = event.LeadId;
    this.isCopyButtonDisabled = false;
  }

  copyLead() {
    this.getExistLeadObj = new LeadObj();
    this.getExistLeadObj.LeadId = this.leadIdExist;
    this.http.post(this.getLeadByLeadId, this.getExistLeadObj).subscribe(
      (response) => {
        this.returnExistLead = response;
        this.MainInfoForm.patchValue({
          OfficeCode: this.returnExistLead.OriOfficeCode,
          OfficeName: this.returnExistLead.OriOfficeName,
          OrderNo: this.returnExistLead.OrderNo,
          LobCode: this.returnExistLead.LobCode,
          LobName: this.returnExistLead.LobName,
          LeadSource: this.returnExistLead.MrLeadSourceCode,
        });
        
        this.vendorExistObj = new VendorObj();
        this.vendorExistObj.VendorCode = this.returnExistLead.AgencyCode;
        this.http.post(this.getVendorByVendorCode, this.vendorExistObj).subscribe(
          (response) => {
            this.returnVendorExistObj = response;
            this.agencyLookUpObj.nameSelect = this.returnVendorExistObj.VendorName;
            this.agencyLookUpObj.jsonSelect = this.returnVendorExistObj;
            this.tempAgencyCode = this.returnVendorExistObj.VendorCode;
          });
        // this.cmoNameLookUpObj.nameSelect = this.returnExistLead.CmoUsername;
        // this.cmoNameLookUpObj.jsonSelect = this.returnExistLead;
        // this.surveyorNameLookUpObj.nameSelect = this.returnExistLead.SurveyorUsername;
        // this.surveyorNameLookUpObj.jsonSelect = this.returnExistLead;
        // this.salesNameLookUpObj.nameSelect = this.returnExistLead.TeleMarketingUsername;
        // this.salesNameLookUpObj.jsonSelect = this.returnExistLead;
        this.tempCmoUsername = this.returnExistLead.CmoUsername;
        this.tempSurveyorUsername = this.returnExistLead.SurveyorUsername;
        this.tempSalesUsername = this.returnExistLead.TeleMarketingUsername;

        this.cmoExistObj = new RefEmpForLookupObj();
        this.cmoExistObj.Username = this.returnExistLead.CmoUsername;
        this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.cmoExistObj).subscribe(
          (response) => {
            this.returnCmoExistObj = response;
            this.cmoNameLookUpObj.nameSelect = this.returnCmoExistObj.Username;
            this.cmoNameLookUpObj.jsonSelect = this.returnCmoExistObj;

          });

        this.surveyorExistObj = new RefEmpForLookupObj();
        this.surveyorExistObj.Username = this.returnExistLead.SurveyorUsername;
        this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.surveyorExistObj).subscribe(
          (response) => {
            this.returnSurveyorExistObj = response;
            this.surveyorNameLookUpObj.nameSelect = this.returnSurveyorExistObj.Username;
            this.surveyorNameLookUpObj.jsonSelect = this.returnSurveyorExistObj;
          });

        this.salesExistObj = new RefEmpForLookupObj();
        this.salesExistObj.Username = this.returnExistLead.TeleMarketingUsername;
        this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.salesExistObj).subscribe(
          (response) => {
            this.returnSalesExistObj = response;
            this.salesNameLookUpObj.nameSelect = this.returnSalesExistObj.Username;
            this.salesNameLookUpObj.jsonSelect = this.returnSalesExistObj;
          });
      });
  }

  ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    this.MakeLookUpObj();
    this.GetOfficeDDL();
    this.user = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    
    this.http.post(this.getListActiveRefMasterUrl, {RefMasterTypeCode: "LOB"}).subscribe(
      (response) => {
        this.listRefLob = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({
          LobCode: response[CommonConstant.ReturnObj][0]['Key'],
          LobName: response[CommonConstant.ReturnObj][0]['Value']
        });
      });

    this.leadSource = new RefMasterObj();
    this.leadSource.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeLeadSource;
    this.http.post(this.getListActiveRefMasterUrl, this.leadSource).subscribe(
      (response) => {
        this.listLeadSource = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({ LeadSource: response[CommonConstant.ReturnObj][0]['Key'] });
      });

  if (this.pageType == "edit" || this.pageType == "update") {
      this.getLeadObj = new LeadObj();
      this.getLeadObj.LeadId = this.LeadId;
      this.http.post(this.getLeadByLeadId, this.getLeadObj).subscribe(
        (response) => {
          this.returnLead = response;
          this.MainInfoForm.patchValue({
            OfficeCode: this.returnLead.OriOfficeCode,
            OfficeName: this.returnLead.OriOfficeName,
            OrderNo: this.returnLead.OrderNo,
            LobCode: this.returnLead.LobCode,
            LobName: this.returnLead.LobName,
            LeadSource: this.returnLead.MrLeadSourceCode,
          });
          this.leadIdExist = this.returnLead.LeadCopyId;

          if (this.returnLead.LeadCopyId != null) {
            this.leadExistObj = new LeadObj();
            this.leadExistObj.LeadId = this.returnLead.LeadCopyId;
            this.http.post(this.getLeadPersonalForLookup, this.leadExistObj).subscribe(
              (response) => {
                this.returnLeadExistObj = response;
              });
          }

          this.vendorObj = new VendorObj();
          this.vendorObj.VendorCode = this.returnLead.AgencyCode;
          this.http.post(this.getVendorByVendorCode, this.vendorObj).subscribe(
            (response) => {
              this.returnVendorObj = response;
              this.agencyLookUpObj.nameSelect = this.returnVendorObj.VendorName;
              this.agencyLookUpObj.jsonSelect = this.returnVendorObj;
              this.tempAgencyCode = this.returnVendorObj.VendorCode;
            });

          // this.cmoNameLookUpObj.nameSelect = this.returnLead.CmoUsername;
          // this.cmoNameLookUpObj.jsonSelect = this.returnLead;
          // this.surveyorNameLookUpObj.nameSelect = this.returnLead.SurveyorUsername;
          // this.surveyorNameLookUpObj.jsonSelect = this.returnLead;
          // this.salesNameLookUpObj.nameSelect = this.returnLead.TeleMarketingUsername;
          // this.salesNameLookUpObj.jsonSelect = this.returnLead;
          this.tempCmoUsername = this.returnLead.CmoUsername;
          this.tempSurveyorUsername = this.returnLead.SurveyorUsername;
          this.tempSalesUsername = this.returnLead.TeleMarketingUsername;

          this.cmoObj = new RefEmpForLookupObj();
          this.cmoObj.Username = this.returnLead.CmoUsername; 
          this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.cmoObj).subscribe(
            (response) => {
                this.returnCmoObj = response;
                this.cmoNameLookUpObj.nameSelect = this.returnCmoObj.Username;
                this.cmoNameLookUpObj.jsonSelect = this.returnCmoObj;
            });

          this.surveyorObj = new RefEmpForLookupObj();
          this.surveyorObj.Username = this.returnLead.SurveyorUsername;
          this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.surveyorObj).subscribe(
            (response) => {
                this.returnSurveyorObj = response;
                this.surveyorNameLookUpObj.nameSelect = this.returnSurveyorObj.Username;
                this.surveyorNameLookUpObj.jsonSelect = this.returnSurveyorObj;
            });

          this.salesObj = new RefEmpForLookupObj();
          this.salesObj.Username = this.returnLead.TeleMarketingUsername;
          this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.salesObj).subscribe(
            (response) => {
                this.returnSalesObj = response;
                this.salesNameLookUpObj.nameSelect = this.returnSalesObj.Username;
                this.salesNameLookUpObj.jsonSelect = this.returnSalesObj;
            });
        });
    }
  }

  MakeLookUpObj(){
    this.leadPersonalLookUpObj = new InputLookupObj();
    this.leadPersonalLookUpObj.isRequired = false;
    this.leadPersonalLookUpObj.urlJson = "./assets/uclookup/lookupLeadPersonal.json";
    this.leadPersonalLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.leadPersonalLookUpObj.urlEnviPaging = environment.losUrl;
    this.leadPersonalLookUpObj.pagingJson = "./assets/uclookup/lookupLeadPersonal.json";
    this.leadPersonalLookUpObj.genericJson = "./assets/uclookup/lookupLeadPersonal.json";

    this.agencyLookUpObj = new InputLookupObj();
    this.agencyLookUpObj.isRequired = false;
    this.agencyLookUpObj.urlJson = "./assets/uclookup/lookupAgency.json";
    this.agencyLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.agencyLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.agencyLookUpObj.pagingJson = "./assets/uclookup/lookupAgency.json";
    this.agencyLookUpObj.genericJson = "./assets/uclookup/lookupAgency.json";
    this.agencyLookUpObj.isRequired = true;

    this.cmoNameLookUpObj = new InputLookupObj();
    this.cmoNameLookUpObj.isRequired = false;
    this.cmoNameLookUpObj.urlJson = "./assets/uclookup/lookupCMO.json";
    this.cmoNameLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.cmoNameLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.cmoNameLookUpObj.pagingJson = "./assets/uclookup/lookupCMO.json";
    this.cmoNameLookUpObj.genericJson = "./assets/uclookup/lookupCMO.json";

    this.surveyorNameLookUpObj = new InputLookupObj();
    this.surveyorNameLookUpObj.isRequired = false;
    this.surveyorNameLookUpObj.urlJson = "./assets/uclookup/lookupSurveyor.json";
    this.surveyorNameLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.surveyorNameLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.surveyorNameLookUpObj.pagingJson = "./assets/uclookup/lookupSurveyor.json";
    this.surveyorNameLookUpObj.genericJson = "./assets/uclookup/lookupSurveyor.json";

    this.salesNameLookUpObj = new InputLookupObj();
    this.salesNameLookUpObj.isRequired = false;
    this.salesNameLookUpObj.urlJson = "./assets/uclookup/lookupTeleSales.json";
    this.salesNameLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.salesNameLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.salesNameLookUpObj.pagingJson = "./assets/uclookup/lookupTeleSales.json";
    this.salesNameLookUpObj.genericJson = "./assets/uclookup/lookupTeleSales.json";
    this.salesNameLookUpObj.isRequired = true;
  }
  OfficeChanged(event) {
    // this.MainInfoForm.patchValue({
    //   OfficeName: this.listRefOffice.find(x => x.Key == event.target.value).Value
    // });
    this.MainInfoForm.patchValue({
      OfficeCode: event.target.selectedOptions[0].value,
      OfficeName: event.target.selectedOptions[0].text,
    });
  }

  LobChanged(event) {
    this.MainInfoForm.patchValue({
      LobName: this.listRefLob.find(x => x.Key == event.target.value).Value
    });
  }

GetOfficeDDL(){
  this.refOfficeObj = new RefOfficeObj();
  this.http.post(this.getListRefOffice, this.refOfficeObj).subscribe(
    (response) => {
      this.listRefOffice = response[CommonConstant.ReturnObj];
      // this.MainInfoForm.patchValue({
      //   OfficeCode: response[CommonConstant.ReturnObj][0]['Key'],
      //   OfficeName: response[CommonConstant.ReturnObj][0]['Value']
      // });

      if (this.user.MrOfficeTypeCode == "CG" || this.user.MrOfficeTypeCode == CommonConstant.HeadOffice) {
        this.MainInfoForm.patchValue({
          CrtOfficeCode: this.user.OfficeCode,
          OfficeCode : this.listRefOffice[0].Key,
          OfficeName : this.listRefOffice[0].Value,
        });
        // this.MainInfoForm.controls.OfficeCode.setValidators([Validators.required]);    
      }
      else{
        this.MainInfoForm.controls.OfficeCode.disable();
        this.MainInfoForm.patchValue({
          CrtOfficeCode: this.user.OfficeCode,
          OfficeCode : this.user.OfficeCode,
          OfficeName : this.user.OfficeName
        });
      }
    });
}


  setLead() {
    this.leadObj.LeadNo = "0";
    this.leadObj.LeadCopyId = this.leadIdExist;
    this.leadObj.OriOfficeCode = this.MainInfoForm.controls["OfficeCode"].value;
    // this.leadObj.OriOfficeName = this.MainInfoForm.controls["OfficeName"].value;
    this.leadObj.CrtOfficeCode = this.MainInfoForm.controls["CrtOfficeCode"].value;
    this.leadObj.LeadDt = new Date();
    this.leadObj.OrderNo = this.MainInfoForm.controls["OrderNo"].value;
    this.leadObj.LobCode = this.MainInfoForm.controls["LobCode"].value;
    this.leadObj.MrLeadSourceCode = this.MainInfoForm.controls["LeadSource"].value;
    this.leadObj.LeadStat = CommonConstant.LeadStatNew;
    this.leadObj.LeadStep = CommonConstant.LeadStatNew;
    this.leadObj.AgencyCode = this.tempAgencyCode;
    this.leadObj.CmoUsername = this.tempCmoUsername;
    this.leadObj.SurveyorUsername = this.tempSurveyorUsername;
    this.leadObj.TeleMarketingUsername = this.tempSalesUsername;
  }

  SaveForm() {
    if(this.MainInfoForm.valid){
      if (this.pageType == "edit" || this.pageType == "update" ) {
        this.leadObj = new LeadObj();
        this.leadObj.LeadId = this.LeadId;
        this.leadObj.RowVersion = this.returnLead.RowVersion; 
        this.setLead();
        this.http.post(this.editLead, this.leadObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.pageType == "edit"){
              AdInsHelper.RedirectUrl(this.router,["/Lead/LeadInput/Page"],{ "LeadId": this.LeadId, "mode": this.pageType });
            }
            else{
              AdInsHelper.RedirectUrl(this.router,["/Lead/LeadInput/Page"],{ "LeadId": this.LeadId, "mode": this.pageType, "WfTaskListId": this.WfTaskListId });
            }
          }
        );
      } else {
        this.leadObj = new LeadObj();
        this.setLead(); 
        this.http.post(this.addLead, this.leadObj).subscribe(
          (response) => {
            this.responseLead = response;
            this.LeadId = this.responseLead.LeadId;
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router,["/Lead/LeadInput/Page"],{ "LeadId": this.LeadId, "CopyFrom": this.leadIdExist });
          }
        );
      }
    }
  }

  save() {
    if(this.MainInfoForm.valid){
      if (this.pageType == "edit" || this.pageType == "update" ) {
        this.leadObj = new LeadObj();
        this.leadObj.LeadId = this.LeadId;
        this.leadObj.RowVersion = this.returnLead.RowVersion; 
        this.setLead();
        this.http.post(this.editLead, this.leadObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if(this.pageType == "edit"){
              AdInsHelper.RedirectUrl(this.router,["/Lead/Lead/Paging"],{});
            }
            else{
              AdInsHelper.RedirectUrl(this.router,["/Lead/LeadUpdate/Paging"],{});
            }
          }
        );
      } else {
        this.leadObj = new LeadObj();
        this.setLead();
        this.http.post(this.addLead, this.leadObj).subscribe(
          (response) => {
            this.responseLead = response;
            this.LeadId = this.responseLead.LeadId;
            this.toastr.successMessage(response["message"]);
            AdInsHelper.RedirectUrl(this.router,["/Lead/Lead/Paging"],{});
          }
        );
      }
    }
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
    }	
}
