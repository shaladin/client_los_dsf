import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { environment } from 'environments/environment';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { RefOfficeObj } from 'app/shared/model/ref-office-obj.model';
import { CustObj } from 'app/shared/model/cust-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { UcDropdownListCallbackObj, UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { ReqMouCustObjX } from 'app/impl/shared/model/mou-cust-obj-x.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { ReqMouCustDsfObj } from 'app/shared/model/mou-cust-dsf-obj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';

@Component({
  selector: 'app-mou-customer-request-detail-x-dsf',
  templateUrl: './mou-customer-request-detail-x-dsf.component.html',
  providers: [NGXToastrService]
})
export class MouCustomerRequestDetailXDsfComponent implements OnInit {
  mouType: string;
  WfTaskListId: any;
  inputLookupCust: InputLookupObj;
  pageType: string = "add";
  mouCustId: number;
  refOfficeId: number;
  businessDt: Date;
  businessDtForEndDt: Date;
  mouCustUrl: string;
  custId: number;
  custUrl: string;
  RevolvingTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CustNoObj: GenericObj = new GenericObj();
  plafondTypeObj: Array<RefMasterObj>;
  datePipe = new DatePipe("en-US");
  dropdownListObj: UcDropdownListObj = new UcDropdownListObj();
  user: CurrentUserContext;
  returnRefOffices: Array<KeyValueObj> = new Array<KeyValueObj>();
  MrMouCustFctrTypeList: Array<KeyValueObj> = [];
  ReqMouCustDsfObj: ReqMouCustDsfObj = new ReqMouCustDsfObj();

