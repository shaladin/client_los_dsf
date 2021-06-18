import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { HttpClient } from '@angular/common/http';
import { ResultRefundObj } from 'app/shared/model/AppFinData/ResultRefund.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { forkJoin } from 'rxjs';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-commission-reserved-fund-paging',
  templateUrl: './commission-reserved-fund-paging.component.html'
})
export class CommissionReservedFundPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCommission.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCommission.json";

    var arrCrit = new Array();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "COM_RSV_" + this.BizTemplateCode;
    arrCrit.push(critObj);

    this.inputPagingObj.addCritInput = arrCrit;
  }
  async GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      if (!await this.CheckRuleObj(ev.RowObj.AppId)) {
        this.toastr.warningMessage("Please complete MaxRefund Rule for " + this.BizTemplateCode + " ");
        return;
      }
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_CRD_PRCS_COMM_RSV_FUND_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId });      
    }
  }

  DictMaxRefundChecked: { [id: string]: boolean } = {};
  async CheckRuleObj(appId: number): Promise<boolean> {
    this.DictMaxRefundChecked = {};
    let flag = true;
    let getRuleCommission = await this.http.post(URLConstant.GetAppCommissionRule, { AppId: appId, BizTemplateCode: this.BizTemplateCode });
    let getRuleRsvFund = await this.http.post(URLConstant.CreateRsvFundRule, { Id: appId });
    let getMaxRefund = await this.http.post<AppFinDataObj>(URLConstant.GetAppFinDataWithRuleByAppId, { Id: appId });
    await forkJoin([getRuleCommission, getRuleRsvFund, getMaxRefund]).toPromise().then(
      (response) => {
        let TempResRuleCommissionObj = response[0][CommonConstant.ReturnObj];
        let TempResRuleRsvFundObj = response[1][CommonConstant.ReturnObj];
        let TempListResultRefundObj: Array<ResultRefundObj> = response[2]["ResultRefundRsvFundObjs"];

        for (let index = 0; index < TempResRuleCommissionObj.length; index++) {
          const element = TempResRuleCommissionObj[index][CommonConstant.ReturnObj]["RuleDataObjects"];

          if (element.ResultSupplier != null && element.ResultSupplier != undefined) {
            flag = this.CheckRuleCompletion(element.ResultSupplier.AllocationFrom, TempListResultRefundObj, flag);
          }
          if (element.ResultSupplierEmp != null && element.ResultSupplierEmp != undefined) {
            flag = this.CheckRuleCompletion(element.ResultSupplierEmp.AllocationFrom, TempListResultRefundObj, flag);
          }
          if (element.ResultReferantor != null && element.ResultReferantor != undefined) {
            flag = this.CheckRuleCompletion(element.ResultReferantor.AllocationFrom, TempListResultRefundObj, flag);
          }
        }

        for (let index = 0; index < TempResRuleRsvFundObj.length; index++) {
          const element = TempResRuleRsvFundObj[index].AllocationFrom;
          flag = this.CheckDictMaxRefundChecked(element, TempListResultRefundObj, flag);
        }
      }
    );
    return flag;
  }

  CheckRuleCompletion(listAllocFrom: Array<string>, listResultRefund: Array<ResultRefundObj>, flag: boolean): boolean {
    for (let index = 0; index < listAllocFrom.length; index++) {
      const element: string = listAllocFrom[index];
      flag = this.CheckDictMaxRefundChecked(element, listResultRefund, flag);
    }
    return flag;
  }

  CheckDictMaxRefundChecked(allocFrom: string, listResultRefund: Array<ResultRefundObj>, flag: boolean): boolean {
    if (this.DictMaxRefundChecked[allocFrom] != undefined && this.DictMaxRefundChecked[allocFrom]) {
      return flag;
    } else {
      this.DictMaxRefundChecked[allocFrom] = true;
      let tempIdx: number = listResultRefund.findIndex(x => x.RefundAllocationFrom == allocFrom);

      if (tempIdx == -1) {
        this.toastr.warningMessage(this.BizTemplateCode + "  does not have " + allocFrom + " in MaxRefund Rule");
        flag = false;
      }
    }
    return flag;
  }
}
