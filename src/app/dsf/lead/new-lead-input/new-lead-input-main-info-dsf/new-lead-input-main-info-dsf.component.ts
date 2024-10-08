import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { LeadForLookupObj } from 'app/shared/model/lead-for-lookup-obj.model';
import { RefEmpForLookupObj } from 'app/shared/model/ref-emp-for-lookup-obj.model';
import { RefLobObj } from 'app/shared/model/ref-lob-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { RefOfficeObj } from 'app/shared/model/ref-office-obj.model';
import { VendorObj } from 'app/shared/model/vendor-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { LeadDsfObj } from 'app/shared/model/lead-dsf.model';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Console } from 'console';
import { Messages } from 'primeng/primeng';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-new-lead-input-main-info-dsf',
  templateUrl: './new-lead-input-main-info-dsf.component.html',
  styleUrls: ['./new-lead-input-main-info-dsf.component.css']
})
export class NewLeadInputMainInfoDsfComponent implements OnInit {
  user: CurrentUserContext;
  LeadId: number;
  returnLead: LeadObj;
  returnLeadDsf: LeadDsfObj;
  responseLead: GenericObj;
  leadObj: LeadObj;
  leadDsfObj: LeadDsfObj;
  getLeadObj: LeadObj;
  cmoNameLookUpObj: InputLookupObj;
  supplierNameLookUpObj: InputLookupObj;
  salesNameLookUpObj: InputLookupObj;
  agencyLookUpObj: InputLookupObj;
  //Self Custom
  tempCmoUsername: string = "";
  tempSupplierName: string = "";
  tempSalesUsername: string = "";
  tempAgencyCode: string = "";
  //End Self Custom
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
  supplierObj: RefEmpForLookupObj;
  salesObj: RefEmpForLookupObj;
  returnSalesObj: RefEmpForLookupObj;
  leadIdExist: number;
  getExistLeadObj: LeadObj;
  returnExistLead: LeadObj;
  returnExistLeadDsf: LeadDsfObj;
  vendorExistObj: VendorObj;
  returnVendorExistObj: VendorObj;
  cmoExistObj: RefEmpForLookupObj;
  returnCmoExistObj: RefEmpForLookupObj;
  supllierExistObj: RefEmpForLookupObj;
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
    SubmissionReceiptDate: [''],
  });
  WfTaskListId: any;
  isCopyButtonDisabled: boolean = true;
  reqAddLeadDsf:{LeadId:number, SubmissionReceiptDate:Date};
  reqUpdateLeadStepDsf:{LeadId:number};
  reqGetLeadDsf:{LeadId:number};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService
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
    if(environment.isCore){
      if(this.WfTaskListId != "" && this.WfTaskListId != undefined){
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    }
    else if (this.WfTaskListId > 0) {
        this.claimTaskService.ClaimTask(this.WfTaskListId);
    }

    this.MakeLookUpObj();
    this.GetOfficeDDL();
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.refLobObj = new RefLobObj();
    this.refLobObj.RefLobId = "-"

    this.leadSource = new RefMasterObj();
    this.leadSource.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeLeadSource;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.leadSource).subscribe(
      (response) => {
        this.listLeadSource = response[CommonConstant.ReturnObj];
        this.MainInfoForm.patchValue({ LeadSource: response[CommonConstant.ReturnObj][0]['Key'] });
      });
    let userContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let objectLead = {
      Code: userContext.OfficeCode,
      RowVersion: ""
    };
    console.log(userContext);
    // this.http.post(URLConstant.GetListKvpRefAppSrcForAppOrLead, objectLead).subscribe(
    //   (response) => {
    //     this.listLeadSource = response[CommonConstant.ReturnObj];
    //     this.MainInfoForm.patchValue({ LeadSource: response[CommonConstant.ReturnObj][0]['Key'] });
    //   });

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

          //Self Custom
          this.reqGetLeadDsf = {
            LeadId: this.returnLead.LeadId
          }

          this.http.post(URLConstantDsf.GetLeadDsfByLeadId, this.reqGetLeadDsf).subscribe(
          (response2: LeadDsfObj) => {
            this.returnLeadDsf = response2;

            if(this.returnLeadDsf.LeadId != 0){
              this.MainInfoForm.patchValue({
                SubmissionReceiptDate: formatDate(this.returnLeadDsf.SubmissionReceiptDate, 'yyyy-MM-dd', 'en-US'),
              });
            }
            else{
              this.MainInfoForm.patchValue({
                SubmissionReceiptDate: [null],
              });
            }
          });
          // End Self Custom

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
	      //Self Custom
              this.tempAgencyCode = this.returnVendorObj.VendorCode == null ? "" : this.returnVendorObj.VendorCode;
	      //End Self Custom
            });

          // this.cmoNameLookUpObj.nameSelect = this.returnLead.CmoUsername;
          // this.cmoNameLookUpObj.jsonSelect = this.returnLead;
          // this.surveyorNameLookUpObj.nameSelect = this.returnLead.SurveyorUsername;
          // this.surveyorNameLookUpObj.jsonSelect = this.returnLead;
          // this.salesNameLookUpObj.nameSelect = this.returnLead.TeleMarketingUsername;
          // this.salesNameLookUpObj.jsonSelect = this.returnLead;
          this.tempCmoUsername = this.returnLead.CmoUsername;
          this.tempSupplierName = this.returnLead.SurveyorUsername;
          this.tempSalesUsername = this.returnLead.TeleMarketingUsername;

          this.cmoObj = new RefEmpForLookupObj();
          this.cmoObj.Username = this.returnLead.CmoUsername;
          this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.cmoObj).subscribe(
            (response: RefEmpForLookupObj) => {
              this.returnCmoObj = response;
              this.cmoNameLookUpObj.nameSelect = this.returnCmoObj.Username;
              this.cmoNameLookUpObj.jsonSelect = this.returnCmoObj;
            });

          this.supplierObj = new RefEmpForLookupObj();
          this.supplierObj.Username = this.returnLead.SurveyorUsername;
          this.http.post(URLConstant.GetVendorByVendorCode, { Code : this.supplierObj.Username }).subscribe(
            (response: any) => {
              this.vendorObj = response;
              this.supplierNameLookUpObj.nameSelect = this.vendorObj.VendorName;
              this.supplierNameLookUpObj.jsonSelect = this.vendorObj;
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

  AddView(leadId: number) {
    AdInsHelper.OpenLeadViewByLeadId(leadId);
  }

  backHandler() {
    if (this.pageType == "update") {
      this.router.navigate(['/Lead/SimpleLeadUpdateDsf/Paging']);
    }
    else {
      this.router.navigate(['/Lead/SimpleLeadDsf/Paging']);
    }

  }

  getLookUpAgency(event) {
    this.tempAgencyCode = event.VendorCode;
  }

  getLookUpCmoName(event) {
    this.tempCmoUsername = event.Username;
  }

  getLookUpSupplierName(event) {
    this.tempSupplierName = event.VendorCode;
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

        //Self Custom
        this.reqGetLeadDsf = {
          LeadId: this.returnExistLead.LeadId
        }

        this.http.post(URLConstantDsf.GetLeadDsfByLeadId, this.reqGetLeadDsf).subscribe(
        (response2: LeadDsfObj) => {
          this.returnExistLeadDsf = response2;

          if(this.returnExistLeadDsf.LeadId != 0){
            this.MainInfoForm.patchValue({
              SubmissionReceiptDate: formatDate(this.returnExistLeadDsf.SubmissionReceiptDate, 'yyyy-MM-dd', 'en-US'),
            });
          }
          else{
            this.MainInfoForm.patchValue({
              SubmissionReceiptDate: [null],
            });
          }
        });
        // End Self Custom

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
	    //Self Custom
            this.tempAgencyCode = this.returnVendorExistObj.VendorCode == null ? "" : this.returnVendorObj.VendorCode;
	    //End Self Custom
          });
        // this.cmoNameLookUpObj.nameSelect = this.returnExistLead.CmoUsername;
        // this.cmoNameLookUpObj.jsonSelect = this.returnExistLead;
        // this.surveyorNameLookUpObj.nameSelect = this.returnExistLead.SurveyorUsername;
        // this.surveyorNameLookUpObj.jsonSelect = this.returnExistLead;
        // this.salesNameLookUpObj.nameSelect = this.returnExistLead.TeleMarketingUsername;
        // this.salesNameLookUpObj.jsonSelect = this.returnExistLead;
        this.tempCmoUsername = this.returnExistLead.CmoUsername;
        this.tempSupplierName = this.returnExistLead.SurveyorUsername;
        this.tempSalesUsername = this.returnExistLead.TeleMarketingUsername;

        this.cmoExistObj = new RefEmpForLookupObj();
        this.cmoExistObj.Username = this.returnExistLead.CmoUsername;
        this.http.post(URLConstant.GetRefEmpForLookupByUsername, this.cmoExistObj).subscribe(
          (response: RefEmpForLookupObj) => {
            this.returnCmoExistObj = response;
            this.cmoNameLookUpObj.nameSelect = this.returnCmoExistObj.Username;
            this.cmoNameLookUpObj.jsonSelect = this.returnCmoExistObj;

          });

        this.supllierExistObj = new RefEmpForLookupObj();
        this.supllierExistObj.Username = this.returnExistLead.SurveyorUsername;
        this.http.post(URLConstant.GetVendorByVendorCode, { Code : this.supllierExistObj.Username }).subscribe(
          (response: any) => {
            this.vendorObj = response;
            this.supplierNameLookUpObj.nameSelect = this.vendorObj.VendorName;
            this.supplierNameLookUpObj.jsonSelect = this.vendorObj;
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
    this.leadPersonalLookUpObj.urlEnviPaging = environment.losUrl + "/v1";
    this.leadPersonalLookUpObj.pagingJson = "./assets/uclookup/lookupLeadPersonal.json";
    this.leadPersonalLookUpObj.genericJson = "./assets/uclookup/lookupLeadPersonal.json";

    this.agencyLookUpObj = new InputLookupObj();
    this.agencyLookUpObj.isRequired = false;
    this.agencyLookUpObj.urlJson = "./assets/dsf/uclookup/lookupAgencyDsf.json";
    this.agencyLookUpObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.agencyLookUpObj.pagingJson = "./assets/dsf/uclookup/lookupAgencyDsf.json";
    this.agencyLookUpObj.genericJson = "./assets/dsf/uclookup/lookupAgencyDsf.json";

    this.cmoNameLookUpObj = new InputLookupObj();
    this.cmoNameLookUpObj.isRequired = false;
    this.cmoNameLookUpObj.urlJson = "./assets/dsf/uclookup/lookupCMODsf.json";
    this.cmoNameLookUpObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.cmoNameLookUpObj.pagingJson = "./assets/dsf/uclookup/lookupCMODsf.json";
    this.cmoNameLookUpObj.genericJson = "./assets/dsf/uclookup/lookupCMODsf.json";

    this.supplierNameLookUpObj = new InputLookupObj();
    this.supplierNameLookUpObj.isRequired = false;
    this.supplierNameLookUpObj.urlJson = "./assets/dsf/uclookup/lookupSupplierDsf.json";
    this.supplierNameLookUpObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.supplierNameLookUpObj.pagingJson = "./assets/dsf/uclookup/lookupSupplierDsf.json";
    this.supplierNameLookUpObj.genericJson = "./assets/dsf/uclookup/lookupSupplierDsf.json";

    this.salesNameLookUpObj = new InputLookupObj();
    this.salesNameLookUpObj.isRequired = false;
    this.salesNameLookUpObj.urlJson = "./assets/dsf/uclookup/lookupTeleSalesDsf.json";
    this.salesNameLookUpObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.salesNameLookUpObj.pagingJson = "./assets/dsf/uclookup/lookupTeleSalesDsf.json";
    this.salesNameLookUpObj.genericJson = "./assets/dsf/uclookup/lookupTeleSalesDsf.json";
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
    this.leadObj.SurveyorUsername = this.tempSupplierName;
    this.leadObj.TeleMarketingUsername = this.tempSalesUsername;
    this.leadObj.MrLeadTypeCode = CommonConstant.MrLeadTypeCodeSimpleLead;
    this.leadDsfObj.SubmissionReceiptDate = this.MainInfoForm.controls["SubmissionReceiptDate"].value;
  }

  SaveForm() {
    if (this.MainInfoForm.valid) {
      //Self Custom
      if(this.tempCmoUsername == "" || this.tempSalesUsername == ""){
        this.toastr.warningMessage(ExceptionConstant.LEAD_INPUT_AGENCY_CMO_TELE_DSF);
        return;
      }
      //End Self Custom

      if (this.pageType == "edit" || this.pageType == "update") {
        this.leadObj = new LeadObj();
        this.leadDsfObj = new LeadDsfObj();

        this.leadObj.LeadId = this.LeadId;
        this.leadObj.RowVersion = this.returnLead.RowVersion;

        this.setLead();
        this.http.post(URLConstant.EditLead, this.leadObj).subscribe(
          (response) => {

            //Self Custom
            this.reqAddLeadDsf = {
              LeadId: this.leadObj.LeadId,
              SubmissionReceiptDate: this.MainInfoForm.controls["SubmissionReceiptDate"].value
            }

            this.reqUpdateLeadStepDsf = {
              LeadId: this.leadObj.LeadId
            }

            this.http.post(URLConstantDsf.UpdateLeadDsf, this.reqAddLeadDsf).subscribe(
            (response2) => {
              // this.toastr.successMessage(response2["message"]);
            });

            if(this.pageType == "update"){
              this.http.post(URLConstantDsf.UpdateLeadStep, this.reqUpdateLeadStepDsf).subscribe(
                (response3) => {
                  // this.toastr.successMessage(response3["message"]);
                });
            }
            // End Self Custom

            this.toastr.successMessage(response["message"]);
            if (this.pageType == "edit") {
              this.router.navigate([NavigationConstant.SIMPLE_LEAD_DETAIL_X_DSF], { queryParams: { "LeadId": this.LeadId, "mode": this.pageType, "CopyFrom": this.leadIdExist } });
            }
            else {
              this.router.navigate([NavigationConstant.SIMPLE_LEAD_DETAIL_X_DSF], { queryParams: { "LeadId": this.LeadId, "WfTaskListId": this.WfTaskListId, "mode": this.pageType } });
            }
          }
        );
      } else {
        this.leadObj = new LeadObj();
        this.leadDsfObj = new LeadDsfObj();

        this.setLead();
        this.http.post(URLConstant.AddLead, this.leadObj).subscribe(
          (response) => {
            this.LeadId = response["Id"];

            //Self Custom
            this.reqAddLeadDsf = {
              LeadId: this.LeadId,
              SubmissionReceiptDate: this.MainInfoForm.controls["SubmissionReceiptDate"].value
            }

            this.http.post(URLConstantDsf.AddLeadDsf, this.reqAddLeadDsf).subscribe(
              (response2) => {
                // this.toastr.successMessage(response2["message"]);
              });
            // End Self Custom

            this.toastr.successMessage(response["message"]);
            this.router.navigate([NavigationConstant.SIMPLE_LEAD_DETAIL_X_DSF], { queryParams: { "LeadId": this.LeadId, "CopyFrom": this.leadIdExist } });
          }
        );
      }
    }
  }

  save() {
    if (this.MainInfoForm.valid) {
      //Self Custom
      if(this.tempCmoUsername == "" || this.tempSalesUsername == ""){
        this.toastr.warningMessage(ExceptionConstant.LEAD_INPUT_AGENCY_CMO_TELE_DSF);
        return;
      }
      //End Self Custom

      if (this.pageType == "edit" || this.pageType == "update") {
        this.leadObj = new LeadObj();
        this.leadDsfObj = new LeadDsfObj();

        this.leadObj.LeadId = this.LeadId;
        this.leadObj.RowVersion = this.returnLead.RowVersion;

        this.setLead();
        this.http.post(URLConstant.EditLead, this.leadObj).subscribe(
          (response) => {

            //Self Custom
            this.reqAddLeadDsf = {
              LeadId: this.leadObj.LeadId,
              SubmissionReceiptDate: this.MainInfoForm.controls["SubmissionReceiptDate"].value
            }

            this.reqUpdateLeadStepDsf = {
              LeadId: this.leadObj.LeadId
            }

            this.http.post(URLConstantDsf.UpdateLeadDsf, this.reqAddLeadDsf).subscribe(
            (response2) => {
              // this.toastr.successMessage(response2["message"]);
            });


            if(this.pageType == "update"){
              this.http.post(URLConstantDsf.UpdateLeadStep, this.reqUpdateLeadStepDsf).subscribe(
                (response3) => {
                  // this.toastr.successMessage(response3["message"]);
                });
            }
            // End Self Custom

            this.toastr.successMessage(response["message"]);
            if (this.pageType == "edit") {
              this.router.navigate(["/Lead/SimpleLeadDsf/Paging"]);
            }
            else {
              this.router.navigate(["/Lead/SimpleLeadUpdateDsf/Paging"]);
            }
          }
        );
      } else {
        this.leadObj = new LeadObj();
        this.leadDsfObj = new LeadDsfObj();

        this.setLead();
        this.http.post(URLConstant.AddLead, this.leadObj).subscribe(
          (response: GenericObj) => {
            this.responseLead = response;
            this.LeadId = this.responseLead.Id;

            //Self Custom
            this.reqAddLeadDsf = {
              LeadId: this.LeadId,
              SubmissionReceiptDate: this.MainInfoForm.controls["SubmissionReceiptDate"].value
            }

            this.http.post(URLConstantDsf.AddLeadDsf, this.reqAddLeadDsf).subscribe(
              (response2) => {
                // this.toastr.successMessage(response2["message"]);
              });
            // End Self Custom

             this.toastr.successMessage(response["message"]);
             this.router.navigate(["/Lead/SimpleLeadDsf/Paging"]);
            }
        );
      }
    }
  }

}
