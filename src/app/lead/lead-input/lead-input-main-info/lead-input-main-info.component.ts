import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { UcpagingComponent } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { MouCustSignerObj } from 'app/shared/model/MouCustSignerObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { LeadObj } from 'app/shared/model/Lead.Model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { RefLobObj } from 'app/shared/model/RefLobObj.Model';


@Component({
  selector: 'app-lead-input-main-info',
  templateUrl: './lead-input-main-info.component.html',
  providers: [DecimalPipe, NGXToastrService]
})
export class LeadInputMainInfoComponent implements OnInit {
  inputPagingObj: any;
  LeadId: any;
  MouType: any;
  addLead: any;
  leadObj: any;
  setLeadObj: any;
  cmoNameLookUpObj: any;
  surveyorNameLookUpObj: any;
  salesNameLookUpObj:any;
  agencyLookUpObj: any;
  tempCmoName: any;
  tempSurveyorName: any;
  tempSalesName: any;
  tempAgency: any;
  getListRefOffice: any;
  getListActiveLob: any;
  getListActiveRefMasterUrl: any;
  listRefOffice: any;
  refOfficeObj: any;
  listRefLob:any;
  refLobObj: any;
  leadSource: any;
  listLeadSource: any;
  pageType: string = "add";
  page:any;
  custShareholderLookUpObj1: any;
  MainInfoForm = this.fb.group({
    OfficeCode: [''],
    OfficeName: [''],
    OrderNo:[''],
    LobCode: [''],
    LobName: [''],
    LeadSource: [''],
  });
  
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.addLead = AdInsConstant.AddLead;
    this.getListRefOffice = AdInsConstant.GetListKvpActiveRefOfficeForPaging;
    this.getListActiveLob = AdInsConstant.GetListActiveLob;
    this.getListActiveRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;

    this.route.queryParams.subscribe(params => {
        if (params["LeadId"] != null) {
            this.pageType = params["LeadId"];
        }
        if (params["mode"] != null) {
          this.LeadId = params["mode"];
      }
    });
  }

getLookUpAgency(event) {
  this.tempAgency = event.EmpName;
}

getLookUpCmoName(event) {
    this.tempCmoName = event.EmpName;
}

getLookUpSurveyorName(event) {
    this.tempSurveyorName = event.EmpName;
}

getLookUpSalesName(event) {
    this.tempSalesName = event.EmpName;
}

  ngOnInit() {
    this.custShareholderLookUpObj1 = new InputLookupObj();
    this.custShareholderLookUpObj1.isRequired = false;
    this.custShareholderLookUpObj1.urlJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.custShareholderLookUpObj1.urlEnviPaging = environment.FoundationR3Url;
    this.custShareholderLookUpObj1.pagingJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj1.genericJson = "./assets/uclookup/lookupCustCompanyShareholder.json";

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
        console.log("aaa")
        console.log(this.listRefOffice)
        this.MainInfoForm.patchValue({ 
          OfficeCode: response['ReturnObject'][0]['Key'],
          OfficeName: response['ReturnObject'][0]['Value'] 
        });
      },
      (error) => {
        console.log(error);
      });

    this.refLobObj = new RefLobObj();
    this.refLobObj.RefLobId = "-"
    this.http.post(this.getListActiveLob, this.refLobObj).subscribe(
      (response) => {
          this.listRefLob = response['ReturnObject'];
          console.log("bbb")
          console.log(this.listRefLob)
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
  }

  setLead(){
    this.leadObj.OriOfficeCode = this.MainInfoForm.controls["OfficeCode"].value;
    this.leadObj.OriOfficeName = this.MainInfoForm.controls["OfficeName"].value;
    this.leadObj.MfSignerJobPosition1 = this.MainInfoForm.controls["NickName"].value;;
    this.leadObj.MfSignerName2 = this.MainInfoForm.controls["NickName"].value;;
    this.leadObj.MfSignerJobPosition2 = this.MainInfoForm.controls["NickName"].value;;
    this.leadObj.CustSignerName1 = this.MainInfoForm.controls["NickName"].value;;
    this.leadObj.CustSignerJobPosition1 = this.MainInfoForm.controls["NickName"].value;;
    this.leadObj.CustSignerName2 = this.MainInfoForm.controls["NickName"].value;;
    this.leadObj.CustSignerJobPosition2 = this.MainInfoForm.controls["NickName"].value;;
  }

  SaveForm(){
    this.leadObj = new LeadObj();
    this.setLead();
    this.http.post(this.addLead, this.leadObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Lead/Page"]);
        console.log(response)
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
