import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { forkJoin } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { ReqGetProdOffDByProdOffVersion } from 'app/shared/model/Request/Product/ReqGetProdOfferingObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { RdlcReportObjv2, ReportParamObjv2 } from 'app/shared/model/Report/RdlcReportObjv2.model';


@Component({
  selector: 'app-agreement-view-container',
  templateUrl: './agreement-view-container.component.html',
  styleUrls: []
})
export class AgreementViewContainerComponent implements OnInit {

  @Input() arrValue = [];
  AgrmntId;
  AppId: number;
  BizTemplateCode: string;
  ResponseAppDetailData;
  IsReady: boolean = false;
  IsCustomer: boolean = true;
  IsAsset: boolean = true;
  IsDocument: boolean = true;
  IsInsurance: boolean = true;
  IsAgreementCard: boolean = true;
  IsCommission: boolean = true;
  IsPurchaseOrder: boolean = true;
  IsCustomerCard: boolean = true;
  IsDeviation: boolean = true;
  IsLoanData: boolean = true;
  IsCollateral: boolean = true;
  IsDeliveryOrder: boolean = true;
  IsSummary: boolean = true;

  IsInsuranceFL4W: boolean = true;
  IsLifeInsurance: boolean = true;
  IsFinancial: boolean = true;
  IsTC: boolean = true;
  IsReservedFund: boolean = true;
  IsComplainHandling: boolean = true;
  IsAdditionalService: boolean = true;
  IsMulti: boolean = true;
  IsAppCollateral: boolean = true;
  isDmsReady: boolean;
  dmsObj: DMSObj;
  agrNo: string;
  appId: string;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  IsNeedPO: boolean = false;
  RdlcReport: RdlcReportObjv2 = new RdlcReportObjv2();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, private cookieService: CookieService,
    private toastr: NGXToastrService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  async ngOnInit() : Promise<void> {
    this.arrValue.push(this.AgrmntId);
    await this.GetAgrmnt();
    await this.GetAppAndAppCustDetailByAgrmntId();
    await this.InitDms();
  }

