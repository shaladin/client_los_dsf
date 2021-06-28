import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { RefLobObj } from 'app/shared/model/RefLobObj.Model';
import { VendorObj } from 'app/shared/model/Vendor.Model';
import { RefEmpForLookupObj } from 'app/shared/model/RefEmpForLookupObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ReqAddLeadObj, ReqEditLeadObj } from 'app/shared/model/Request/LEAD/ReqAddEditLeadObj.model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ResGetListRefEmpForLookupObj } from 'app/shared/model/Response/RefEmp/ResRefEmpObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { KeyValue } from '@angular/common';
import { LeadForLookupObj } from 'app/shared/model/LeadForLookupObj.Model';

@Component({
  selector: 'app-lead-input-main-info',
  templateUrl: './lead-input-main-info.component.html'
})
export class LeadInputMainInfoComponent implements OnInit {
  user: CurrentUserContext;
  LeadId: number;
  returnLead: LeadObj;
  responseLead: GenericObj;
  leadObj: LeadObj;
  addLeadObj: ReqAddLeadObj = new ReqAddLeadObj();
  editLeadObj: ReqEditLeadObj = new ReqEditLeadObj();
  getLeadObj: LeadObj;
  cmoNameLookUpObj: InputLookupObj;
  surveyorNameLookUpObj: InputLookupObj;
  salesNameLookUpObj: InputLookupObj;
  agencyLookUpObj: InputLookupObj;
  tempCmoUsername: string;
  tempSurveyorUsername: string;
  tempSalesUsername: string;
  tempAgencyCode: string;
  listRefOffice: Array<KeyValueObj>;
  refOfficeObj: RefOfficeObj;
  listRefLob: Array<KeyValueObj>;
  refLobObj: RefLobObj;
  leadSource: RefMasterObj;
  listLeadSource: Array<KeyValueObj>;
  vendorObj: VendorObj;
  returnVendorObj: VendorObj;
  pageType: string = "add";
  leadPersonalLookUpObj: InputLookupObj;
  cmoObj: RefEmpForLookupObj;
  returnCmoObj: ResGetListRefEmpForLookupObj;
  surveyorObj: RefEmpForLookupObj;
  returnSurveyorObj: ResGetListRefEmpForLookupObj;
  salesObj: RefEmpForLookupObj;
  returnSalesObj: ResGetListRefEmpForLookupObj;
  leadIdExist: number;
  getExistLeadObj: LeadObj;
  returnExistLead: LeadObj;
  vendorExistObj: VendorObj;
  returnVendorExistObj: VendorObj;
  cmoExistObj: RefEmpForLookupObj;
  returnCmoExistObj: ResGetListRefEmpForLookupObj;
  surveyorExistObj: RefEmpForLookupObj;
  returnSurveyorExistObj: ResGetListRefEmpForLookupObj;
  salesExistObj: RefEmpForLookupObj;
  returnSalesExistObj: ResGetListRefEmpForLookupObj;
  leadExistObj: LeadObj;
  returnLeadExistObj: LeadForLookupObj;
  critObj: CriteriaObj = new CriteriaObj();
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  MainInfoForm = this.fb.group({
    OfficeCode: ['', [Validators.required]],
    OfficeName: [''],
    CrtOfficeCode: [''],
    OrderNo: [''],
    LobCode: ['', [Validators.required]],
    LeadSource: ['', [Validators.required]],
  });
  WfTaskListId: number;
  isCopyButtonDisabled: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private cookieService: CookieService) {
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

  AddView() {
    AdInsHelper.OpenLeadViewByLeadId(this.LeadId);
  }

  backHandler() {
    if (this.pageType == "update") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_PAGING], {});
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
    let getExistLeadObj = { Id: this.leadIdExist };
    this.http.post(URLConstant.GetLeadByLeadId, getExistLeadObj).subscribe(
      (response: LeadObj) => {
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
        this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.returnExistLead.AgencyCode }).subscribe(
          (response: VendorObj) => {
            this.returnVendorExistObj = response;
            this.agencyLookUpObj.nameSelect = this.returnVendorExistObj.VendorName;
            this.agencyLookUpObj.jsonSelect = this.returnVendorExistObj;
            this.tempAgencyCode = this.returnVendorExistObj.VendorCode;
          });

        this.tempCmoUsername = this.returnExistLead.CmoUsername;
        this.tempSurveyorUsername = this.returnExistLead.SurveyorUsername;
        this.tempSalesUsername = this.returnExistLead.TeleMarketingUsername;

        this.cmoExistObj = new RefEmpForLookupObj();
        this.cmoExistObj.Username = this.returnExistLead.CmoUsername;
        this.http.post<ResGetListRefEmpForLookupObj>(URLConstant.GetRefEmpForLookupByUsername, this.cmoExistObj).subscribe(
          (response) => {
            this.returnCmoExistObj = response;
            this.cmoNameLookUpObj.nameSelect = this.returnCmoExistObj.Username;
            this.cmoNameLookUpObj.jsonSelect = this.returnCmoExistObj;

          });

        this.surveyorExistObj = new RefEmpForLookupObj();
        this.surveyorExistObj.Username = this.returnExistLead.SurveyorUsername;
        this.http.post<ResGetListRefEmpForLookupObj>(URLConstant.GetRefEmpForLookupByUsername, this.surveyorExistObj).subscribe(
          (response) => {
            this.returnSurveyorExistObj = response;
            this.surveyorNameLookUpObj.nameSelect = this.returnSurveyorExistObj.Username;
            this.surveyorNameLookUpObj.jsonSelect = this.returnSurveyorExistObj;
          });

        this.salesExistObj = new RefEmpForLookupObj();
        this.salesExistObj.Username = this.returnExistLead.TeleMarketingUsername;
        this.http.post<ResGetListRefEmpForLookupObj>(URLConstant.GetRefEmpForLookupByUsername, this.salesExistObj).subscribe(
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
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MakeLookUpObj();
    this.GetOfficeDDL();

    this.http.post(URLConstant.GetListActiveLob, {}).subscribe(
      (response) => {
        this.listRefLob = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({
          LobCode: response[CommonConstant.ReturnObj][0]['Key'],
          LobName: response[CommonConstant.ReturnObj][0]['Value']
        });
      });


    let userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    // this.leadSource = new RefMasterObj();
    // this.leadSource.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeLeadSource;
    // this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.leadSource).subscribe(
    //   (response) => {
    //     this.listLeadSource = response[CommonConstant.ReturnObj];
    //     this.MainInfoForm.patchValue({ LeadSource: response[CommonConstant.ReturnObj][0]['Key'] });
    //   });

    let obj = {
      Code: userContext.OfficeCode,
    };
    console.log(userContext);
    this.http.post(URLConstant.GetListKvpRefAppSrcForAppOrLead, obj).subscribe(
      (response) => {
        this.listLeadSource = response[CommonConstant.ReturnObj];
      });

    if (this.pageType == "edit" || this.pageType == "update") {
      this.getLeadObj = new LeadObj();
      this.getLeadObj.LeadId = this.LeadId;
      let getLeadObj = { Id: this.LeadId };
      this.http.post(URLConstant.GetLeadByLeadId, getLeadObj).subscribe(
        (response: LeadObj) => {
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
            let leadExistObj = { Id: this.returnLead.LeadCopyId };
            this.http.post(URLConstant.GetLeadPersonalForLookupCopy, leadExistObj).subscribe(
              (response: LeadForLookupObj) => {
                this.returnLeadExistObj = response;
              });
          }

          this.vendorObj = new VendorObj();
          this.vendorObj.VendorCode = this.returnLead.AgencyCode;
          this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.returnLead.AgencyCode }).subscribe(
            (response: VendorObj) => {
              this.returnVendorObj = response;
              this.agencyLookUpObj.nameSelect = this.returnVendorObj.VendorName;
              this.agencyLookUpObj.jsonSelect = this.returnVendorObj;
              this.tempAgencyCode = this.returnVendorObj.VendorCode;
            });

          this.tempCmoUsername = this.returnLead.CmoUsername;
          this.tempSurveyorUsername = this.returnLead.SurveyorUsername;
          this.tempSalesUsername = this.returnLead.TeleMarketingUsername;

          this.cmoObj = new RefEmpForLookupObj();
          this.cmoObj.Username = this.returnLead.CmoUsername;
          this.http.post<ResGetListRefEmpForLookupObj>(URLConstant.GetRefEmpForLookupByUsername, this.cmoObj).subscribe(
            (response) => {
              this.returnCmoObj = response;
              this.cmoNameLookUpObj.nameSelect = this.returnCmoObj.Username;
              this.cmoNameLookUpObj.jsonSelect = this.returnCmoObj;
            });

          this.surveyorObj = new RefEmpForLookupObj();
          this.surveyorObj.Username = this.returnLead.SurveyorUsername;
          this.http.post<ResGetListRefEmpForLookupObj>(URLConstant.GetRefEmpForLookupByUsername, this.surveyorObj).subscribe(
            (response) => {
              this.returnSurveyorObj = response;
              this.surveyorNameLookUpObj.nameSelect = this.returnSurveyorObj.Username;
              this.surveyorNameLookUpObj.jsonSelect = this.returnSurveyorObj;
            });

          this.salesObj = new RefEmpForLookupObj();
          this.salesObj.Username = this.returnLead.TeleMarketingUsername;
          this.http.post<ResGetListRefEmpForLookupObj>(URLConstant.GetRefEmpForLookupByUsername, this.salesObj).subscribe(
            (response) => {
              this.returnSalesObj = response;
              this.salesNameLookUpObj.nameSelect = this.returnSalesObj.Username;
              this.salesNameLookUpObj.jsonSelect = this.returnSalesObj;
            });
        });
    }
  }

  MakeLookUpObj() {
    this.leadPersonalLookUpObj = new InputLookupObj();
    this.leadPersonalLookUpObj.isRequired = false;
    this.leadPersonalLookUpObj.urlJson = "./assets/uclookup/lookupLeadPersonal.json";
    this.leadPersonalLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.leadPersonalLookUpObj.urlEnviPaging = environment.losUrl;
    this.leadPersonalLookUpObj.pagingJson = "./assets/uclookup/lookupLeadPersonal.json";
    this.leadPersonalLookUpObj.genericJson = "./assets/uclookup/lookupLeadPersonal.json";
    if (this.user.MrOfficeTypeCode != "CG" && this.user.MrOfficeTypeCode != CommonConstant.HeadOffice) {
      this.critObj.restriction = AdInsConstant.RestrictionEq;
      this.critObj.propName = 'L.ORI_OFFICE_CODE';
      this.critObj.value = this.user.OfficeCode;
      this.arrCrit.push(this.critObj);
      this.leadPersonalLookUpObj.addCritInput = this.arrCrit;
    }

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

  GetOfficeDDL() {
    this.refOfficeObj = new RefOfficeObj();
    this.http.post(URLConstant.GetListKvpActiveRefOfficeForPaging, this.refOfficeObj).subscribe(
      (response) => {
        this.listRefOffice = response[CommonConstant.ReturnObj];

        if (this.user.MrOfficeTypeCode == "CG" || this.user.MrOfficeTypeCode == CommonConstant.HeadOffice) {
          this.MainInfoForm.patchValue({
            CrtOfficeCode: this.user.OfficeCode,
            OfficeCode: this.listRefOffice[0].Key,
            OfficeName: this.listRefOffice[0].Value,
          });
        }
        else {
          this.MainInfoForm.controls.OfficeCode.disable();
          this.MainInfoForm.patchValue({
            CrtOfficeCode: this.user.OfficeCode,
            OfficeCode: this.user.OfficeCode,
            OfficeName: this.user.OfficeName
          });
        }
      });
  }

  setLeadObj(obj: any) {
    obj.LeadCopyId = this.leadIdExist;
    obj.OriOfficeCode = this.MainInfoForm.controls["OfficeCode"].value;
    obj.CrtOfficeCode = this.MainInfoForm.controls["CrtOfficeCode"].value;
    obj.LeadDt = new Date();
    obj.OrderNo = this.MainInfoForm.controls["OrderNo"].value;
    obj.LobCode = this.MainInfoForm.controls["LobCode"].value;
    obj.MrLeadSourceCode = this.MainInfoForm.controls["LeadSource"].value;
    obj.LeadStat = CommonConstant.LeadStatNew;
    obj.LeadStep = CommonConstant.LeadStatNew;
    obj.AgencyCode = this.tempAgencyCode;
    obj.CmoUsername = this.tempCmoUsername;
    obj.SurveyorUsername = this.tempSurveyorUsername;
    obj.TeleMarketingUsername = this.tempSalesUsername;
  }

  SaveForm(isNext: boolean = false) {
    if (this.MainInfoForm.valid) {
      if (this.pageType == "edit" || this.pageType == "update") {
        this.editLeadObj.LeadId = this.LeadId;
        this.editLeadObj.RowVersion = this.returnLead.RowVersion;
        this.setLeadObj(this.editLeadObj);
        this.http.post(URLConstant.EditLead, this.editLeadObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (isNext) {
              if (this.pageType == "edit") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_INPUT_PAGE], { "LeadId": this.LeadId, "mode": this.pageType });
              }
              else {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_INPUT_PAGE], { "LeadId": this.LeadId, "mode": this.pageType, "WfTaskListId": this.WfTaskListId });
              }
            }
            else {
              if (this.pageType == "edit") {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_PAGING], {});
              }
              else {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
              }
            }
          }
        );
      } else {
        this.setLeadObj(this.addLeadObj);
        this.http.post(URLConstant.AddLead, this.addLeadObj).subscribe(
          (response: GenericObj) => {
            this.responseLead = response;
            this.LeadId = this.responseLead.Id;
            this.toastr.successMessage(response["message"]);
            if (isNext) {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_INPUT_PAGE], { "LeadId": this.LeadId, "CopyFrom": this.leadIdExist });
            }
            else {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_PAGING], {});
            }
          }
        );
      }
    }
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }
}
