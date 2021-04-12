import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { CookieService } from 'ngx-cookie';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

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
  dictAssetNumber: { [key: string]: any; } = {};
  agrmntNo: any;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.TaskListId = params['WfTaskListId'];
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
    var Assets = new Array();
    console.log(this.AssetAllocationForm);
    Assets = this.AssetAllocationForm.controls["ListAsset"].value;
    console.log(Assets);
    if (Assets.find(x => x['IsChecked']) == undefined) {
      this.toastr.warningMessage("Please Choose at least 1 Asset");
      return;
    }
    for (let i = 0; i < Assets.length; i++) {
      var tempAsset = Assets.filter(
        asset => asset.AssetNo == Assets[i].AssetNo
      );
      if (tempAsset.length > 1) {
        this.toastr.warningMessage("Asset Number can't duplicate");
        return;
      }

      var newAssetAlloc = {
        AppAssetId: Assets[i].AppAssetId,
        AssetNo: Assets[i].AssetNo,
        SerialNo1: Assets[i].ChassisNo,
        SerialNo2: Assets[i].EngineNo,
        SerialNo3: Assets[i].LicensePlateNo,
        ManufacturingYear: Assets[i].ManuYearAssetNumber,
        Color: Assets[i].ColorAssetNumber,
        IsChecked: Assets[i].IsChecked
      };
      listAsset.push(newAssetAlloc);
    }

    var reqObj = {
      AppAssetObjs : listAsset
    }
    this.http.post(URLConstant.SubmitAssetAllocation, reqObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.backToPaging();
        
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
  isReady: boolean = false;
  async getAssetAllocationData() {
    var reqObj = { Id: this.AppId }
    await this.http.post(URLConstant.GetAssetAllocationDataByAppId, reqObj).toPromise().then(
      (response) => {
        this.ListUsedAssetNumber = response["ListAssetNumber"];
        this.appAssetObj = response["AppAssetObjs"];
        this.agrmntNo = response["AgrmntNo"];
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
              AssetNo: response["AppAssetObjs"][i].AssetNo,
              FullAssetCode: response["AppAssetObjs"][i].FullAssetCode,
            };
            this.addListAsset(x);
          }
        }
        this.http.post(URLConstant.GetListAssetReqInProgress, { AgrmntNo: this.agrmntNo }).subscribe(
          (response) => {
            this.requisitionList = response["ListAsset"];
          });
        this.isReady = true;
      });
  }

  initLookupAssetNumber() {
    this.InputLookupAssetNumberObj = new InputLookupObj();
    this.InputLookupAssetNumberObj.urlJson = "./assets/uclookup/NAP/lookupAssetNumber.json";
    this.InputLookupAssetNumberObj.urlEnviPaging = environment.AMSUrl;
    this.InputLookupAssetNumberObj.urlQryPaging = URLConstant.GetAssetStockPagingFromAms;
    this.InputLookupAssetNumberObj.pagingJson = "./assets/uclookup/NAP/lookupAssetNumber.json";
    this.InputLookupAssetNumberObj.genericJson = "./assets/uclookup/NAP/lookupAssetNumber.json";
    
    var assetCrit = new Array();
    var critAssetObj = new CriteriaObj();
    critAssetObj.DataType = 'text';
    critAssetObj.restriction = AdInsConstant.RestrictionNotIn;
    critAssetObj.propName = 'AssetNo';
    critAssetObj.listValue = this.ListUsedAssetNumber;
    assetCrit.push(critAssetObj);

    this.InputLookupAssetNumberObj.addCritInput = assetCrit;
    this.InputLookupAssetNumberObj.isReady = true;
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
      var InputLookupAssetNumberObj = this.initLookupAssetNumber();
      this.InputLookupAssetNumberObjs.push(InputLookupAssetNumberObj);

      this.dictAssetNumber[max + 1] = InputLookupAssetNumberObj;
      if (x.DecisionCode == "USE_EXISTING") {
        this.InputLookupAssetNumberObjs[max].jsonSelect = x;
        this.InputLookupAssetNumberObjs[max].nameSelect = x.FullAssetName;
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

        StockAssetName: [appAssetObj.StockAssetName],
        ChassisNo: [appAssetObj.ChassisNo],
        EngineNo: [appAssetObj.EngineNo],
        LicensePlateNo: [appAssetObj.LicensePlateNo],
        ColorAssetNumber: [appAssetObj.ColorAssetNumber],
        ManuYearAssetNumber: [appAssetObj.ManuYearAssetNumber],
        AssetNo: [appAssetObj.AssetNo],
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

        StockAssetName: [appAssetObj.StockAssetName ? appAssetObj.StockAssetName : ''],
        ChassisNo: [appAssetObj.ChassisNo ? appAssetObj.ChassisNo : ''],
        EngineNo: [appAssetObj.EngineNo ? appAssetObj.EngineNo : ''],
        LicensePlateNo: [appAssetObj.LicensePlateNo ? appAssetObj.LicensePlateNo : ''],
        ColorAssetNumber: [appAssetObj.ColorAssetNumber ? appAssetObj.ColorAssetNumber : ''],
        ManuYearAssetNumber: [appAssetObj.ManuYearAssetNumber ? appAssetObj.ManuYearAssetNumber : ''],
        AssetNo: [appAssetObj.AssetNo ? appAssetObj.AssetNo : ''],
        IsChecked: [false]
      })
    }
  }

  SetAssetNumber(i, event) {
    this.AssetAllocationForm.controls["ListAsset"]["controls"][i].patchValue({
      StockAssetName: event.FullAssetName,
      ChassisNo: event.SerialNo1,
      EngineNo: event.SerialNo2,
      LicensePlateNo: event.SerialNo3,
      ColorAssetNumber: event.Color,
      ManuYearAssetNumber: event.ManufacturingYear,
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

  backToPaging() {
    //console.log(this.AssetAllocationForm);
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADM_PRCS_ASSET_ALLOC_PAGING], {});
  }
}