  async InitDms() {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response;
    });
    if(this.SysConfigResultObj.ConfigValue == '1'){
      this.isDmsReady = false;
      this.dmsObj = new DMSObj();
      let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      this.dmsObj.User = currentUserContext.UserName;
      this.dmsObj.Role = currentUserContext.RoleCode;
      this.dmsObj.ViewCode = CommonConstant.DmsViewCodeAgr;
      var agrObj = { Id: this.AgrmntId };
  
      await this.http.post(URLConstant.GetAgrmntByAgrmntId, agrObj).subscribe(
        (response) => {
          this.agrNo = response['AgrmntNo'];
          this.appId = response['AppId'];
          var appObj = { Id: this.appId };
          let getApp = this.http.post(URLConstant.GetAppById, appObj);
          let getAppCust = this.http.post(URLConstant.GetAppCustByAppId, appObj);
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsNoAgr, this.agrNo));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideView));
          forkJoin([getApp, getAppCust]).subscribe(
            (response) => {
              let appNo = response[0]['AppNo'];
              let custNo = response[1]['CustNo'];
              if (custNo != null && custNo != '') {
                this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, custNo));
              }
              this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoApp, appNo));
              let mouId = response[0]['MouCustId'];
              if (mouId != null && mouId != "") {
                let mouObj = { Id: mouId };
                this.http.post(URLConstant.GetMouCustById, mouObj).subscribe(
                  result => {
                    let mouCustNo = result['MouCustNo'];
                    this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsMouId, mouCustNo));
                    this.isDmsReady = true;
                  }
                )
              }
              else {
                this.isDmsReady = true;
              }
            }
          )
        }
      );
    }  
  }

  async GetAppAndAppCustDetailByAgrmntId() {
  
    await this.http.post(URLConstant.GetAppAndAppCustDetailByAgrmntId, { Id: this.AgrmntId }).toPromise().then(
      (response) => {
        this.ResponseAppDetailData = response;
        this.GetIsNeedPO();
        this.GetAgrmnt();
      });
  }

  GetIsNeedPO(){
    if(this.ResponseAppDetailData.BizTemplateCode == CommonConstant.FCTR || this.ResponseAppDetailData.BizTemplateCode == CommonConstant.CFNA){
      let objIsDisburse: ReqGetProdOffDByProdOffVersion = new ReqGetProdOffDByProdOffVersion();
      objIsDisburse.ProdOfferingCode = this.ResponseAppDetailData.ProdOfferingCode;
      objIsDisburse.RefProdCompntCode = CommonConstant.RefProdCompntCodeDisburseToCust;
      objIsDisburse.ProdOfferingVersion = this.ResponseAppDetailData.ProdOfferingVersion;

      this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, objIsDisburse).subscribe(
        (response) => {
          if (response && response["StatusCode"] == "200" && response["ProdOfferingDId"] > 0) {
            this.IsNeedPO = response["CompntValue"] == 'N' ? true : false;
          }
        });
    }
  }

  GetAgrmnt() {
    this.http.post(URLConstant.GetAgrmntByAgrmntId, { Id: this.AgrmntId }).subscribe(
      (response) => {
        this.BizTemplateCode = response["BizTemplateCode"];
        this.AppId = response['AppId'];

        if (this.BizTemplateCode == CommonConstant.FCTR) {
          this.IsCollateral = false;
          this.IsCommission = false;
          this.IsAsset = false;
          this.IsInsuranceFL4W = false;
          this.IsLifeInsurance = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
          this.IsDeliveryOrder = false;
          this.IsPurchaseOrder = false;
          this.IsLoanData = false;
          if(!this.IsNeedPO){
            this.IsPurchaseOrder = false;
          }
        }
        else if (this.BizTemplateCode == CommonConstant.CFRFN4W) {
          this.IsAsset = false;
          this.IsLoanData = false;
          this.IsInsuranceFL4W = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
          this.IsPurchaseOrder = false;
          this.IsDeliveryOrder = false;
          this.IsMulti = false;
          this.IsCollateral = false;
        }
        else if (this.BizTemplateCode == CommonConstant.CF4W) {
          this.IsCollateral = false;
          this.IsInsuranceFL4W = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
          this.IsAppCollateral = false;
          this.IsLoanData = false;
        }
        else if (this.BizTemplateCode == CommonConstant.FL4W) {
          this.IsAsset = false;
          this.IsInsurance = false;
          this.IsCustomerCard = false;
          this.IsDeviation = false;
          this.IsLoanData = false;
          this.IsComplainHandling = false;
          this.IsAdditionalService = false;
          this.IsAppCollateral = false;
        }
        else if (this.BizTemplateCode == CommonConstant.CFNA) {
          this.IsAsset = false;
          this.IsLoanData = false;
          this.IsInsuranceFL4W = false;
          this.IsLifeInsurance = false;
          this.IsFinancial = false;
          this.IsTC = false;
          this.IsReservedFund = false;
          this.IsDeliveryOrder = false;
          this.IsCollateral = false;
          if(!this.IsNeedPO){
            this.IsPurchaseOrder = false;
          }
        }
        else if (this.BizTemplateCode == CommonConstant.DF) {
          this.IsAsset = false;
          this.IsInsuranceFL4W = false;
          this.IsInsurance = false;
          this.IsLifeInsurance = false;
          this.IsPurchaseOrder = false;
          this.IsDeliveryOrder = false;
          this.IsLoanData = false;
          this.IsCollateral = false;
          this.IsCommission = false;
          this.IsReservedFund = false;
          this.IsDeviation = false;
          this.IsInvoiceData = false;
        }
        this.IsReady = true;
      });
  }
  printCustomerCard(){
    let currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    this.RdlcReport.RequestingUsername = currentUserContext.UserName;
    this.RdlcReport.ReportInfo.ReportName = "DOC_CUSTAGRLIST";
    this.RdlcReport.ReportInfo.ReportTemplateCode = "DOC_CUSTAGRLIST";
    this.RdlcReport.ReportInfo.ReportParameters = new Array<ReportParamObjv2>();
    this.RdlcReport.ReportInfo.ExportFormat = 0;
  
    let reportParamObj: ReportParamObjv2 = new ReportParamObjv2();
    reportParamObj.paramKey = "AgrmntId";
    reportParamObj.paramValue = this.AgrmntId;
    reportParamObj.paramAssignment = 1;
    
    
    this.RdlcReport.ReportInfo.ReportParameters.push(reportParamObj);
  
    this.http.post(URLConstant.GenerateReportR3, this.RdlcReport).subscribe(
      (response) => {
        let linkSource: string = 'data:application/pdf;base64,' + response["ReportFile"];
        let fileName: string = this.AgrmntId + ".pdf";
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
  
        if (response["ReportFile"] != undefined) {
          // downloadLink.click();
          // this.toastr.successMessage(response['message']);
  
          var iframe = "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>";
          var x = window.open();
          x.document.open();
          x.document.write(iframe);
          x.document.close();
        } else {
          this.toastr.warningMessage(response['message']);
        }
      });
  }
}
