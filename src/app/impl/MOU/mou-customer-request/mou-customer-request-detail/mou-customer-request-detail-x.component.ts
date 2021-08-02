import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, Validators} from '@angular/forms';
import {Location, DatePipe} from '@angular/common';
import {InputLookupObj} from 'app/shared/model/InputLookupObj.Model';
import {MouCustObj} from 'app/shared/model/MouCustObj.Model';
import {RefOfficeObj} from 'app/shared/model/RefOfficeObj.model';
import {NGXToastrService} from 'app/components/extra/toastr/toastr.service';
import {AdInsHelper} from 'app/shared/AdInsHelper';
import {CookieService} from 'ngx-cookie';
import {URLConstant} from 'app/shared/constant/URLConstant';
import {CommonConstant} from 'app/shared/constant/CommonConstant';
import {KeyValueObj} from 'app/shared/model/KeyValue/KeyValueObj.model';
import {NavigationConstant} from 'app/shared/constant/NavigationConstant';
import {GenericObj} from 'app/shared/model/Generic/GenericObj.model';
import {ClaimTaskService} from 'app/shared/claimTask.service';
import {ExceptionConstant} from 'app/shared/constant/ExceptionConstant';
import {RefMasterObj} from 'app/shared/model/RefMasterObj.Model';
import {CustObj} from 'app/shared/model/CustObj.Model';
import {ReqRefMasterByTypeCodeAndMasterCodeObj} from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMasterCodeObj.Model';
import {CommonConstantX} from 'app/impl/shared/constant/CommonConstantX';
import {URLConstantX} from '../../../shared/constant/URLConstantX';

@Component({
  selector: 'app-mou-customer-request-detail-x',
  templateUrl: './mou-customer-request-detail-x.component.html',
  providers: [NGXToastrService]
})
export class MouCustomerRequestDetailXComponent implements OnInit {
  mouType: string;
  WfTaskListId: number;
  inputLookupCust: InputLookupObj;
  pageType: string = 'add';
  mouCustId: number;
  refOfficeId: number;
  businessDt: Date;
  mouCustUrl: string;
  custId: number;
  custUrl: string;
  RevolvingTypeList: Array<KeyValueObj> = new Array<KeyValueObj>();
  CustNoObj: GenericObj = new GenericObj();
  plafondTypeObj: Array<RefMasterObj>;
  datePipe = new DatePipe('en-US');
  MrMouCustFctrTypeList: Array<KeyValueObj> = [];

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
    PlafondType: ['']
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
    private claimTaskService: ClaimTaskService
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

