import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';

@Component({
  selector: 'app-mou-customer-request-detail',
  templateUrl: './mou-customer-request-detail.component.html',
  providers: [NGXToastrService]
})
export class MouCustomerRequestDetailComponent implements OnInit {
  mouType: string;
  WfTaskListId: number;
  inputLookupCust: InputLookupObj;
  pageType: string = "add";
  mouCustId: number;
  refOfficeId: number;
  businessDt: Date;
  mouCustUrl: string;
  custId: number;
  custUrl: string;
  RevolvingTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CustNoObj: GenericObj = new GenericObj();
  plafondTypeObj: Array<RefMasterObj>;
  datePipe = new DatePipe("en-US");

  MOUMainInfoForm = this.fb.group({
    MouCustId: [0, [Validators.required]],
    MouCustNo: [''],
    StartDt: ['', [Validators.required]],
    EndDt: ['', [Validators.required]],
    RefNo: [''],
    IsRevolving: [false],
    PlafondAmt: ['', [Validators.required, Validators.min(1.00)]],
    MouStat: ['NEW', [Validators.required]],
    MrMouTypeCode: ['', [Validators.required]],
    RowVersion: [''],
    MrRevolvingTypeCode: [''],
    PlafondType:['']
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private http: HttpClient, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] != null) {
        this.pageType = params['mode'];
      }
      if (params['MouCustId'] != null) {
        this.mouCustId = params['MouCustId'];
      }
      if (params['MrMouTypeCode'] != null) {
        this.mouType = params['MrMouTypeCode'];
      }
      if (params['WfTaskListId'] != null) this.WfTaskListId = params['WfTaskListId'];
    });
  }

  ngOnInit() {
    this.bindAllRefMasterObj();
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.MOU_REVOLVING_TYPE }).subscribe(
      (response) => {
        this.RevolvingTypeList = response[CommonConstant.ReturnObj];
        if (this.pageType != "edit") {
          this.MOUMainInfoForm.patchValue({
            MrRevolvingTypeCode: this.RevolvingTypeList[0].Key
          });
        }
      });

    if (this.WfTaskListId > 0)
      this.claimTask();

    var datePipe = new DatePipe("en-US");
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (currentUserContext != null && currentUserContext != undefined) {
      this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.businessDt.setDate(this.businessDt.getDate() - 1);
    }

    this.inputLookupCust = new InputLookupObj();
    this.inputLookupCust.urlJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";
    this.inputLookupCust.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupCust.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupCust.pagingJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";
    this.inputLookupCust.genericJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";

    this.inputLookupCust.ddlEnvironments = [
      {
        name: "A.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    var refOffice = new RefOfficeObj();
    refOffice.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.httpClient.post(URLConstant.GetRefOfficeByOfficeCode, {Code : refOffice.OfficeCode}).subscribe(
      (response: any) => {
        this.refOfficeId = response.RefOfficeId;
      });

    if (this.pageType == "edit" || this.pageType == "return") {
      this.httpClient.post(URLConstant.GetMouCustById, { Id: this.mouCustId }).subscribe(
        (response: any) => {
          response["StartDt"] = datePipe.transform(response["StartDt"], "yyyy-MM-dd");
          response["EndDt"] = datePipe.transform(response["EndDt"], "yyyy-MM-dd");
          this.MOUMainInfoForm.patchValue({
            ...response
          });
          this.CustNoObj.CustNo = response['CustNo'];
          this.httpClient.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
            (response: any) => {
              this.custId = response['CustId'];
            });

          if (response["MrRevolvingTypeCode"] == null) {
            this.MOUMainInfoForm.controls.MrRevolvingTypeCode.setValue(this.RevolvingTypeList[0].Key);
          }

          if (response["PlafondType"] != null) {
            this.MOUMainInfoForm.controls.PlafondType.setValue(response["PlafondType"]);
          }
        });
    }
    else {
      this.MOUMainInfoForm.patchValue({
        MrMouTypeCode: this.mouType
      });
    }
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.httpClient.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }

  Back(): void {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_REQ_PAGING],{});
  }

  Save() {
    if( this.MOUMainInfoForm.controls.StartDt.value > this.datePipe.transform(this.businessDt, "yyyy-MM-dd") ){
      this.toastr.warningMessage(ExceptionConstant.START_DATE_CANNOT_MORE_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y') );
     return
   } 
   if(this.MOUMainInfoForm.controls.EndDt.value< this.datePipe.transform(this.businessDt, "yyyy-MM-dd") ){
     this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN +  this.datePipe.transform(this.businessDt, 'MMMM d, y')  );
    return;
   }
    var mouCustFormData = this.MOUMainInfoForm.value;
    if (!this.MOUMainInfoForm.controls.IsRevolving.value) {
      mouCustFormData["MrRevolvingTypeCode"] = null;
    }

    if (this.pageType == "add") {
      this.httpClient.post(URLConstant.AddMouCust, mouCustFormData).subscribe(
        (response: any) => {
          this.toastr.successMessage(response["Message"]);
          var mouCustId = response["Id"];
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DETAIL],{ mouCustId: mouCustId, MOUType: this.mouType });
        });
    }
    else if (this.pageType == "edit" || this.pageType == "return") {
      this.httpClient.post(URLConstant.EditMouCust, mouCustFormData).subscribe(
        (response: any) => {
          this.toastr.successMessage(response["Message"]);
          if(this.pageType == "return"){
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DETAIL],{ mouCustId: mouCustFormData.MouCustId, MOUType: this.mouType, mode : "return" });    
          }
          else{
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DETAIL],{ mouCustId: mouCustFormData.MouCustId, MOUType: this.mouType });    
          }
        });
    }
  }

  OpenView(key: string) {
    if (key == "mou") {
      AdInsHelper.OpenMOUCustViewByMouCustId(this.mouCustId);
    } else if (key == "cust") {
      AdInsHelper.OpenCustomerViewByCustId(this.custId);
    }
  }

  bindAllRefMasterObj(){
    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, {"RefMasterTypeCode": CommonConstant.RefMasterTypeCodePlafonType}).subscribe(
      (response) => {
        this.plafondTypeObj = response["RefMasterObjs"];

        if(this.plafondTypeObj.length > 0){
          var idxDefault = this.plafondTypeObj.findIndex(x => x.ReserveField2 == CommonConstant.DEFAULT);
          this.MOUMainInfoForm.patchValue({
            PlafondType: this.plafondTypeObj[idxDefault].MasterCode
          });
        }
      }
    );
  }

  checkStartDate(ev:any){ 
    if( this.datePipe.transform(ev.target.value, "yyyy-MM-dd") > this.datePipe.transform(this.businessDt, "yyyy-MM-dd") ){
       this.toastr.warningMessage(ExceptionConstant.START_DATE_CANNOT_MORE_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y'));
    } 
  }

  checkEndDate(ev:any){
    if(ev.target.value < this.datePipe.transform(this.businessDt, "yyyy-MM-dd") ){
       this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN +  this.datePipe.transform(this.businessDt, 'MMMM d, y'));
    }
  }
}
