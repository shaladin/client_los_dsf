import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, mergeMap } from 'rxjs/operators';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { formatDate } from '@angular/common';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CreateDoMultiAssetXComponent } from '../create-do-multi-asset-x/create-do-multi-asset-x.component';
import { AppObj } from 'app/shared/model/App/App.Model';
import { DeliveryOrderHObj } from 'app/shared/model/delivery-order-h-obj.model';
import { AssetListForDOMultiAssetObj } from 'app/shared/model/asset-list-for-do-multi-asset-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { ReqGetDOMultiAssetInformationObj } from 'app/shared/model/request/delivery-order/req-get-do-multi-asset-information-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { MouCustObj } from 'app/shared/model/mou-cust-obj.model';
import { ReqSubmitAgrmntTcObj } from 'app/shared/model/agrmnt-tc/req-submit-agrmnt-tc-obj.model';
import { environment } from 'environments/environment';
import { AgrmntTcObj } from 'app/shared/model/agrmnt-tc/agrmnt-tc-obj.model';

@Component({
  selector: 'app-delivery-order-multi-asset-detail-x',
  templateUrl: './delivery-order-multi-asset-detail-x.component.html',
  styles: []
})
export class DeliveryOrderMultiAssetDetailXComponent implements OnInit {
  appId: number;
  agrmntId: number;
  doList: Array<DeliveryOrderHObj>;
  doAssetList: Array<AssetListForDOMultiAssetObj>;
  custType: string;
  licensePlateAttr: string;
  isCreateDOInvalid: boolean;
  createDOInvalidMsg: string;
  arrValue: Array<number> = new Array();
  wfTaskListId: any;
  isFinal: boolean;
  isHideDP: boolean = true;

  DOAssetForm = this.fb.group({
    DOAssetList: this.fb.array([]),
    AgrmntCreatedDt: ['', Validators.required],
    EffectiveDt: ['', Validators.required],
    AddIntrstAmt: [0],
    GoLiveEstimated: ['']
  });