  ngOnInit() {
    this.bindAllRefMasterObj();
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstant.MOU_REVOLVING_TYPE}).subscribe(
      (response) => {
        this.RevolvingTypeList = response[CommonConstant.ReturnObj];
        if (this.pageType != 'edit') {
          this.MOUMainInfoForm.patchValue({
            MrRevolvingTypeCode: this.RevolvingTypeList[0].Key
          });
        }
      });

    if(this.mouType == CommonConstant.FACTORING){
      this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, {RefMasterTypeCode: CommonConstantX.RefMasterTypeCodeMouFctrType}).subscribe(
        (response) => {
          this.MrMouCustFctrTypeList = response[CommonConstant.ReturnObj];
          // if (this.pageType != 'edit') {
          //   this.MOUMainInfoForm.patchValue({
          //     MrRevolvingTypeCode: this.RevolvingTypeList[0].Key
          //   });
          // }
        });
    }


    if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }

    this.GetMouTypeDesc();
    var datePipe = new DatePipe('en-US');
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (currentUserContext != null && currentUserContext != undefined) {
      this.businessDt = new Date(currentUserContext[CommonConstant.BUSINESS_DT]);
      this.businessDt.setDate(this.businessDt.getDate() - 1);
    }

    this.inputLookupCust = new InputLookupObj();
    this.inputLookupCust.urlJson = './assets/uclookup/MOU/lookupCust_MOURequest.json';
    this.inputLookupCust.pagingJson = './assets/uclookup/MOU/lookupCust_MOURequest.json';
    this.inputLookupCust.genericJson = './assets/uclookup/MOU/lookupCust_MOURequest.json';

    var refOffice = new RefOfficeObj();
    refOffice.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.httpClient.post(URLConstant.GetRefOfficeByOfficeCode, {Code: refOffice.OfficeCode}).subscribe(
      (response: RefOfficeObj) => {
        this.refOfficeId = response.RefOfficeId;
      });

    if (this.pageType == 'edit' || this.pageType == 'return') {
      this.httpClient.post(URLConstant.GetMouCustById, {Id: this.mouCustId}).subscribe(
        async (response) => {
          response['StartDt'] = datePipe.transform(response['StartDt'], 'yyyy-MM-dd');
          response['EndDt'] = datePipe.transform(response['EndDt'], 'yyyy-MM-dd');
          this.MOUMainInfoForm.patchValue({
            ...response
          });
          if (response['MrMouTypeCode'] == CommonConstant.FACTORING) {
            await this.httpClient.post(URLConstantX.GetMouCustFctrXByMouCustNoX, {CustNo : response['MouCustNo']}).toPromise().then(
              (ress) => {
                this.MOUMainInfoForm.patchValue({
                  MrMouCustFctrType : ress['MrMouCustFctrType']
                });
                this.MOUMainInfoForm.controls.MrMouCustFctrType.disable();
              });
          }

          this.CustNoObj.CustNo = response['CustNo'];
          this.httpClient.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
            (response: CustObj) => {
              this.custId = response.CustId;
            });

          if (response['MrRevolvingTypeCode'] == null) {
            this.MOUMainInfoForm.controls.MrRevolvingTypeCode.setValue(this.RevolvingTypeList[0].Key);
          }

          if (response['PlafondType'] != null) {
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

  mouTypeDesc: string = '';

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
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_REQ_PAGING], {});
  }

  Save() {
    if (this.MOUMainInfoForm.controls.StartDt.value > this.datePipe.transform(this.businessDt, 'yyyy-MM-dd')) {
      this.toastr.warningMessage(ExceptionConstant.START_DATE_CANNOT_MORE_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y'));
      return
    }
    if (this.MOUMainInfoForm.controls.EndDt.value < this.datePipe.transform(this.businessDt, 'yyyy-MM-dd')) {
      this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y'));
      return;
    }
    var mouCustFormData = this.MOUMainInfoForm.value;
    if (!this.MOUMainInfoForm.controls.IsRevolving.value) {
      mouCustFormData['MrRevolvingTypeCode'] = null;
    }

    if (this.pageType == 'add') {
      this.httpClient.post(URLConstantX.AddMouCustX, mouCustFormData).subscribe(
        (response: GenericObj) => {
          this.toastr.successMessage(response['Message']);
          var mouCustId = response.Id;
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_DETAIL], {mouCustId: mouCustId, MOUType: this.mouType});
        });
    } else if (this.pageType == 'edit' || this.pageType == 'return') {
      this.httpClient.post(URLConstant.EditMouCust, mouCustFormData).subscribe(
        (response) => {
          this.toastr.successMessage(response['Message']);
          if (this.pageType == 'return') {
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_DETAIL], {
              mouCustId: mouCustFormData.MouCustId,
              MOUType: this.mouType,
              mode: 'return'
            });
          } else {
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_DETAIL], {
              mouCustId: mouCustFormData.MouCustId,
              MOUType: this.mouType
            });
          }
        });
    }
  }

  OpenView(key: string) {
    if (key == 'mou') {
      AdInsHelper.OpenMOUCustViewByMouCustId(this.mouCustId);
    } else if (key == 'cust') {
      AdInsHelper.OpenCustomerViewByCustId(this.custId);
    }
  }

  bindAllRefMasterObj() {
    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, {Code: CommonConstant.RefMasterTypeCodePlafonType}).subscribe(
      (response) => {
        this.plafondTypeObj = response['RefMasterObjs'];

        if (this.plafondTypeObj.length > 0) {
          var idxDefault = this.plafondTypeObj.findIndex(x => x.ReserveField2 == CommonConstant.DEFAULT);
          this.MOUMainInfoForm.patchValue({
            PlafondType: this.plafondTypeObj[idxDefault].MasterCode
          });
        }
      }
    );
  }

  checkStartDate(ev) {
    if (this.datePipe.transform(ev.target.value, 'yyyy-MM-dd') > this.datePipe.transform(this.businessDt, 'yyyy-MM-dd')) {
      this.toastr.warningMessage(ExceptionConstant.START_DATE_CANNOT_MORE_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y'));
    }
  }

  checkEndDate(ev) {
    if (ev.target.value < this.datePipe.transform(this.businessDt, 'yyyy-MM-dd')) {
      this.toastr.warningMessage(ExceptionConstant.END_DATE_CANNOT_LESS_THAN + this.datePipe.transform(this.businessDt, 'MMMM d, y'));
    }
  }
}
