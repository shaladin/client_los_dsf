import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { UcpagingComponent } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { RefLobObj } from 'app/shared/model/RefLobObj.Model';
import { VendorObj } from 'app/shared/model/Vendor.Model';
import { RefEmpForLookupObj } from 'app/shared/model/RefEmpForLookupObj.Model';

@Component({
  selector: 'app-lead-input-main-info',
  templateUrl: './lead-input-main-info.component.html',
  providers: [DecimalPipe, NGXToastrService]
})
export class LeadInputMainInfoComponent implements OnInit {
  user: any;
  LeadId: number;
  addLead: any;
  editLead: any;
  getLeadByLeadId: any;
  returnLead: any;
  responseLead: any;
  leadObj: any;
  getLeadObj: LeadObj;
  cmoNameLookUpObj: any;
  surveyorNameLookUpObj: any;
  salesNameLookUpObj:any;
  agencyLookUpObj: any;
  tempCmoName: any;
  tempCmoCode: any;
  tempSurveyorName: any;
  tempSurveyorCode: any;
  tempSalesName: any;
  tempSalesCode: any;
  tempAgencyName: any;
  tempAgencyCode: any;
  getListRefOffice: any;
  getListActiveLob: any;
  getListActiveRefMasterUrl: any;
  getVendorByVendorCode: any;
  getRefEmpForLookupEmployee: any;
  getLeadPersonalForLookup: any;
  listRefOffice: any;
  refOfficeObj: any;
  listRefLob:any;
  refLobObj: any;
  leadSource: any;
  listLeadSource: any;
  vendorObj: any;
  returnVendorObj: any;
  pageType: string = "add";
  leadPersonalLookUpObj: any;
  cmoObj: any;
  returnCmoObj: any;
  surveyorObj: any;
  returnSurveyorObj: any;
  salesObj: any;
  returnSalesObj: any;
  leadIdExist: number;
  getExistLeadObj: any;
  returnExistLead: any;
  vendorExistObj: any;
  returnVendorExistObj: any;
  cmoExistObj: any;
  returnCmoExistObj: any;
  surveyorExistObj: any;
  returnSurveyorExistObj: any;
  salesExistObj: any;
  returnSalesExistObj: any;
  leadExistObj: any;
  returnLeadExistObj: any;
  MainInfoForm = this.fb.group({
    OfficeCode: [''],
    OfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    OrderNo:[''],
    LobCode: [''],
    LobName:[''],
    LeadSource: [''],
  });
  
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.addLead = AdInsConstant.AddLead;
    this.editLead = AdInsConstant.EditLead;
    this.getLeadByLeadId = AdInsConstant.GetLeadByLeadId;
    this.getListRefOffice = AdInsConstant.GetListKvpActiveRefOfficeForPaging;
    this.getListActiveLob = AdInsConstant.GetListActiveLob;
    this.getListActiveRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getVendorByVendorCode = AdInsConstant.GetVendorByVendorCode;
    this.getRefEmpForLookupEmployee = AdInsConstant.GetRefEmpForLookupEmployee;
    this.getLeadPersonalForLookup = AdInsConstant.GetLeadPersonalForLookupCopy;

    this.route.queryParams.subscribe(params => {
        if (params["mode"] != null) {
            this.pageType = params["mode"];
        }
        if (params["LeadId"] != null) {
          this.LeadId = params["LeadId"];
      }
    });
  }

getLookUpAgency(event) {
  this.tempAgencyName = event.VendorName;
  this.tempAgencyCode = event.VendorCode;
}

getLookUpCmoName(event) {
    this.tempCmoName = event.EmpName;
    this.tempCmoCode = event.RoleCode;
}

getLookUpSurveyorName(event) {
    this.tempSurveyorName = event.EmpName;
    this.tempSurveyorCode = event.RoleCode;
}

getLookUpSalesName(event) {
    this.tempSalesName = event.EmpName;
    this.tempSalesCode = event.RoleCode;
}

getLookUpLead(event) {
    this.leadIdExist = event.LeadId;
}

