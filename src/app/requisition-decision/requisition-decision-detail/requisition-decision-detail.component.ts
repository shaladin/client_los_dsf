import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-requisition-decision-detail',
  templateUrl: './requisition-decision-detail.component.html',
  styleUrls: []
})
export class RequisitionDecisionDetailComponent implements OnInit {
  AppId: number;
  AppAssetId: number;
  WfTaskListId: number;
  TotalPurchaseAsset: number = 0;
  TotalUseExistingStock: number = 0;
  Index: number;

  IsSecondDetail: boolean = false;
  IsExisting: boolean = false;

  ChasisNo: string = "-";
  EngineNo: string = "-";
  LicensePlateNo: string = "-";

  AssetInfoObj: any;

  ListOfAsset: Array<any> = new Array<any>();
  AttributeList: Array<any> = new Array<any>();
  AccessoriesList: Array<any> = new Array<any>();
  
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();

  InputLookupAssetObj: InputLookupObj = new InputLookupObj();

  ReqDecForm = this.fb.group({
    Decision: ['', [Validators.required]],
    AssetNo: [''],
    ManYear: [, [Validators.required]],
    Notes: ['', [Validators.maxLength(4000)]]
  });
  
  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
    private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["WfTaskListId"] != null) {
        this.WfTaskListId = params["WfTaskListId"];
      }
    });
  }

  async ngOnInit() {
    // this.InputLookupAssetObj.urlJson = "./assets/uclookup/Lead/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    // this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    // this.InputLookupAssetObj.pagingJson = "./assets/uclookup/Lead/lookupAsset.json";
    // this.InputLookupAssetObj.genericJson = "./assets/uclookup/Lead/lookupAsset.json";
    this.InputLookupAssetObj.isRequired = true;

    await this.SetMainInfo();
    await this.SetListOfAsset();
  }

  async SetMainInfo() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/requisition-decision/view-requisition-decision-detail-main-info.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
  }

  async SetListOfAsset() {
    var requestAppId = {
      AppId: this.AppId
    };

    await this.http.post(URLConstant.GetListOfAsset, requestAppId).toPromise().then(
      (response: any) => {
        this.ListOfAsset = response["ReturnObject"];
        console.log("Isi ListOfAsset: ", this.ListOfAsset);

        if(this.ListOfAsset.length !== 0) {
          for(let i = 0; i < this.ListOfAsset.length; i++) {
            if(this.ListOfAsset[i].Decision === "Purchase Asset") {
              this.TotalPurchaseAsset += 1;
            }
            else if(this.ListOfAsset[i].Decision === "Use Existing Stock") {
              this.TotalUseExistingStock += 1;
            }
          }
        }
      }
    );
  }

  CancelToPaging() {
    this.router.navigate(['/requisitiondecision/paging'], { queryParams: { BizTemplateCode: "OPL"} });
  }

  Submit() {
    if(this.ListOfAsset.length !== this.TotalPurchaseAsset + this.TotalUseExistingStock) {
      this.toastr.warningMessage("All Asset Must Select Decision");
    }
    else {
      var requestRequisitionDecisionObj = {
        AppId: this.AppId
      };

      this.http.post(URLConstant.SubmitRequisitionDecision, requestRequisitionDecisionObj).toPromise().then(
        (response) => {
          this.toastr.successMessage("Submit Requisition Decision Success");
          this.router.navigate(['../paging'], { relativeTo: this.route });
        }
      );
    }
  }

  ChangeDetail(index: number, appAssetId: number) {
    this.AssetInfoObj = this.ListOfAsset[index];
    this.AppAssetId = appAssetId;
    this.Index = index;

    this.ReqDecForm.patchValue({
      Decision: this.AssetInfoObj.DecisionCode,
      ManYear: this.AssetInfoObj.ManufacturingYear
    });

    this.ChangeDecision(this.AssetInfoObj.DecisionCode);

    this.ReqDecForm.controls.ManYear.disable();

    var requestAppAssetId = {
      AppAssetId: this.AppAssetId
    };

    this.http.post(URLConstant.GetListAppAssetAccessoryAndAppAssetAttrByAppAssetId, requestAppAssetId).toPromise().then(
      (response) => {
        this.AccessoriesList = response["AppAssetAccesories"];
        this.AttributeList = response["AppAssetAttrs"];
      }
    );

    this.IsSecondDetail = true;
  }

  OnChangedDdl(event: any) {
    this.ChangeDecision(event.target.value);
  }
  
  SetAsset(event: any) {
    this.ReqDecForm.patchValue({
      AssetNo: event.AssetNo
    });

    // this.ChasisNo = event.ChasisNo;
    // this.EngineNo = event.EngineNo;
    // this.LicensePlateNo = event.LicensePlateNo;
  }

  ChangeDecision(decisionCode: string) {
    if(decisionCode === "EXISTING") {
      this.ReqDecForm.controls.AssetNo.setValidators(Validators.required);
      
      if(this.AssetInfoObj.AssetNo !== null) {
        this.ReqDecForm.patchValue({
          AssetNo: this.AssetInfoObj.AssetNo
        });
  
        this.InputLookupAssetObj.nameSelect = this.AssetInfoObj.AssetNo;

        // this.ChasisNo = ChasisNo (Belum Tau Dapat Dari Mana);
        // this.EngineNo = EngineNo (Belum Tau Dapat Dari Mana);
        // this.LicensePlateNo = LicensePlateNo (Belum Tau Dapat Dari Mana);
      }

      this.IsExisting = true;
    }
    else {
      this.ReqDecForm.controls.AssetNo.clearValidators();
      this.IsExisting = false;
    }
  }

  Cancel() {
    this.IsSecondDetail = false;
  }

  SaveForm() {
    var requestRequisitionDecisionObj = {
      AppId: this.AppId,
      Notes: this.ReqDecForm.value.Notes,
      AppAssetId: this.AppAssetId,
      DecisionCode: this.ReqDecForm.value.Decision,
      AssetNo: this.ReqDecForm.value.AssetNo
    };

    this.http.post(URLConstant.SaveRequisitionDecision, requestRequisitionDecisionObj).toPromise().then(
      (response: any) => {
        this.ListOfAsset[this.Index].DecisionCode = this.ReqDecForm.value.Decision;
        this.ListOfAsset[this.Index].AssetNo = this.ReqDecForm.value.AssetNo;

        this.TotalPurchaseAsset = 0;
        this.TotalUseExistingStock = 0;

        for(let i = 0; i < this.ListOfAsset.length; i++) {
          if(this.ListOfAsset[i].Decision === "Purchase Asset") {
            this.TotalPurchaseAsset += 1;
          }
          else if(this.ListOfAsset[i].Decision === "Use Existing Stock") {
            this.TotalUseExistingStock += 1;
          }
        }

        this.toastr.successMessage("Submit Requisition Decision Asset Success");
        this.IsSecondDetail = false;
      }
    );
  }

  GetCallBack(event: any) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.ViewObj.AppId);
    }
    else if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.ViewObj.ProdOfferingCode, event.ViewObj.ProdOfferingVersion);
    }
  }
}