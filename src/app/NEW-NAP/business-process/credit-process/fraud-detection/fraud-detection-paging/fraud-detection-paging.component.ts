import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-fraud-detection-paging',
  templateUrl: './fraud-detection-paging.component.html',
  styleUrls: []
})
export class FraudDetectionPagingComponent implements OnInit {
  inputPagingObj: any;
  BizTemplateCode: string;
  token: any = localStorage.getItem(CommonConstant.TOKEN);
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchFraudDetection.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchFraudDetection.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionIn;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.listValue = ["FRD_" + this.BizTemplateCode,"FCR_" + this.BizTemplateCode, "FRV_" + this.BizTemplateCode]
    arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = arrCrit;
  }

  GetCallBack(event) {

    if (event.Key == "ViewProdOffering") { 
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( event.RowObj.prodOfferingCode, event.RowObj.prodOfferingVersion);
    }
    else {
      if(event.RowObj.ActCode == "FCR_" + this.BizTemplateCode){
        var appObj = {AppId: event.RowObj.AppId};
        this.http.post(URLConstant.SurveyFraudAppCheckingValidationForFraudVerif, appObj).subscribe(
          (response) => {
            var dupCheckErrorMessage = response["DupCheckErrorMessage"];
            var surveyErrorMessage = response["SurveyErrorMessage"];
            var fraudDetectionErrorMessage = response["FraudDetectionErrorMessage"];
            if(dupCheckErrorMessage != null){
              this.toastr.warningMessage(dupCheckErrorMessage);
              return false;
            }

            if(surveyErrorMessage != null){
              this.toastr.warningMessage(surveyErrorMessage);
              return false;
            }

            if(fraudDetectionErrorMessage != null){
              this.toastr.warningMessage(fraudDetectionErrorMessage);
              return false;
            }

            if(dupCheckErrorMessage == null && surveyErrorMessage == null && fraudDetectionErrorMessage == null){
              if (event.RowObj.BizTemplateCode == CommonConstant.FL4W)
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_FRAUD_VERIF_MULTI_ASSET_PAGING], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });
              else
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_FRAUD_DETECTION_DETAIL], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });
            }
          }
        );
      }else{
        var appObj = {AppId: event.RowObj.AppId};
        this.http.post(AdInsConstant.SurveyFraudAppCheckingValidationForFraudVerif, appObj).subscribe(
          (response) => {
            var dupCheckErrorMessage = response["DupCheckErrorMessage"];
            var surveyErrorMessage = response["SurveyErrorMessage"];
            var fraudDetectionErrorMessage = response["FraudDetectionErrorMessage"];
            if(dupCheckErrorMessage != null){
              this.toastr.warningMessage(dupCheckErrorMessage);
              return false;
            }

            if(surveyErrorMessage != null){
              this.toastr.warningMessage(surveyErrorMessage);
              return false;
            }

            if(fraudDetectionErrorMessage != null){
              this.toastr.warningMessage(fraudDetectionErrorMessage);
              return false;
            }

            if(dupCheckErrorMessage == null && surveyErrorMessage == null && fraudDetectionErrorMessage == null){
              if (event.RowObj.BizTemplateCode == CommonConstant.FL4W)
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_FRAUD_VERIF_MULTI_ASSET_PAGING], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId })
              else
                AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CRD_PRCS_FRAUD_DETECTION_DETAIL], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId })
            }
          }
        );
      //   if (event.RowObj.BizTemplateCode == CommonConstant.FL4W)
      //   this.router.navigate(['/Nap/CreditProcess/FraudVerifMultiAsset/Paging'], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } })
      // else
      //   this.router.navigate(["/Nap/CreditProcess/FraudDetection/Detail"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
      }     
    }


    // var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    // var wfClaimObj = new ClaimWorkflowObj();
    // wfClaimObj.pWFTaskListID = event.RowObj.WfTaskListId;
    // wfClaimObj.pUserID = currentUserContext["UserName"];

    // this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
    //   (response) => {

  }

}
