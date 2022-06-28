import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { forkJoin } from 'rxjs';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { RefProfessionObj } from 'app/shared/model/ref-profession-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'view-asset-data-detail-x',
  templateUrl: './view-asset-data-detail-x.component.html'
})
export class ViewAssetDataDetailXComponent implements OnInit {
  @Input() AppAssetId: number;
  @Input() AppId: number;
  @Input() BizTemplateCode: string;
  @Input() AppCollateralId: number;
  appAsset: any;
  appAssetSupplEmp: any;
  appCollateralRegistration: any;
  AssetTypeObj: any;
  salesName: string;
  branchManagerName: string;
  adminHeadName: string;
  inputGridObj: InputGridObj = new InputGridObj();
  OwnerProfessionName: string = '-';
  isOtherEmpPosCode: boolean;

  constructor(private httpClient: HttpClient, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/app-view/gridAppAssetAccessoryFL4W.json";
    this.isOtherEmpPosCode = false;
    let getAppAsset = this.httpClient.post(URLConstant.GetAppAssetByAppAssetIdWithSerialNoDefinition, { Id: this.AppAssetId });
    let getAppAssetSupplEmp = this.httpClient.post(URLConstant.GetListAppAssetSupplEmpByAppAssetId, { Id: this.AppAssetId });
    let getAppCollReg = this.httpClient.post(URLConstant.GetAppCollateralRegistrationByAppCollateralId, { Id: this.AppCollateralId });
    forkJoin([getAppAsset, getAppAssetSupplEmp, getAppCollReg]).subscribe(
      (response: any) => {
        this.appAsset = response[0];
        this.appAssetSupplEmp = response[1];
        this.appCollateralRegistration = response[2];
        this.GetRefProfession();

        for (const item of this.appAssetSupplEmp.ReturnObject) {
          if(item.MrSupplEmpPositionCode == CommonConstant.SALES_JOB_CODE){
            this.salesName = item.SupplEmpName;
          }
          else if(item.MrSupplEmpPositionCode == CommonConstant.BRANCH_MANAGER_JOB_CODE){
            this.branchManagerName = item.SupplEmpName;
          }
          else if(item.MrSupplEmpPositionCode == CommonConstant.ADMIN_HEAD_JOB_CODE){
            this.adminHeadName = item.SupplEmpName;
          }
          else
          {
            this.salesName = item.SupplEmpName;
            this.isOtherEmpPosCode = true;
            break;
          }
        }

        if(this.salesName == null && this.adminHeadName !=null){
          this.salesName = this.adminHeadName
        }

        if (this.salesName == null && this.adminHeadName ==null && this.branchManagerName !=null){
          this.salesName = this.branchManagerName 
          this.adminHeadName = this.branchManagerName 
        }

        if(this.isOtherEmpPosCode)
        {
          this.adminHeadName = null;
          this.branchManagerName = null;
        }

        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = this.appAsset.ResponseAppAssetAccessoryObjs;
      }
    );

    this.httpClient.post(URLConstant.GetAssetTypeByCode, {Code: this.appAsset.AssetTypeCode }).subscribe(
      (response: any) => {
        this.AssetTypeObj = response;
      }
    );
  }

  GetRefProfession() {
    if(this.appCollateralRegistration.MrOwnerTypeCode == CommonConstant.CustTypeCompany){
      const ReqObj = {
        RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType,
        MasterCode: this.appCollateralRegistration.OwnerProfessionCode
      }
      this.httpClient.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, ReqObj).subscribe(
        (response) => {
          this.OwnerProfessionName = response["Descr"];
        });
    }else{
      this.httpClient.post(URLConstant.GetRefProfessionByCode, {Code: this.appCollateralRegistration.OwnerProfessionCode}).subscribe(
        (response: RefProfessionObj) => {
          if(response.ProfessionName != null) {
            this.OwnerProfessionName = response.ProfessionName;
          }
        }
      )
    }

  }

}