  MOUMainInfoForm = this.fb.group({
    MouCustId: [0, [Validators.required]],
    MouCustNo: [''],
    StartDt: ['', [Validators.required]],
    EndDt: ['', [Validators.required]],
    RefNo: [''],
    MrMouCustFctrType: [''],
    IsRevolving: [false],
    PlafondAmt: [0, [Validators.required, Validators.min(1.00)]],
    MouStat: ['NEW', [Validators.required]],
    MrMouTypeCode: ['', [Validators.required]],
    RowVersion: [''],
    MrRevolvingTypeCode: [''],
    PlafondType:[''],
    OriOfficeCode: ['', [Validators.required]],
    OriOfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    IsFreeze: [''],
    // CR Change Self Custom
    IsNetworth: [false],
    IsNewCalculation: [false]
    // CR Change Self Custom
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private http: HttpClient,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService,
    private AdInsHelperService: AdInsHelperService
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
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
    });
  }

  // CR Change Self Custom
  async ngOnInit() {
    if (this.pageType == "edit" || this.pageType == "return")
    {
    await this.httpClient.post<ReqMouCustDsfObj>(URLConstantDsf.GetMouCustXDsf, { Id: this.mouCustId }).toPromise().then(
      (response) => {
        this.ReqMouCustDsfObj = response;
        this.MOUMainInfoForm.patchValue({
          IsNewCalculation: this.ReqMouCustDsfObj.IsNewCalculation
        });
      }
    )
    }
  // CR Change Self Custom

    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    await this.initLookupObj();
    
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

    if (this.mouType == CommonConstant.FACTORING) {
      this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstantX.RefMasterTypeCodeMouFctrType }).subscribe(
        (response) => {
          this.MrMouCustFctrTypeList = response[CommonConstant.ReturnObj];
        });
    }


    if (this.WfTaskListId > 0) {
      this.claimTask();
    }

    this.GetMouTypeDesc();
    var datePipe = new DatePipe("en-US");
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (currentUserContext != null && currentUserContext != undefined) {
      this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.businessDtForEndDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.businessDt.setDate(this.businessDtForEndDt.getDate() - 1)
      this.businessDtForEndDt.setDate(this.businessDtForEndDt.getDate())
    }

    this.inputLookupCust = new InputLookupObj();
    this.inputLookupCust.urlJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";
    this.inputLookupCust.pagingJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";
    this.inputLookupCust.genericJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";

    var refOffice = new RefOfficeObj();
    refOffice.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.httpClient.post(URLConstant.GetRefOfficeByOfficeCode, { Code: refOffice.OfficeCode }).subscribe(
      (response: RefOfficeObj) => {
        this.refOfficeId = response.RefOfficeId;
      });

    if (this.pageType == "edit" || this.pageType == "return") {
      this.httpClient.post(URLConstant.GetMouCustById, { Id: this.mouCustId }).subscribe(
        async (response) => {
          response['StartDt'] = datePipe.transform(response['StartDt'], 'yyyy-MM-dd');
          response['EndDt'] = datePipe.transform(response['EndDt'], 'yyyy-MM-dd');
          this.MOUMainInfoForm.patchValue({
            ...response
          });
          if (response['MrMouTypeCode'] == CommonConstant.FACTORING) {
            await this.httpClient.post(URLConstantX.GetMouCustFctrXByMouCustNoX, { CustNo: response['MouCustNo'] }).toPromise().then(
              (ress) => {
                this.MOUMainInfoForm.patchValue({
                  MrMouCustFctrType: ress['MrMouCustFctrType']
                });
                this.MOUMainInfoForm.controls.MrMouCustFctrType.disable();
              });
          }

          this.CustNoObj.CustNo = response['CustNo'];
          this.httpClient.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
            (response: CustObj) => {
              this.custId = response.CustId;
            });

          if (response["MrRevolvingTypeCode"] == null) {
            this.MOUMainInfoForm.controls.MrRevolvingTypeCode.setValue(this.RevolvingTypeList[0].Key);
          }

          if (response["PlafondType"] != null) {
            this.MOUMainInfoForm.controls.PlafondType.setValue(response['PlafondType']);
          }
          this.onChangePlafondType();
        });
    } else {
      this.MOUMainInfoForm.patchValue({
        MrMouTypeCode: this.mouType
      });
    }
  }

  mouTypeDesc: string = "";

  GetMouTypeDesc() {
    var obj: ReqRefMasterByTypeCodeAndMasterCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMouType,
      MasterCode: this.mouType
    };
    this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, obj).subscribe(
      (response: RefMasterObj) => {
        this.mouTypeDesc = response.Descr;
      });
  }

  onChangePlafondType() {
    if (this.MOUMainInfoForm.value.PlafondType == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOCLLTR) {
      this.MOUMainInfoForm.controls.PlafondAmt.clearValidators();
    }

    if (this.MOUMainInfoForm.value.PlafondType == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOAMT) {
      this.MOUMainInfoForm.controls.PlafondAmt.setValidators([Validators.required, Validators.min(1.00)]);
    }

    this.MOUMainInfoForm.controls.PlafondAmt.updateValueAndValidity();
  }

  Back(): void {
    if(this.pageType == "return"){
      AdInsHelper.RedirectUrl(this.router,[NavigationConstantDsf.MOU_EDIT_CUST_PAGING_DSF],{MrMouTypeCode : this.mouType});
    }else{
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_REQ_PAGING_X_DSF],{MrMouTypeCode : this.mouType});
    }
  }

  // CR Change Self Custom
  async Save() {
  // CR Change Self Custom
    if( this.MOUMainInfoForm.controls.StartDt.value > this.datePipe.transform(this.businessDt, "yyyy-MM-dd") ){
      this.toastr.warningMessage(ExceptionConstant.START_DATE_CANNOT_MORE_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y') );
     return
   }
   if(this.MOUMainInfoForm.controls.EndDt.value <= this.datePipe.transform(this.businessDt, "yyyy-MM-dd") ){
     this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN +  this.datePipe.transform(this.businessDt, 'MMMM d, y')  );
    return;
   }

    let reqMouCustObj: ReqMouCustObjX = new ReqMouCustObjX();
    reqMouCustObj.OriOfficeCode = this.MOUMainInfoForm.getRawValue().OriOfficeCode;
    reqMouCustObj.OriOfficeName = this.returnRefOffices.filter(x => x.Key == this.MOUMainInfoForm.getRawValue().OriOfficeCode).map(x => x.Value).toString();
    reqMouCustObj.CrtOfficeCode = this.MOUMainInfoForm.getRawValue().CrtOfficeCode;
    reqMouCustObj.CrtOfficeName = this.MOUMainInfoForm.getRawValue().CrtOfficeName;
    reqMouCustObj.StartDt = this.MOUMainInfoForm.getRawValue().StartDt;
    reqMouCustObj.EndDt = this.MOUMainInfoForm.getRawValue().EndDt;
    reqMouCustObj.RefNo = this.MOUMainInfoForm.getRawValue().RefNo;
    reqMouCustObj.IsRevolving = this.MOUMainInfoForm.getRawValue().IsRevolving;
    reqMouCustObj.PlafondAmt = this.MOUMainInfoForm.getRawValue().PlafondAmt;
    reqMouCustObj.MouStat = this.MOUMainInfoForm.getRawValue().MouStat;
    reqMouCustObj.MrMouTypeCode = this.MOUMainInfoForm.getRawValue().MrMouTypeCode;
    reqMouCustObj.PlafondType = this.MOUMainInfoForm.getRawValue().PlafondType;
    reqMouCustObj.RowVersion = this.MOUMainInfoForm.getRawValue().RowVersion;
    reqMouCustObj.MrMouCustFctrType = this.MOUMainInfoForm.getRawValue().MrMouCustFctrType;
    
    if (!this.MOUMainInfoForm.controls.IsRevolving.value) {
      reqMouCustObj.MrRevolvingTypeCode = null;
    }
    else{
      reqMouCustObj.MrRevolvingTypeCode = this.MOUMainInfoForm.getRawValue().MrRevolvingTypeCode;
    }
    if (this.pageType == "add") {
      let AddMouCustUrl = environment.isCore ? URLConstantX.AddMouCustV2X : URLConstantX.AddMouCustX;
      await this.httpClient.post(AddMouCustUrl, reqMouCustObj).toPromise().then(
        (response: GenericObj) => {
          this.toastr.successMessage(response["Message"]);
          var mouCustId = response.Id;
          // CR Change Self Custom
          let reqMouCustDsfObj: ReqMouCustDsfObj = new ReqMouCustDsfObj();
          reqMouCustDsfObj.MouCustId = mouCustId;
          reqMouCustDsfObj.IsNewCalculation = this.MOUMainInfoForm.getRawValue().IsNewCalculation;
          this.httpClient.post(URLConstantDsf.AddMouCustXDsf, reqMouCustDsfObj).subscribe(
            (response: GenericObj) => {
              AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DETAIL_X_DSF],{ mouCustId: mouCustId, MOUType: this.mouType });
            }
          )
          // CR Change Self Custom
        });
    }
    else if (this.pageType == "edit" || this.pageType == "return") {
      // CR Change Self Custom
      let reqMouCustDsfObj: ReqMouCustDsfObj = new ReqMouCustDsfObj();
      reqMouCustDsfObj.MouCustId = this.mouCustId;
      reqMouCustDsfObj.IsNewCalculation = this.MOUMainInfoForm.getRawValue().IsNewCalculation;
      await this.httpClient.post(URLConstantDsf.EditMouCustNewCalculationXDsf, reqMouCustDsfObj).toPromise().then(
        (response: GenericObj) => {
        }
      )
      // CR Change Self Custom
      reqMouCustObj.MouCustId = this.MOUMainInfoForm.getRawValue().MouCustId;
      reqMouCustObj.MouCustNo = this.MOUMainInfoForm.getRawValue().MouCustNo;
      reqMouCustObj.IsFreeze = this.MOUMainInfoForm.getRawValue().IsFreeze;
      this.httpClient.post(URLConstant.EditMouCust, reqMouCustObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          if(this.pageType == "return"){
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DETAIL_X_DSF],{ mouCustId: this.MOUMainInfoForm.getRawValue().MouCustId, MOUType: this.mouType, mode : "return" });
          }
          else{
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_DETAIL_X_DSF],{ mouCustId: this.MOUMainInfoForm.getRawValue().MouCustId, MOUType: this.mouType });
          }
        });
    }
  }

  async initLookupObj(){
    this.dropdownListObj.apiUrl = URLConstant.GetListKvpActiveRefOfficeForPaging;
    this.dropdownListObj.requestObj = {};
    this.dropdownListObj.isSelectOutput = true;

    await this.http.post(URLConstant.GetListKvpActiveRefOfficeForPaging, {}).toPromise().then(
      (response) => {
        this.returnRefOffices = response[CommonConstant.ReturnObj];
        this.MOUMainInfoForm.patchValue(
          {
            OriOfficeCode: this.returnRefOffices[0].Key
          }
        )

        if (this.user.MrOfficeTypeCode == CommonConstant.CENTER_GROUP_CODE && this.pageType == "add") {
          this.MOUMainInfoForm.patchValue({
            CrtOfficeCode: this.user.OfficeCode,
            CrtOfficeName: this.user.OfficeName,
          });
        }
        else if(this.user.MrOfficeTypeCode == CommonConstant.HeadOffice && this.pageType == "add"){
          this.MOUMainInfoForm.patchValue({
            OriOfficeCode: this.user.OfficeCode,
            OriOfficeName: this.user.OfficeName,
            CrtOfficeCode: this.user.OfficeCode,
            CrtOfficeName: this.user.OfficeName,
          });
        }
        else {
          this.MOUMainInfoForm.controls.OriOfficeCode.disable();
          this.MOUMainInfoForm.patchValue({
            OriOfficeCode: this.user.OfficeCode,
            OriOfficeName: this.user.OfficeName,
            CrtOfficeCode: this.user.OfficeCode,
            CrtOfficeName: this.user.OfficeName,
          });
        }
      }
    );
  }

  OpenView(key: string) {
    if (key == "mou") {
      AdInsHelper.OpenMOUCustViewByMouCustId(this.mouCustId);
    } else if (key == "cust") {
      this.AdInsHelperService.OpenCustomerViewByCustId(this.custId);
    }
  }

  bindAllRefMasterObj(){
    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodePlafonType}).subscribe(
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

  checkStartDate(ev){
    if( this.datePipe.transform(ev.target.value, "yyyy-MM-dd") > this.datePipe.transform(this.businessDt, "yyyy-MM-dd") ){
       this.toastr.warningMessage(ExceptionConstant.START_DATE_CANNOT_MORE_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y'));
    }
  }

  checkEndDate(ev){
    if(this.datePipe.transform(ev.target.value, "yyyy-MM-dd") < this.datePipe.transform(this.businessDt, "yyyy-MM-dd") ){
       this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN +  this.datePipe.transform(this.businessDt, 'MMMM d, y'));
    }
  }

  claimTask() {
    if (environment.isCore) {
      if (this.WfTaskListId != "" && this.WfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    }
    else if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
  }
}
