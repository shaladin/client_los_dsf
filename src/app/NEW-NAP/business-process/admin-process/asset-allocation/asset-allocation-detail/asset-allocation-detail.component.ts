import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DeliveryOrderObj } from 'app/shared/model/DeliveryOrderObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { ListAppCollateralDocObj } from 'app/shared/model/ListAppCollateralDocObj.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from '../../../../../../environments/environment';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-asset-allocation-detail',
  templateUrl: './asset-allocation-detail.component.html'
})

export class AssetAllocationDetailComponent implements OnInit {
  appAssetObj: any;
  TaskListId: any;
  AppAssetId: number;
  AppId: number;
  InputLookupAssetNumberObj: any;
  InputLookupAssetNumberObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  ListUsedAssetNumber: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  requisitionList: any;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.TaskListId = params['TaskListId'];
    });
  }

  AssetAllocationForm = this.fb.group({
    IsCheckedAll: [false],
    ListAsset: this.fb.array([])
  })

  async ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;

    this.claimTask();
    this.getAssetAllocationData();
  }

  SaveForm() {
    var listAsset = new Array();
    for (let i = 0; i < this.AssetAllocationForm.controls["ListAsset"].value.length; i++) {
      var tempAsset = this.AssetAllocationForm.controls["ListAsset"].value.filter(
        asset => asset.AssetNo == this.AssetAllocationForm.controls["ListAsset"].value[i].AssetNo
      );
      if (tempAsset.length > 1) {
        this.toastr.warningMessage("Asset Number cant duplicate");
        return;
      }

      var newAssetAlloc = {
        AssetNo: this.AssetAllocationForm.controls["ListAsset"].value[i].AssetNo,
        SerialNo1: this.AssetAllocationForm.controls["ListAsset"].value[i].ChassisNo,
        SerialNo2: this.AssetAllocationForm.controls["ListAsset"].value[i].EngineNo,
        SerialNo3: this.AssetAllocationForm.controls["ListAsset"].value[i].LicensePlateNo
      };
      listAsset.push(newAssetAlloc);
    }
    var reqObj = {
      AppAssetObjs : listAsset
    }
    this.http.post(URLConstant.SubmitAssetAllocation, reqObj).subscribe(
      (response) => {
        this.toastr.successMessage("Asset Allocation Saved Successfully");
      }
    );
  }

  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.TaskListId;
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  async getAssetAllocationData() {
    var reqObj = { AppId: this.AppId }
    await this.http.post(URLConstant.GetAssetAllocationDataByAppId, reqObj).toPromise().then(
      (response) => {
        this.ListUsedAssetNumber = response["ListAssetNumber"];
        this.appAssetObj = response["AppAssetObjs"];
        console.log(this.appAssetObj);
        if (response["AppAssetObjs"].length > 0) {
          this.AssetAllocationForm.controls["ListAsset"] = this.fb.array([]);
          for (let i = 0; i < response["AppAssetObjs"].length; i++) {
            var x = {
              AppAssetId: response["AppAssetObjs"][i].AppAssetId,
              AppAssetNo: response["AppAssetObjs"][i].AppAssetNo,
              AssetName: response["AppAssetObjs"][i].FullAssetName,
              ManuYear: response["AppAssetObjs"][i].ManufacturingYear,
              Color: response["AppAssetObjs"][i].Color,
              AssetCondition: response["AppAssetObjs"][i].AssetConditionName,
              Decision: response["AppAssetObjs"][i].DecisionName,
              DeliveryDt: response["AppAssetObjs"][i].DeliveryDt,
              DecisionCode: response["AppAssetObjs"][i].DecisionCode,
              StockAssetName: response["AppAssetObjs"][i].FullAssetName,
              ChassisNo: response["AppAssetObjs"][i].SerialNo1,
              EngineNo: response["AppAssetObjs"][i].SerialNo2,
              LicensePlateNo: response["AppAssetObjs"][i].SerialNo3,
              ColorAssetNumber: response["AppAssetObjs"][i].Color,
              ManuYearAssetNumber: response["AppAssetObjs"][i].ManufacturingYear,
              AssetLocation: response["AppAssetObjs"][i].AssetLocation,
              AssetNo: response["AppAssetObjs"][i].AssetNo
            };
            this.addListAsset(x);
          }
        }
      });
  }

  initLookupAssetNumber() {
    this.InputLookupAssetNumberObj = new InputLookupObj();
    this.InputLookupAssetNumberObj.urlJson = "./assets/uclookup/NAP/lookupServiceExpense.json";
    this.InputLookupAssetNumberObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetNumberObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetNumberObj.pagingJson = "./assets/uclookup/NAP/lookupServiceExpense.json";
    this.InputLookupAssetNumberObj.genericJson = "./assets/uclookup/NAP/lookupServiceExpense.json";
    //this.InputLookupAssetNumberObj.addCritInput = this.ListUsedAssetNumber;

    return this.InputLookupAssetNumberObj;
  }

  addListAsset(x) {
    var assetObj = this.AssetAllocationForm.controls["ListAsset"] as FormArray;
    var length = this.AssetAllocationForm.controls["ListAsset"]["controls"].length;
    var max = 0;
    if (length > 0) {
      max = this.AssetAllocationForm["controls"]["ListAsset"]["controls"][length - 1]["controls"]["No"].value;
    }
    if (x != undefined) {
      assetObj.push(this.addGroupAsset(x, max + 1));
      //var InputLookupAssetNumberObj = this.initLookupAssetNumber();
      //this.InputLookupAssetNumberObjs.push(InputLookupAssetNumberObj);
      if (x.DecisionCode == "USE_EXISTING") {
        //this.InputLookupAssetNumberObjs[max].jsonSelect = x;
        //this.InputLookupAssetNumberObjs[max].nameSelect = x.FullAssetName;
      }
    }
  }

  addGroupAsset(appAssetObj, i) {
    if (appAssetObj.DecisionCode == "USE_EXISTING") {
      return this.fb.group({
        No: [i],
        AppAssetId: [appAssetObj.AppAssetId],
        AppAssetNo: [appAssetObj.AppAssetNo],
        AssetName: [appAssetObj.AssetName],
        ManuYear: [appAssetObj.ManuYear],
        Color: [appAssetObj.Color],
        AssetCondition: [appAssetObj.AssetCondition],
        Decision: [appAssetObj.Decision],
        DeliveryDt: [appAssetObj.DeliveryDt],

        StockAssetName: [appAssetObj.StockAssetName, [Validators.required, Validators.maxLength(100)]],
        ChassisNo: [appAssetObj.ChassisNo, [Validators.required, Validators.maxLength(50)]],
        EngineNo: [appAssetObj.EngineNo, [Validators.required, Validators.maxLength(50)]],
        LicensePlateNo: [appAssetObj.LicensePlateNo, [Validators.required, Validators.maxLength(50)]],
        ColorAssetNumber: [appAssetObj.ColorAssetNumber, [Validators.required, Validators.maxLength(50)]],
        ManuYearAssetNumber: [appAssetObj.ManuYearAssetNumber, [Validators.required, Validators.maxLength(50)]],
        AssetLocation: [appAssetObj.AssetLocation, [Validators.required, Validators.maxLength(50)]],
        AssetNo: [appAssetObj.AssetNo, [Validators.required, Validators.maxLength(50)]],
        IsChecked:[false]
      })
    }
    else {
      return this.fb.group({
        No: [i],
        AppAssetId: [appAssetObj.AppAssetId],
        AppAssetNo: [appAssetObj.AppAssetNo],
        AssetName: [appAssetObj.AssetName],
        ManuYear: [appAssetObj.ManuYear],
        Color: [appAssetObj.Color],
        AssetCondition: [appAssetObj.AssetCondition],
        Decision: [appAssetObj.Decision],
        DeliveryDt: [appAssetObj.DeliveryDt],

        StockAssetName: [''],
        ChassisNo: ['', [Validators.required, Validators.maxLength(50)]],
        EngineNo: ['', [Validators.required, Validators.maxLength(50)]],
        LicensePlateNo: ['', [Validators.required, Validators.maxLength(50)]],
        ColorAssetNumber: ['', [Validators.required, Validators.maxLength(50)]],
        ManuYearAssetNumber: ['', [Validators.required, Validators.maxLength(50)]],
        AssetLocation: ['', [Validators.required, Validators.maxLength(50)]],
        AssetNo: ['', [Validators.required, Validators.maxLength(50)]],
        IsChecked: [false]
      })
    }
  }

  SetAssetNumber(i, event) {
    this.AssetAllocationForm.controls["ListAsset"]["controls"][i].patchValue({
      StockAssetName: event.AssetName,
      ChassisNo: event.ChassisNo,
      EngineNo: event.EngineNo,
      LicensePlateNo: event.LicensePlateNo,
      ColorAssetNumber: event.Color,
      ManuYearAssetNumber: event.ManuYear,
      AssetLocation: event.AssetLocation,
      AssetNo: event.AssetNo
    });
  }

  ChangeAllChecked() {
    for (let i = 0; i < this.AssetAllocationForm.controls["ListAsset"]["controls"].length; i++) {
      this.AssetAllocationForm.controls["ListAsset"]["controls"][i].patchValue({
        IsChecked: this.AssetAllocationForm.controls.IsCheckedAll.value
      });
    }
  }

  ChangeChecked(i) {
    var x = this.AssetAllocationForm["controls"]["ListAsset"]["controls"].filter(x => x["controls"]["IsChecked"].value == this.AssetAllocationForm["controls"]["ListAsset"]["controls"][i]["controls"]["IsChecked"].value)
    if (x.length == this.AssetAllocationForm.controls["ListAsset"]["controls"].length) {
      this.AssetAllocationForm.patchValue({
        IsCheckedAll: this.AssetAllocationForm["controls"]["ListAsset"]["controls"][i]["controls"]["IsChecked"].value
      });
    }
  }

  test() {
    console.log(this.AssetAllocationForm);
  }
}
