import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { environment } from 'environments/environment';
import { PreGoLiveOplService } from '../pre-go-live-opl.service';

@Component({
  selector: 'app-pre-go-live-opl-paging',
  templateUrl: './pre-go-live-opl-paging.component.html',
  styleUrls: []
})
export class PreGoLiveOplPagingComponent implements OnInit {
  ucTempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  IsAddToTemp: boolean = false;
  IsReady: boolean = false;
  BizTemplateCode: string;
  AppId: number;
  WfTaskListId: number;
  
  constructor(private preGoLiveOplService: PreGoLiveOplService,
    private toastr: NGXToastrService,
    private router: Router,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(params => {
        if (params["BizTemplateCode"] != null) {
          this.BizTemplateCode = params["BizTemplateCode"];
          localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
        }
        else {
          this.BizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
        }
      });
    }

  ngOnInit() {
    this.ucTempPagingObj.urlJson = "./assets/ucpaging/opl/search-pre-go-live-opl-paging.json";
    this.ucTempPagingObj.enviromentUrl = environment.losUrl;
    this.ucTempPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.ucTempPagingObj.pagingJson = "./assets/ucpaging/opl/search-pre-go-live-opl-paging.json";
    this.ucTempPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    var critInput = new CriteriaObj();
    critInput.propName = "WTL.ACT_CODE";
    critInput.restriction = AdInsConstant.RestrictionEq;
    critInput.value = "PGLV_" + this.BizTemplateCode;

    this.ucTempPagingObj.addCritInput.push(critInput);

    this.IsReady = true;
  }

  getCallBack(event: any) {
    var tempArray: Array<any> = event.TempListObj;
    this.preGoLiveOplService.SetList(tempArray);
    this.IsAddToTemp = true;
  }

  getSelectedCallback(event: any) {
    if(event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
    }
    else if(event.Key === "AppAsset") {
      window.open(environment.losR3Web + "/View/AppAsset?AppId=" + event.RowObj.AppId + "&AppAssetId=" + event.RowObj.AppAssetId, "_blank");
    }
    else if(event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.ProdOfferingCode,event.RowObj.ProdOfferingVersion); 
    }
  }

  Next() {
    if(this.preGoLiveOplService.getList() !== undefined) {
      if(this.preGoLiveOplService.getList().length === 0) {
        this.toastr.errorMessage("Please Select Item First");
      }
      else {
        if(this.IsAppNoSame) {
          AdInsHelper.RedirectUrl(this.router,["Nap/AdminProcess/pregoliveopl/detail"], { "AppId": this.AppId, "WfTaskListId": this.WfTaskListId });
        }
        else {
          this.toastr.errorMessage("Application No Must Same!");
        }
      }
    }
    else {
      this.toastr.errorMessage("Please Select Item First");
    }
  }

  IsAppNoSame() {
    if (this.preGoLiveOplService.getList() !== undefined) {
      var listPreGoLiveOpl: Array<any> = this.preGoLiveOplService.getList();
      var appNo = listPreGoLiveOpl[0].AppNo
      for (var i = 1; i < listPreGoLiveOpl.length; i++) {
        if (listPreGoLiveOpl[i].AppNo !== appNo) {
          return false;
        }
      }
      this.AppId = listPreGoLiveOpl[0].AppId;
      this.WfTaskListId = listPreGoLiveOpl[0].WfTaskListId;

      return true;
    }
  }
}