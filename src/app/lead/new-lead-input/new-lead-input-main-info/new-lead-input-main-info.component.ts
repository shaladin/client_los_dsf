import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { LeadForLookupObj } from 'app/shared/model/LeadForLookupObj.Model';
import { RefEmpForLookupObj } from 'app/shared/model/RefEmpForLookupObj.Model';
import { RefLobObj } from 'app/shared/model/RefLobObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { VendorObj } from 'app/shared/model/Vendor.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-lead-input-main-info',
  templateUrl: './new-lead-input-main-info.component.html',
  styles: []
})
export class NewLeadInputMainInfoComponent implements OnInit {
  user: CurrentUserContext;
  LeadId: number;
  returnLead: LeadObj;
  responseLead: GenericObj;
  leadObj: LeadObj;
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
  returnCmoObj: RefEmpForLookupObj;
  surveyorObj: RefEmpForLookupObj;
  returnSurveyorObj: RefEmpForLookupObj;
  salesObj: RefEmpForLookupObj;
  returnSalesObj: RefEmpForLookupObj;
  leadIdExist: number;
  getExistLeadObj: LeadObj;
  returnExistLead: LeadObj;
  vendorExistObj: VendorObj;
  returnVendorExistObj: VendorObj;
  cmoExistObj: RefEmpForLookupObj;
  returnCmoExistObj: RefEmpForLookupObj;
  surveyorExistObj: RefEmpForLookupObj;
  returnSurveyorExistObj: RefEmpForLookupObj;
  salesExistObj: RefEmpForLookupObj;
  returnSalesExistObj: RefEmpForLookupObj;
  leadExistObj: LeadObj;
  returnLeadExistObj: LeadForLookupObj;
  MainInfoForm = this.fb.group({
    OfficeCode: ['', [Validators.required]],
    OfficeName: [''],
    CrtOfficeCode: [''],
    OrderNo: [''],
    LobCode: [''],
    LeadSource: ['', [Validators.required]],
  });
  WfTaskListId: number;
  isCopyButtonDisabled: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private cookieService: CookieService
  ) {
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

  ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTask();
    }
    this.MakeLookUpObj();
    this.GetOfficeDDL();
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.refLobObj = new RefLobObj();
    this.refLobObj.RefLobId = "-"

    // this.leadSource = new RefMasterObj();
    // this.leadSource.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeLeadSource;
    // this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.leadSource).subscribe(
    //   (response) => {
    //     this.listLeadSource = response[CommonConstant.ReturnObj];
    //     this.MainInfoForm.patchValue({ LeadSource: response[CommonConstant.ReturnObj][0]['Key'] });
    //   });
    let userContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let objectLead = {
      Id: userContext.OfficeId,
      RowVersion: ""
    };

    this.http.post(URLConstant.GetListKvpRefAppSrcForAppOrLead, objectLead).subscribe(
      (response) => {
        this.listLeadSource = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({ LeadSource: response[CommonConstant.ReturnObj][0]['Key'] });
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: "LOB" }).subscribe(
      (response) => {
        this.listRefLob = response[CommonConstant.ReturnObj];

      });

    if (this.pageType == "edit" || this.pageType == "update") {
      this.getLeadObj = new LeadObj();
      this.getLeadObj.LeadId = this.LeadId;
      let obj = {
        Id: this.getLeadObj.LeadId
      }
      this.http.post(URLConstant.GetLeadByLeadId, obj).subscribe(
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
            let obj = {
              Id: this.leadExistObj.LeadId
            }
            this.http.post(URLConstant.GetLeadPersonalForLookupCopy, obj).subscribe(
              (response: LeadForLookupObj) => {
                this.returnLeadExistObj = response;
              });
          }

          this.vendorObj = new VendorObj();
          this.vendorObj.VendorCode = this.returnLead.AgencyCode;
          let obj = {
            Code: this.vendorObj.VendorCode
          }
          this.http.post(URLConstant.GetVendorByVendorCode, obj).subscribe(
            (response: VendorObj) => {
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
            (response: RefEmpForLookupObj) => {
              this.returnCmoObj = response;
              this.cmoNameLookUpObj.nameSelect = this.returnCmoObj.Username;
              this.cmoNameLookUpObj.jsonSelect = this.returnCmoObj;
            });

          this.surveyorObj = new RefEmpForLookupObj();
          this.surveyorObj.Username = this.returnLead.SurveyorUsername;
          this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.surveyorObj).subscribe(
            (response: RefEmpForLookupObj) => {
              this.returnSurveyorObj = response;
              this.surveyorNameLookUpObj.nameSelect = this.returnSurveyorObj.Username;
              this.surveyorNameLookUpObj.jsonSelect = this.returnSurveyorObj;
            });

          this.salesObj = new RefEmpForLookupObj();
          this.salesObj.Username = this.returnLead.TeleMarketingUsername;
          this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.salesObj).subscribe(
            (response: RefEmpForLookupObj) => {
              this.returnSalesObj = response;
              this.salesNameLookUpObj.nameSelect = this.returnSalesObj.Username;
              this.salesNameLookUpObj.jsonSelect = this.returnSalesObj;
            });
        });
    }
  }

  AddView() {
    AdInsHelper.OpenLeadViewByLeadId(this.LeadId);
  }

  backHandler() {
    if (this.pageType == "update") {
      this.router.navigate(['/Lead/SimpleLeadUpdate/Paging']);
    }
    else {
      this.router.navigate(['/Lead/SimpleLead/Paging']);
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
    let obj = {
      Id: this.getExistLeadObj.LeadId
    }
    this.http.post(URLConstant.GetLeadByLeadId, obj).subscribe(
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
        let obj = {
          Code: this.vendorExistObj.VendorCode
        }
        this.http.post(URLConstant.GetVendorByVendorCode, obj).subscribe(
          (response: VendorObj) => {
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
          (response: RefEmpForLookupObj) => {
            this.returnCmoExistObj = response;
            this.cmoNameLookUpObj.nameSelect = this.returnCmoExistObj.Username;
            this.cmoNameLookUpObj.jsonSelect = this.returnCmoExistObj;

          });

        this.surveyorExistObj = new RefEmpForLookupObj();
        this.surveyorExistObj.Username = this.returnExistLead.SurveyorUsername;
        this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.surveyorExistObj).subscribe(
          (response: RefEmpForLookupObj) => {
            this.returnSurveyorExistObj = response;
            this.surveyorNameLookUpObj.nameSelect = this.returnSurveyorExistObj.Username;
            this.surveyorNameLookUpObj.jsonSelect = this.returnSurveyorExistObj;
          });

        this.salesExistObj = new RefEmpForLookupObj();
        this.salesExistObj.Username = this.returnExistLead.TeleMarketingUsername;
        this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.salesExistObj).subscribe(
          (response: RefEmpForLookupObj) => {
            this.returnSalesExistObj = response;
            this.salesNameLookUpObj.nameSelect = this.returnSalesExistObj.Username;
            this.salesNameLookUpObj.jsonSelect = this.returnSalesExistObj;
          });
      });
  }

  MakeLookUpObj() {
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

  GetOfficeDDL() {
    this.refOfficeObj = new RefOfficeObj();
    this.http.post(URLConstant.GetListKvpActiveRefOfficeForPaging, this.refOfficeObj).subscribe(
      (response: Array<KeyValueObj>) => {
        this.listRefOffice = response[CommonConstant.ReturnObj];
        // this.MainInfoForm.patchValue({
        //   OfficeCode: response[CommonConstant.ReturnObj][0]['Key'],
        //   OfficeName: response[CommonConstant.ReturnObj][0]['Value']
        // });

        if (this.user.MrOfficeTypeCode == "CG" || this.user.MrOfficeTypeCode == CommonConstant.HeadOffice) {
          this.MainInfoForm.patchValue({
            CrtOfficeCode: this.user.OfficeCode,
            OfficeCode: this.listRefOffice[0].Key,
            OfficeName: this.listRefOffice[0].Value,
          });
          // this.MainInfoForm.controls.OfficeCode.setValidators([Validators.required]);    
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
    this.leadObj.LeadStat = CommonConstant.LeadStatNewSmpl;
    this.leadObj.LeadStep = CommonConstant.LeadStatNewSmpl;
    this.leadObj.AgencyCode = this.tempAgencyCode;
    this.leadObj.CmoUsername = this.tempCmoUsername;
    this.leadObj.SurveyorUsername = this.tempSurveyorUsername;
    this.leadObj.TeleMarketingUsername = this.tempSalesUsername;
  }

  SaveForm() {
    if (this.MainInfoForm.valid) {
      if (this.pageType == "edit" || this.pageType == "update") {
        this.leadObj = new LeadObj();
        this.leadObj.LeadId = this.LeadId;
        this.leadObj.RowVersion = this.returnLead.RowVersion;
        this.setLead();
        this.http.post(URLConstant.EditLead, this.leadObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.pageType == "edit") {
              this.router.navigate(["/Lead/SimpleLead/Detail"], { queryParams: { "LeadId": this.LeadId, "mode": this.pageType } });
            }
            else {
              this.router.navigate(["/Lead/SimpleLead/Detail"], { queryParams: { "LeadId": this.LeadId, "mode": this.pageType, "WfTaskListId": this.WfTaskListId } });
            }
          }
        );
      } else {
        this.leadObj = new LeadObj();
        this.setLead();
        this.http.post(URLConstant.AddLead, this.leadObj).subscribe(
          (response) => {
            this.LeadId = response["Id"];
            this.toastr.successMessage(response["message"]);
            this.router.navigate(["/Lead/SimpleLead/Detail"], { queryParams: { "LeadId": this.LeadId, "CopyFrom": this.leadIdExist } });
          }
        );
      }
    }
  }

  save() {
    if (this.MainInfoForm.valid) {
      if (this.pageType == "edit" || this.pageType == "update") {
        this.leadObj = new LeadObj();
        this.leadObj.LeadId = this.LeadId;
        this.leadObj.RowVersion = this.returnLead.RowVersion;
        this.setLead();
        this.http.post(URLConstant.EditLead, this.leadObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            if (this.pageType == "edit") {
              this.router.navigate(["/Lead/SimpleLead/Paging"]);
            }
            else {
              this.router.navigate(["/Lead/SimpleLeadUpdate/Paging"]);
            }
          }
        );
      } else {
        this.leadObj = new LeadObj();
        this.setLead();
        this.http.post(URLConstant.AddLead, this.leadObj).subscribe(
          (response: GenericObj) => {
            this.responseLead = response;
            this.LeadId = this.responseLead.Id;
            this.toastr.successMessage(response["message"]);
            this.router.navigate(["/Lead/SimpleLead/Paging"]);
          }
        );
      }
    }
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

}