copyLead(){
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
              this.tempAgencyName = this.returnVendorExistObj.VendorName;
              this.tempAgencyCode = this.returnVendorExistObj.VendorCode;
          });
        
          this.cmoExistObj = new RefEmpForLookupObj();
          this.cmoExistObj.EmpName = this.returnExistLead.CmoName;
          this.cmoExistObj.RoleCode = this.returnExistLead.CmoCode;
          this.http.post(this.getRefEmpForLookupEmployee, this.cmoExistObj).subscribe(
            (response) => {
                this.returnCmoExistObj = response;
                this.cmoNameLookUpObj.nameSelect = this.returnCmoExistObj.EmpName;
                this.cmoNameLookUpObj.jsonSelect = this.returnCmoExistObj;
                this.tempCmoName = this.returnCmoExistObj.EmpName;
                this.tempCmoCode = this.returnCmoExistObj.RoleCode;
            });
          
          this.surveyorExistObj = new RefEmpForLookupObj();
          this.surveyorExistObj.EmpName = this.returnExistLead.SurveyorName;
          this.surveyorExistObj.RoleCode = this.returnExistLead.SurveyorCode;
          this.http.post(this.getRefEmpForLookupEmployee, this.surveyorExistObj).subscribe(
            (response) => {
                this.returnSurveyorExistObj = response;
                this.surveyorNameLookUpObj.nameSelect = this.returnSurveyorExistObj.EmpName;
                this.surveyorNameLookUpObj.jsonSelect = this.returnSurveyorExistObj;
                this.tempSurveyorName = this.returnSurveyorExistObj.EmpName;
                this.tempSurveyorCode = this.returnSurveyorExistObj.RoleCode;
            });

          this.salesExistObj = new RefEmpForLookupObj();
          this.salesExistObj.EmpName = this.returnExistLead.TeleMarketingName;
          this.salesExistObj.RoleCode = this.returnExistLead.TeleMarketingCode;
          this.http.post(this.getRefEmpForLookupEmployee, this.salesExistObj).subscribe(
            (response) => {
                this.returnSalesExistObj = response;
                this.salesNameLookUpObj.nameSelect = this.returnSalesExistObj.EmpName;
                this.salesNameLookUpObj.jsonSelect = this.returnSalesExistObj;
                this.tempSalesName = this.returnSalesExistObj.EmpName;
                this.tempSalesCode = this.returnSalesExistObj.RoleCode;
            });
    });
}

  ngOnInit() {
    // console.log("ccc")
    // console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    if (this.user.MrOfficeTypeCode == "HO") {
      this.MainInfoForm.patchValue({
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    } else if (this.user.MrOfficeTypeCode == "Center Group") {
      this.MainInfoForm.patchValue({
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }

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

    this.cmoNameLookUpObj = new InputLookupObj();
    this.cmoNameLookUpObj.isRequired = false;
    this.cmoNameLookUpObj.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.cmoNameLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.cmoNameLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.cmoNameLookUpObj.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.cmoNameLookUpObj.genericJson = "./assets/uclookup/lookupEmployee.json";

    this.surveyorNameLookUpObj = new InputLookupObj();
    this.surveyorNameLookUpObj.isRequired = false;
    this.surveyorNameLookUpObj.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.surveyorNameLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.surveyorNameLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.surveyorNameLookUpObj.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.surveyorNameLookUpObj.genericJson = "./assets/uclookup/lookupEmployee.json";

    this.salesNameLookUpObj = new InputLookupObj();
    this.salesNameLookUpObj.isRequired = false;
    this.salesNameLookUpObj.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.salesNameLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.salesNameLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.salesNameLookUpObj.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.salesNameLookUpObj.genericJson = "./assets/uclookup/lookupEmployee.json";

    this.refOfficeObj = new RefOfficeObj();
    this.http.post(this.getListRefOffice, this.refOfficeObj).subscribe(
      (response) => {
        this.listRefOffice = response['ReturnObject']
        // console.log("aaa")
        // console.log(this.listRefOffice)
        this.MainInfoForm.patchValue({  OfficeCode: response['ReturnObject'][0]['Key'] });
      },
      (error) => {
        console.log(error);
      });

    this.refLobObj = new RefLobObj();
    this.refLobObj.RefLobId = "-"
    this.http.post(this.getListActiveLob, this.refLobObj).subscribe(
      (response) => {
          this.listRefLob = response['ReturnObject'];
          // console.log("bbb")
          // console.log(this.listRefLob)
          this.MainInfoForm.patchValue({ 
            LobCode: response['ReturnObject'][0]['Key'],
            LobName: response['ReturnObject'][0]['Value']
          });
      },
      (error) => {
          console.log(error);
      });

    this.leadSource = new RefMasterObj();
    this.leadSource.RefMasterTypeCode = "LEAD_SOURCE";
    this.http.post(this.getListActiveRefMasterUrl, this.leadSource).subscribe(
    (response) => {
        this.listLeadSource = response['ReturnObject'];
        this.MainInfoForm.patchValue({ LeadSource: response['ReturnObject'][0]['Key'] });
    });

    if(this.pageType == "edit")
    {
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

            if(this.returnLead.LeadCopyId != null){
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
                  this.tempAgencyName = this.returnVendorObj.VendorName;
                  this.tempAgencyCode = this.returnVendorObj.VendorCode;
              });
            
              this.cmoObj = new RefEmpForLookupObj();
              this.cmoObj.EmpName = this.returnLead.CmoName;
              this.cmoObj.RoleCode = this.returnLead.CmoCode;
              this.http.post(this.getRefEmpForLookupEmployee, this.cmoObj).subscribe(
                (response) => {
                    this.returnCmoObj = response;
                    this.cmoNameLookUpObj.nameSelect = this.returnCmoObj.EmpName;
                    this.cmoNameLookUpObj.jsonSelect = this.returnCmoObj;
                    this.tempCmoName = this.returnCmoObj.EmpName;
                    this.tempCmoCode = this.returnCmoObj.RoleCode;
                });
              
              this.surveyorObj = new RefEmpForLookupObj();
              this.surveyorObj.EmpName = this.returnLead.SurveyorName;
              this.surveyorObj.RoleCode = this.returnLead.SurveyorCode;
              this.http.post(this.getRefEmpForLookupEmployee, this.surveyorObj).subscribe(
                (response) => {
                    this.returnSurveyorObj = response;
                    this.surveyorNameLookUpObj.nameSelect = this.returnSurveyorObj.EmpName;
                    this.surveyorNameLookUpObj.jsonSelect = this.returnSurveyorObj;
                    this.tempSurveyorName = this.returnSurveyorObj.EmpName;
                    this.tempSurveyorCode = this.returnSurveyorObj.RoleCode;
                });

              this.salesObj = new RefEmpForLookupObj();
              this.salesObj.EmpName = this.returnLead.TeleMarketingName;
              this.salesObj.RoleCode = this.returnLead.TeleMarketingCode;
              this.http.post(this.getRefEmpForLookupEmployee, this.salesObj).subscribe(
                (response) => {
                    this.returnSalesObj = response;
                    this.salesNameLookUpObj.nameSelect = this.returnSalesObj.EmpName;
                    this.salesNameLookUpObj.jsonSelect = this.returnSalesObj;
                    this.tempSalesName = this.returnSalesObj.EmpName;
                    this.tempSalesCode = this.returnSalesObj.RoleCode;
                });
        });
    }
  }

  OfficeChanged(event){
    this.MainInfoForm.patchValue({
      OfficeName: this.listRefOffice.find(x => x.Key == event.target.value).Value
    });
  }

  LobChanged(event){
    this.MainInfoForm.patchValue({
      LobName: this.listRefLob.find(x => x.Key == event.target.value).Value
    });
  }

  setLead(){
    this.leadObj.LeadNo = "";
    this.leadObj.LeadCopyId = this.leadIdExist;
    this.leadObj.OriOfficeCode = this.MainInfoForm.controls["OfficeCode"].value;
    this.leadObj.OriOfficeName = this.MainInfoForm.controls["OfficeName"].value;
    this.leadObj.CrtOfficeCode = this.MainInfoForm.controls["CrtOfficeCode"].value;
    this.leadObj.CrtOfficeName = this.MainInfoForm.controls["CrtOfficeName"].value;
    this.leadObj.LeadDt = new Date();
    this.leadObj.OrderNo = this.MainInfoForm.controls["OrderNo"].value;
    this.leadObj.LobCode = this.MainInfoForm.controls["LobCode"].value;
    this.leadObj.LobName = this.MainInfoForm.controls["LobName"].value;
    this.leadObj.MrLeadSourceCode = this.MainInfoForm.controls["LeadSource"].value;
    this.leadObj.LeadStat = "NEW";
    this.leadObj.LeadStep = "NEW";
    this.leadObj.AgencyCode = this.tempAgencyCode;
    this.leadObj.AgencyName = this.tempAgencyName;
    this.leadObj.CmoCode = this.tempCmoCode;
    this.leadObj.CmoName = this.tempCmoName;
    this.leadObj.SurveyorCode = this.tempSurveyorCode;
    this.leadObj.SurveyorName = this.tempSurveyorName;
    this.leadObj.TeleMarketingCode = this.tempSalesCode;
    this.leadObj.TeleMarketingName = this.tempSalesName;
  }

  SaveForm(){
    // console.log("aaaa")
    if(this.pageType == "edit") {
      this.leadObj = new LeadObj();
      this.leadObj.LeadId = this.LeadId;
      this.leadObj.RowVersion = this.returnLead.RowVersion;
      this.setLead();
      this.http.post(this.editLead, this.leadObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.router.navigate(["/Lead/LeadInput/Page"], { queryParams: { "LeadId": this.LeadId, "mode": "edit" } });
          // console.log(response)
        },
        (error) => {
          console.log(error);
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
          this.router.navigate(["/Lead/LeadInput/Page"], { queryParams: { "LeadId": this.LeadId, "CopyFrom": this.leadIdExist } });
          // console.log(response)
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