  AppTcForm = this.fb.group({});
  isDmsReady: boolean;
  dmsObj: DMSObj;
  agrNo: string;
  custNo: string;
  appNo: string;
  mouCustNo: string;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  bizTemplateCode: string = "";
  UserAccess: CurrentUserContext;
  minDt: Date = new Date();
  checkPOReady: boolean = false;
  PODt: Date = new Date();
  isHasPO: boolean = false;
  LobCode: string;

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private claimTaskService: ClaimTaskService,
    private http: HttpClient
  ) {
    this.doList = new Array();
    this.doAssetList = new Array();
    this.isFinal = false;
    this.route.queryParams.subscribe(params => {
      this.appId = params['AppId'];
      this.agrmntId = params['AgrmntId'];
      if (params['WfTaskListId'] != null) {
        this.wfTaskListId = params['WfTaskListId'];
      } else {
        this.wfTaskListId = params['TaskListId'];
      }
    });
  }

  async ngOnInit() {
    await this.http.post<AppObj>(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
      (response) => {
        this.LobCode = response.LobCode;
      }
    );

    this.arrValue.push(this.agrmntId);
    this.arrValue.push(this.appId);
    if (this.wfTaskListId != null || this.wfTaskListId != undefined) {
      this.claimTask();
    }
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.minDt = this.UserAccess.BusinessDt;
    this.DOAssetForm.patchValue({
      GoLiveEstimated: formatDate(this.UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US'),
    });
    this.http.post(URLConstant.GetAgrmntByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response: AgrmntObj) => {
        this.bizTemplateCode = response.BizTemplateCode;
        if (response["EffectiveDt"] == null) {
          this.DOAssetForm.patchValue({
            AgrmntCreatedDt: formatDate(response["AgrmntCreatedDt"], 'yyyy-MM-dd', 'en-US'),
          })
        } else {
          this.DOAssetForm.patchValue({
            AgrmntCreatedDt: formatDate(response["AgrmntCreatedDt"], 'yyyy-MM-dd', 'en-US'),
            EffectiveDt: formatDate(response["EffectiveDt"], 'yyyy-MM-dd', 'en-US'),
          })
        }
      }
    );
    this.http.post(URLConstant.GetPurchaseOrderHByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response) => {
        this.PODt = response["PurchaseOrderDt"];
        this.isHasPO = true;
        this.checkPOReady = true;
      }
    );
    let GetDoObj = new ReqGetDOMultiAssetInformationObj();
    GetDoObj.AppId = this.appId;
    GetDoObj.AgrmntId = this.agrmntId;
    let getDOAssetList = this.httpClient.post(URLConstant.GetAssetListForDOMultiAsset, { Id: this.agrmntId });
    let getDOList = this.httpClient.post(URLConstant.GetListDeliveryOrderHByAppIdAgrmntId, GetDoObj);
    let checkAllDO = this.httpClient.post(URLConstant.CheckAllDeliveryOrderData, { Id: this.agrmntId });
    // X DSF Non JIRA, Udin : Pisah "checkAllDO" dari forJoin() karena bikin issue data tidak muncul
    forkJoin([getDOAssetList, getDOList]).subscribe(
      (response) => {
        this.doAssetList = response[0]["AssetListForDOMultiAssetObj"];
        this.custType = response[0]["MrCustTypeCode"];
        this.licensePlateAttr = response[0]["LicensePlateAttr"];
        this.doList = response[1]["DeliveryOrderHObjs"];
        var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;
        let tempDt = this.UserAccess.BusinessDt;
        for (const item of this.doAssetList) {
          var formGroup = this.fb.group({
            AppAssetId: [item.AppAssetId],
            AssetSeqNo: [item.CollateralSeqNo],
            FullAssetName: [item.FullAssetName],
            AssetPriceAmt: [item.AssetPriceAmt],
            DownPaymentAmt: [item.DownPaymentAmt],
            SerialNo1: [item.SerialNo1],
            SerialNo2: [item.SerialNo2],
            SerialNo3: [item.SerialNo3],
            SerialNo4: [item.SerialNo4],
            SerialNo5: [item.SerialNo5],
            OwnerName: [item.OwnerName],
            DeliveryNo: [item.DeliveryNo],
            DeliveryDt: [item.DeliveryDt],
            IsAvailable: [item.IsAvailable],
            ManufacturingYear: [item.ManufacturingYear],
            TempLetterNo: [item.TempLetterNo],
            IsSelected: false
          });
          console.log("AAAAAAAAAA");
          if (item.DeliveryDt != null) {
            let devDt = new Date(formatDate(item.DeliveryDt, 'yyyy-MM-dd', 'en-US'))
            if (new Date(tempDt) < devDt) {
              this.minDt = devDt;
              if (new Date(this.DOAssetForm.controls.EffectiveDt.value) < devDt) {
                this.DOAssetForm.patchValue({
                  EffectiveDt: formatDate(item.DeliveryDt, 'yyyy-MM-dd', 'en-US')
                });
              }

            }
          }
          else {
            this.minDt = tempDt;
          }
          formArray.push(formGroup);
        }
      }
    );
    
    // START X DSF Non JIRA, Udin : Pisah "checkAllDO" dari forJoin() karena bikin issue data tidak muncul
    await checkAllDO.toPromise().then(
      (response) => {
        this.isFinal = response["IsFinal"];
      }
    );
    // END X DSF Non JIRA, Udin 

    await this.httpClient.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms }).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });
    await this.InitDms();
  }

  async InitDms() {
    if (this.SysConfigResultObj.ConfigValue == '1') {
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;

      var agrObj = { Id: this.agrmntId };
      var appObj = { Id: this.appId };

      let getAgr = await this.httpClient.post(URLConstant.GetAgrmntByAgrmntId, agrObj)
      let getAppCust = await this.httpClient.post(URLConstant.GetAppCustByAppId, appObj)
      let getApp = await this.httpClient.post(URLConstant.GetAppById, appObj)
      forkJoin([getAgr, getAppCust, getApp]).subscribe(
        (response) => {
          this.agrNo = response[0]['AgrmntNo'];
          this.custNo = response[1]['CustNo'];
          this.appNo = response[2]['AppNo'];
          let mouId = response[2]['MouCustId'];

          if (this.custNo != null && this.custNo != '') {
            this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.custNo));
          }
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, this.appNo));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));

          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
          if (mouId != null && mouId != "") {
            this.httpClient.post(URLConstant.GetMouCustById, { Id: mouId }).subscribe(
              (result: MouCustObj) => {
                this.mouCustNo = result.MouCustNo;
                this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.mouCustNo));
                this.isDmsReady = true;
              }
            )
          }
          else {
            this.isDmsReady = true;
          }
        }
      );
    }
  }

  showModalDO(formArray: FormArray, mode: string, deliveryOrderHId: number) {
    const modalCreateDO = this.modalService.open(CreateDoMultiAssetXComponent);
    modalCreateDO.componentInstance.SelectedDOAssetList = formArray.value;
    modalCreateDO.componentInstance.LicensePlateAttr = this.licensePlateAttr;
    modalCreateDO.componentInstance.CustType = this.custType;
    modalCreateDO.componentInstance.AppId = this.appId;
    modalCreateDO.componentInstance.AgrmntId = this.agrmntId;
    modalCreateDO.componentInstance.Mode = mode;
    modalCreateDO.componentInstance.DeliveryOrderHId = deliveryOrderHId;
    modalCreateDO.result.then(
      (response) => {
        this.spinner.show();
        let GetDoObj = new ReqGetDOMultiAssetInformationObj();
        GetDoObj.AppId = this.appId;
        GetDoObj.AgrmntId = this.agrmntId;
        let getDOAssetList = this.httpClient.post(URLConstant.GetAssetListForDOMultiAsset, { Id: this.agrmntId });
        let getDOList = this.httpClient.post(URLConstant.GetListDeliveryOrderHByAppIdAgrmntId, GetDoObj);
        let checkAllDO = this.httpClient.post(URLConstant.CheckAllDeliveryOrderData, { Id: this.agrmntId });
        forkJoin([getDOAssetList, getDOList, checkAllDO]).subscribe(
          (response) => {
            this.doAssetList = response[0]["AssetListForDOMultiAssetObj"];
            this.custType = response[0]["MrCustTypeCode"];
            this.licensePlateAttr = response[0]["LicensePlateAttr"];
            this.doList = response[1]["DeliveryOrderHObjs"];
            var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;

            while (formArray.length !== 0) {
              formArray.removeAt(0);
            }
            let tempDt = this.UserAccess.BusinessDt;
            for (const item of this.doAssetList) {
              var formGroup = this.fb.group({
                AppAssetId: [item.AppAssetId],
                AssetSeqNo: [item.AssetSeqNo],
                FullAssetName: [item.FullAssetName],
                AssetPriceAmt: [item.AssetPriceAmt],
                DownPaymentAmt: [item.DownPaymentAmt],
                SerialNo1: [item.SerialNo1],
                SerialNo2: [item.SerialNo2],
                SerialNo3: [item.SerialNo3],
                SerialNo4: [item.SerialNo4],
                SerialNo5: [item.SerialNo5],
                OwnerName: [item.OwnerName],
                DeliveryNo: [item.DeliveryNo],
                DeliveryDt: [item.DeliveryDt],
                IsAvailable: [item.IsAvailable],
                ManufacturingYear: [item.ManufacturingYear],
                IsSelected: false
              });
              console.log("AAAAAAAAAA");
              if (item.DeliveryDt != null) {
                let devDt = new Date(formatDate(item.DeliveryDt, 'yyyy-MM-dd', 'en-US'))
                if (new Date(tempDt) < devDt) {
                  this.minDt = devDt;
                  if (new Date(this.DOAssetForm.controls.EffectiveDt.value) < devDt) {
                    this.DOAssetForm.patchValue({
                      EffectiveDt: formatDate(item.DeliveryDt, 'yyyy-MM-dd', 'en-US')
                    });
                  }
                }
              }
              else {
                this.minDt = tempDt;
              }
              formArray.push(formGroup);
            }
            this.isFinal = response[2]["IsFinal"];
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    ).catch((error) => {
    });
  }

  editDOHandler(deliveryOrderHId) {
    var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;
    this.showModalDO(formArray, "edit", deliveryOrderHId);
  }

  createDOHandler() {
    var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;
    var formArraySelected : FormArray = new FormArray([]);

    for (var i = 0; i < formArray.length; i++) {
      if (formArray.at(i).get("IsSelected").value == true) {
        formArraySelected.push(formArray.at(i));
      }
    }

    this.isCreateDOInvalid = formArraySelected.length == 0;

    if (this.isCreateDOInvalid) {
      this.createDOInvalidMsg = "At Least 1 Asset Must Be Selected";
      return false;
    }
    else {
      this.showModalDO(formArraySelected, "add", 0);
    }
  }

  deleteDO(deliveryOrderHId) {
    var confirmation = confirm("Are you sure to delete this data ?");
    if (confirmation == true) {
      this.spinner.show();
      var requestObj = { Id: deliveryOrderHId }
      this.httpClient.post(URLConstant.DeleteDeliveryOrderMultiAsset, requestObj).pipe(
        map((response) => {
          return response;
        }),
        mergeMap((response) => {
          let GetDoObj = new ReqGetDOMultiAssetInformationObj();
          GetDoObj.AppId = this.appId;
          GetDoObj.AgrmntId = this.agrmntId;
          let getDOAssetList = this.httpClient.post(URLConstant.GetAssetListForDOMultiAsset, { Id: this.agrmntId });
          let getDOList = this.httpClient.post(URLConstant.GetListDeliveryOrderHByAppIdAgrmntId, GetDoObj);
          let checkAllDO = this.httpClient.post(URLConstant.CheckAllDeliveryOrderData, { Id: this.agrmntId });
          var tempResponse = [response];
          return forkJoin([getDOAssetList, getDOList, tempResponse, checkAllDO]);
        })
      ).subscribe(
        (response) => {
          var deleteResponse = response[2];
          this.doAssetList = response[0]["AssetListForDOMultiAssetObj"];
          this.custType = response[0]["MrCustTypeCode"];
          this.licensePlateAttr = response[0]["LicensePlateAttr"];
          this.doList = response[1]["DeliveryOrderHObjs"];
          var formArray = this.DOAssetForm.get('DOAssetList') as FormArray;

          while (formArray.length !== 0) {
            formArray.removeAt(0);
          }
          let tempDt = this.UserAccess.BusinessDt;
          for (const item of this.doAssetList) {
            var formGroup = this.fb.group({
              AppAssetId: [item.AppAssetId],
              AssetSeqNo: [item.AssetSeqNo],
              FullAssetName: [item.FullAssetName],
              AssetPriceAmt: [item.AssetPriceAmt],
              DownPaymentAmt: [item.DownPaymentAmt],
              SerialNo1: [item.SerialNo1],
              SerialNo2: [item.SerialNo2],
              SerialNo3: [item.SerialNo3],
              SerialNo4: [item.SerialNo4],
              SerialNo5: [item.SerialNo5],
              OwnerName: [item.OwnerName],
              DeliveryNo: [item.DeliveryNo],
              DeliveryDt: [item.DeliveryDt],
              IsAvailable: [item.IsAvailable],
              ManufacturingYear: [item.ManufacturingYear],
              TempLetterNo: [item.TempLetterNo],
              IsSelected: false
            });
            console.log("AAAAAAAAAA");
            if (item.DeliveryDt != null) {
              let devDt = new Date(formatDate(item.DeliveryDt, 'yyyy-MM-dd', 'en-US'))
              if (new Date(tempDt) < devDt) {
                this.minDt = devDt;
                if (new Date(this.DOAssetForm.controls.EffectiveDt.value) < devDt) {
                  this.DOAssetForm.patchValue({
                    EffectiveDt: formatDate(item.DeliveryDt, 'yyyy-MM-dd', 'en-US')
                  });
                }
              }
            }
            else {
              this.minDt = tempDt;
            }
            formArray.push(formGroup);
          }
          this.isFinal = response[3]["IsFinal"];

          this.spinner.hide();
          this.toastr.successMessage(deleteResponse["Message"]);
        });
    }
  }

  Back() {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_DO_MULTI_ASSET_PAGING], { BizTemplateCode: this.bizTemplateCode });
  }

  SaveForm() {
    if (this.doList.length > 0) {
      var reqSubmitAgrmntTcObj = new ReqSubmitAgrmntTcObj();
      reqSubmitAgrmntTcObj.AgrmntId = this.agrmntId;
      reqSubmitAgrmntTcObj.ListAgrmntTcObj = this.SetTcForm();
      var agrmntObj = {
        AgrmntId: this.agrmntId,
        AgrmntCreatedDt: this.DOAssetForm.controls.AgrmntCreatedDt.value,
        EffectiveDt: this.DOAssetForm.controls.EffectiveDt.value,
      };
      let editTc = this.httpClient.post(URLConstant.SubmitAgrmntTc, reqSubmitAgrmntTcObj);
      let updateAgrmntDt = this.httpClient.post(URLConstantX.UpdateEffectiveAndAgrmntCreatedDtX, agrmntObj);
      forkJoin([editTc, updateAgrmntDt]).subscribe(
        (response) => {
          this.toastr.successMessage(response[1]["Message"]);
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_DO_MULTI_ASSET_PAGING], { "BizTemplateCode": this.bizTemplateCode });
        }
      );
    }
    else {
      this.toastr.warningMessage(ExceptionConstant.ONE_DELIVERY_ORDER_NEEDED_TO_SAVE);
    }
  }

  DOSubmitHandler() {
    if (!this.DOAssetForm.valid) {
      return;
    }

    if (!this.isFinal) {
      this.toastr.warningMessage(ExceptionConstant.ALL_ASSET_MUST_PROCESSED_TO_SUBMIT);
    }
    else {
        var reqSubmitAgrmntTcObj = new ReqSubmitAgrmntTcObj();
        reqSubmitAgrmntTcObj.AgrmntId = this.agrmntId;
        reqSubmitAgrmntTcObj.ListAgrmntTcObj = this.SetTcForm();
        var agrmntObj = {
          AgrmntId: this.agrmntId,
          AgrmntCreatedDt: this.DOAssetForm.controls.AgrmntCreatedDt.value,
          EffectiveDt: this.DOAssetForm.controls.EffectiveDt.value,
        };
        let editTc = this.httpClient.post(URLConstant.SubmitAgrmntTc, reqSubmitAgrmntTcObj);
        var submitDO = null;
        if (environment.isCore) {
          submitDO = this.httpClient.post(URLConstant.SubmitDeliveryOrderMultiAssetV2, { TaskListId: this.wfTaskListId, AgrmntId: this.agrmntId });
        }
        else {
          submitDO = this.httpClient.post(URLConstant.SubmitDeliveryOrderMultiAsset, { TaskListId: this.wfTaskListId, AgrmntId: this.agrmntId });
        }
        let updateAgrmntDt = this.httpClient.post(URLConstantX.UpdateEffectiveAndAgrmntCreatedDtX, agrmntObj);
        forkJoin([editTc, submitDO, updateAgrmntDt]).subscribe(
          (response) => {
            this.toastr.successMessage(response[1]["Message"]);
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_DO_MULTI_ASSET_PAGING], { "BizTemplateCode": this.bizTemplateCode });
          }
        );
    }
  }

  calculateAddInterest() {
    let diffDays = 0;
    const diffTimes = new Date(this.DOAssetForm.controls.EffectiveDt.value).getTime() - new Date(this.DOAssetForm.controls.GoLiveEstimated.value).getTime();
    if (diffTimes > 0) {
      diffDays = diffTimes / (1000 * 3600 * 24)
      console.log(diffDays);

      this.http.post(URLConstantX.CalculateAdditionalInterestX, { AgrmntId: this.agrmntId, DiffDays: diffDays }).subscribe(
        (response) => {
          this.DOAssetForm.patchValue({
            AddIntrstAmt: response["Result"]
          });
        }
      );
    }
    else {
      this.DOAssetForm.patchValue({
        AddIntrstAmt: 0
      });
    }
  }

  claimTask() {
    if (environment.isCore) {
      if (this.wfTaskListId != "" && this.wfTaskListId != undefined) {
        this.claimTaskService.ClaimTaskV2(this.wfTaskListId);
      }
    }
    else if (this.wfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.wfTaskListId);
    }
  }

  SetTcForm(): Array<AgrmntTcObj>{
    let businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    let listAgrmntTcObj: Array<AgrmntTcObj> = new Array<AgrmntTcObj>();
    for (var i = 0; i < this.AppTcForm.value.TCList["length"]; i++) {
      const tempAgrmntTc = this.AppTcForm.getRawValue().TCList[i];
      let agrmntTc = new AgrmntTcObj();
      agrmntTc.AgrmntId = tempAgrmntTc.AgrmntId;
      agrmntTc.AgrmntTcId = tempAgrmntTc.AgrmntTcId;
      agrmntTc.TcCode = tempAgrmntTc.TcCode;
      agrmntTc.TcName = tempAgrmntTc.TcName;
      agrmntTc.PriorTo = tempAgrmntTc.PriorTo;
      agrmntTc.IsChecked = tempAgrmntTc.IsChecked;
      agrmntTc.ExpiredDt = tempAgrmntTc.ExpiredDt;
      agrmntTc.IsMandatory = tempAgrmntTc.IsMandatory;
      agrmntTc.PromisedDt = tempAgrmntTc.PromisedDt;
      agrmntTc.CheckedDt = tempAgrmntTc.CheckedDt;
      agrmntTc.IsWaived = tempAgrmntTc.IsWaived;
      agrmntTc.IsExpDtMandatory = tempAgrmntTc.IsExpDtMandatory;
      agrmntTc.IsWaivable = tempAgrmntTc.IsWaivable;
      agrmntTc.Notes = tempAgrmntTc.Notes;
      agrmntTc.IsAdditional = tempAgrmntTc.IsAdditional;

      var prmsDt = new Date(agrmntTc.PromisedDt);
      var prmsDtForm = tempAgrmntTc.PromisedDt;
      if (agrmntTc.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + agrmntTc.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      listAgrmntTcObj.push(agrmntTc);
    }

    return listAgrmntTcObj;
  }
}
