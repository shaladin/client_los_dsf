import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcDropdownListConstant, UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { RefFinAssetUsageMapObj } from 'app/shared/model/ref-fin-asset-usage-map-obj.model'
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-ref-fin-asset-usage-map-add-edit',
  templateUrl: './ref-fin-asset-usage-map-add-edit.component.html',
  styleUrls: ['./ref-fin-asset-usage-map-add-edit.component.css']
})
export class RefFinAssetUsageMapAddEditComponent implements OnInit {

  RefFinAssetUsageMapId: number = 0;
  ReqRefMasterObj: ReqRefMasterByTypeCodeAndMappingCodeObj;
  RefFinAssetUsageMapObj: RefFinAssetUsageMapObj = new RefFinAssetUsageMapObj();

  RefFinAssetUsageMapForm = this.fb.group({
    PurposeOfFinCode: ['', Validators.required],
    MrAssetUsageCode: ['', Validators.required],
    RowVersion: []
  });

  readonly CancelLink: string = NavigationConstant.REF_FIN_ASSET_USAGE_MAP_PAGING;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,
              private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["RefFinAssetUsageMapId"] != null) {
        this.RefFinAssetUsageMapId = params["RefFinAssetUsageMapId"];
      }
    });
  }

  async ngOnInit() {
    await this.initDdl();
    if (this.RefFinAssetUsageMapId > 0) await this.getData();
  }

  DictUcDDLObj: { [id: string]: UcDropdownListObj } = {};
  async initDdl()
  {
    let tempDdlObj: UcDropdownListObj = new UcDropdownListObj();
    this.ReqRefMasterObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    this.ReqRefMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetUsage;
    
    tempDdlObj.apiUrl = URLConstant.GetListActiveRefMaster;
    tempDdlObj.requestObj = this.ReqRefMasterObj;
    tempDdlObj.ddlType = UcDropdownListConstant.DDL_TYPE_ONE;
    //tempDdlObj.isSelectOutput = isSelectOutput;
    tempDdlObj.isReady = true;
    tempDdlObj.customKey = "MasterCode";
    tempDdlObj.customValue = "Descr";
    this.DictUcDDLObj[CommonConstant.RefMasterTypeCodeAssetUsage] = tempDdlObj;

    tempDdlObj = new UcDropdownListObj();
    tempDdlObj.apiUrl = URLConstant.GetListKvpActivePurposeOfFin;
    tempDdlObj.ddlType = UcDropdownListConstant.DDL_TYPE_ONE;
    tempDdlObj.isReady = true;
    tempDdlObj.customObjName = "ReturnObject";
    tempDdlObj.isObject = true;
    this.DictUcDDLObj["PURPOSE_OF_FIN"] = tempDdlObj;
  }

  async getData()
  {
    await this.http.post(URLConstant.GetRefFinAssetUsageMapByRefFinAssetUsageMapId, {Id: this.RefFinAssetUsageMapId}).toPromise().then(
      (response: any) => {
        this.RefFinAssetUsageMapForm.patchValue({
          PurposeOfFinCode: response.PurposeOfFinCode,
          MrAssetUsageCode: response.MrAssetUsageCode,
          RowVersion: response.RowVersion
        });
      });
  }

  async SaveForm()
  {
    this.RefFinAssetUsageMapObj = new RefFinAssetUsageMapObj();
    this.RefFinAssetUsageMapObj.PurposeOfFinCode = this.RefFinAssetUsageMapForm.controls.PurposeOfFinCode.value;
    this.RefFinAssetUsageMapObj.MrAssetUsageCode = this.RefFinAssetUsageMapForm.controls.MrAssetUsageCode.value;

    if (this.RefFinAssetUsageMapId > 0) {
      this.RefFinAssetUsageMapObj.RefFinAssetUsageMapId = this.RefFinAssetUsageMapId;
      this.RefFinAssetUsageMapObj.RowVersion = this.RefFinAssetUsageMapForm.controls.RowVersion.value;

      await this.http.post(URLConstant.EditRefFinAssetUsageMap, this.RefFinAssetUsageMapObj).toPromise().then(
        (response: any) => {
          this.toastr.successMessage(response["Message"]);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.REF_FIN_ASSET_USAGE_MAP_PAGING],{});
          return;
        });
    }
    else
    {
      await this.http.post(URLConstant.AddRefFinAssetUsageMap, this.RefFinAssetUsageMapObj).toPromise().then(
        (response: any) => {
          this.toastr.successMessage(response["Message"]);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.REF_FIN_ASSET_USAGE_MAP_PAGING],{});
      });
    }
  }
}
