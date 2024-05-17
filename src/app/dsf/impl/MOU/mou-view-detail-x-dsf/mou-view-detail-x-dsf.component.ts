import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { MouCustDlrFinObj } from 'app/shared/model/mou-cust-dlr-fin.model';
import { GenericKeyValueListObj } from 'app/shared/model/generic/generic-key-value-list-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { VendorObj } from 'app/shared/model/vendor-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { ReqMouCustDsfObj } from 'app/shared/model/mou-cust-dsf-obj.model';
import { RequestMouCustDsfObj } from 'app/shared/model/req-mou-cust-dsf-obj.model';
import { ResMouMainInfoObjXDsf } from 'app/impl/shared/model/Response/MOU/ResMouMainInfoObjXDsf.model';

@Component({
  selector: 'app-mou-view-detail-x-dsf',
  templateUrl: './mou-view-detail-x-dsf.component.html',
  styleUrls: ['./mou-view-detail-x-dsf.component.css']
})
export class MouViewDetailXDsfComponent implements OnInit {

  @Input() MouCustId: number;
  @Input() MouType: string;

  MouCustClauseId: number;
  CurrCode: string;
  AssetTypeCode: string;
  MrFirstInstTypeCode: string;
  MrInterestTypeCode: string;
  MrInstTypeCode: string = "-";
  MrInstSchmCode: string;
  PayFreqCode: string;
  DownPaymentFromPrcnt: number;
  DownPaymentToPrcnt: number;
  TenorFrom: number;
  TenorTo: number;
  IsReady: boolean = false;
  VirtualAccNo:string;

  WopCode: string;
  PlafondAmt: number;
  RealisationAmt: number;
  IsRevolving: boolean;
  TopDays: number;
  InterestRatePrcnt: number;
  RetentionPrcnt: number;
  IsDisclosed: boolean;
  IsListedCust: boolean;
  MrRecourseTypeCode: string;
  MrRevolvingTypeCode: string;
  Notes: string;
  dictRevolvingTypeCode: { [id: string]: string } = {};

  mouCust: any;
  mouCustClause: any;
  mouCustFctr: any;
  OsPlatfonAmtR2: any;
  listAssetData: Array<any>;
  MrPaidByCode: string;
  SingleInstCalcMthd: string = "-";
  MouCustDlrFindData: MouCustDlrFinObj = new MouCustDlrFinObj();
  LinkSupplier: string = "-";
  dealerGrading: string;
  dealerRating: number;
  MouOsPlafond: number = 0;
  // CR Change Self Custom
  IsNewCalculation: boolean = false;
  RequestMouCustDsfObj: RequestMouCustDsfObj = new RequestMouCustDsfObj();
  ReqMouCustDsfObj: RequestMouCustDsfObj = new RequestMouCustDsfObj();
  // CR Change Self Custom

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  async ngOnInit() {

    var url: string = "";
    if(this.MouType == CommonConstant.FACTORING)
    {
      url = URLConstantX.GetMouFctrOsPlafondById;
    }else if(this.MouType == CommonConstant.DEALERFINANCING)
    {
      url = URLConstantX.GetMouDfOsPlafondByIdX;
    }

    if(this.MouType == CommonConstant.FACTORING || this.MouType == CommonConstant.DEALERFINANCING)
    {
      await this.http.post(url, {Id: this.MouCustId}).toPromise().then(
        (response) => {
          this.MouOsPlafond = response['Result'];
        }
      );
    }

    this.GetListActiveRefPayFreq();
    this.GetListKvpActiveRefCurr();
    var mouCustObj = { Id: this.MouCustId };
    this.http.post(URLConstant.GetMouCustDataByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.mouCust = response["MouCustObj"];
        this.MouCustId = this.mouCust.MouCustId;
        this.CurrCode = this.mouCust.CurrCode;
        this.PlafondAmt = this.mouCust.PlafondAmt;
        this.RealisationAmt = this.mouCust.RealisationAmt;
        this.IsRevolving = this.mouCust.IsRevolving;
        this.MouType = this.mouCust.MrMouTypeCode;
        this.MrRevolvingTypeCode = this.mouCust.MrRevolvingTypeCode;

        if (this.MouType == CommonConstant.GENERAL) {
          this.mouCustClause = response["MouCustClauseObj"];
          this.AssetTypeCode = this.mouCustClause.AssetTypeCode;
          this.MrInterestTypeCode = this.mouCustClause.InterestTypeDescr;
          this.MrFirstInstTypeCode = this.mouCustClause.MrFirstInstTypeCode;
          this.MrInstSchmCode = this.mouCustClause.MrInstSchmCode;
          this.PayFreqCode = this.mouCustClause.PayFreqCode;
          this.DownPaymentFromPrcnt = this.mouCustClause.DownPaymentFromPrcnt;
          this.DownPaymentToPrcnt = this.mouCustClause.DownPaymentToPrcnt;
          this.TenorFrom = this.mouCustClause.TenorFrom;
          this.TenorTo = this.mouCustClause.TenorTo;
        }
        else if (this.MouType == CommonConstant.FACTORING) {
          this.mouCustFctr = response["MouCustFctrObj"];
          this.AssetTypeCode = this.mouCustFctr.AssetTypeCode;
          this.MrFirstInstTypeCode = this.mouCustFctr.MrFirstInstTypeCode;
          this.MrInstTypeCode = this.mouCustFctr.InstTypeDescr;
          this.MrInstSchmCode = this.mouCustFctr.MrInstSchmCode;
          this.SingleInstCalcMthd = this.mouCustFctr.SingleInstCalcMthdDescr;
          this.MrPaidByCode = this.mouCustFctr.PaidByDescr;
          this.PayFreqCode = this.mouCustFctr.PayFreqCode;
          this.DownPaymentFromPrcnt = this.mouCustFctr.DownPaymentFromPrcnt;
          this.DownPaymentToPrcnt = this.mouCustFctr.DownPaymentToPrcnt;
          this.TenorFrom = this.mouCustFctr.TenorFrom;
          this.TenorTo = this.mouCustFctr.TenorTo;
          this.VirtualAccNo =  this.mouCustFctr.VirtualAccNo;

          this.WopCode = this.mouCustFctr.WopCode;
          this.GetRefMasterByRefMasterTypeCodeAndMasterCode(this.mouCustFctr.WopCode, "WopCode", CommonConstant.RefMasterTypeCodeWOP);
          this.TopDays = this.mouCustFctr.TopDays;
          this.InterestRatePrcnt = this.mouCustFctr.InterestRatePrcnt;
          this.RetentionPrcnt = this.mouCustFctr.RetentionPrcnt;
          this.IsListedCust = this.mouCustFctr.IsListedCust;
          this.IsDisclosed = this.mouCustFctr.IsDisclosed;
          this.MrRecourseTypeCode = this.mouCustFctr.MrRecourseTypeCode;
          this.Notes = this.mouCustFctr.Notes;

          var objVendor = {
            Code: this.mouCustFctr.VendorCode
          }
          this.http.post(URLConstant.GetVendorByVendorCode, objVendor).subscribe(
            (responseLink) => {
              this.LinkSupplier = responseLink["VendorName"]
            });

        }
        else if (this.MouType == CommonConstant.FINANCING) {
          this.http.post(URLConstant.GetMouCustDlrWithCustVendorNameFindById, mouCustObj).subscribe(
            (responses: MouCustDlrFinObj) => {
              console.log(responses)
              this.MouCustDlrFindData = responses;
              this.MouCustDlrFindData.WopCode = responses["WopCode"];
              this.MouCustDlrFindData.TopDays = responses["TopDays"];
              this.MouCustDlrFindData.TopInterestRatePrcnt = responses["TopInterestRatePrcnt"];
              this.MouCustDlrFindData.PayFreqCode = responses["PayFreqCode"];
              this.MouCustDlrFindData.InterestRatePrcnt = responses["InterestRatePrcnt"];
              this.MouCustDlrFindData.MaximumMonthsForExtend = responses["MaximumMonthsForExtend"];
              this.MouCustDlrFindData.MaximumTimesForExtends = responses["MaximumTimesForExtends"];
              this.MouCustDlrFindData.ExtendRatePrcnt = responses["ExtendRatePrcnt"];
              this.MouCustDlrFindData.SpareDayToPay = responses["SpareDayToPay"];
              this.MouCustDlrFindData.AssetCondition = responses["AssetCondition"];
              this.MouCustDlrFindData.LcRate = responses["LcRate"];
              this.MouCustDlrFindData.PrincipalPaidInExtendPrcntg = responses["PrincipalPaidInExtendPrcntg"];
              this.MouCustDlrFindData.ManufacturerCode = responses["ManufacturerCode"];
              this.MouCustDlrFindData.ManufacturerCustNo = responses["ManufacturerCustNo"];
              this.MouCustDlrFindData.DealerCode = responses["DealerCode"];
              this.MouCustDlrFindData.DealerCustNo = responses["DealerCustNo"];
              this.MouCustDlrFindData.Notes = responses["Notes"];
              this.MouCustDlrFindData.MaximumExtendTimes = responses["MaximumExtendTimes"];

              if(responses["MrInstTypeCode"] == 'MULTIPLE'){
                this.MouCustDlrFindData.PayFreqCode = this.setPayFreqMultipleInstallment(this.MouCustDlrFindData.PayFreqCode);
              }
              else{
                this.MouCustDlrFindData.PayFreqCode = this.dictRefPayFreq[this.MouCustDlrFindData.PayFreqCode];
              }

              var ObjectRefMaster = {
                RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInstType,
                MasterCode: responses["MrInstTypeCode"]
              }
              this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, ObjectRefMaster).subscribe(
                (responseRefMaster) => {
                  this.MrInstTypeCode = responseRefMaster["Descr"];
                });
              this.GetRefMasterByRefMasterTypeCodeAndMasterCode(this.MouCustDlrFindData.WopCode, "WopCode", CommonConstant.RefMasterTypeCodeWOP);
            })
        }

        if(this.mouCust.MrRevolvingTypeCode != null || this.mouCust.MrRevolvingTypeCode != ''){
          this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.MOU_REVOLVING_TYPE }).subscribe(
            (responseRefMaster: GenericKeyValueListObj) => {
              for (let index = 0; index < responseRefMaster.ReturnObject.length; index++) {
                const element = responseRefMaster.ReturnObject[index];
                this.dictRevolvingTypeCode[element.Key] = element.Value;
              }
            }
          );
        }

      })
    await this.http.post(URLConstant.GetMouCustAssetByMouCustId, mouCustObj).toPromise().then(
      (response) => {
        this.listAssetData = response[CommonConstant.ReturnObj];
      });

      //CR Change Self Custom
      await this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).toPromise().then(
        (response: any) => {
          this.MouType = response["MrMouTypeCode"];
        });

      if(this.MouType == CommonConstant.FINANCING || this.MouType == CommonConstant.FACTORING){
        await this.getDealerGrading();
      }
      // CR Change Self Custom

    this.IsReady = true;

    //   CR Self Custom Change
    if (this.MouType == "FACTORING")
      {
        this.ReqMouCustDsfObj = new RequestMouCustDsfObj();
        this.ReqMouCustDsfObj.MouCustId = this.MouCustId;
        this.ReqMouCustDsfObj.ChangeMouCustId = 0;
        await this.http.post(URLConstantDsf.CheckVendorGradingFactoringXDsf, this.ReqMouCustDsfObj).toPromise().then(
          (response) => {
              if (response["IsVendorAvailable"] && response["DealerRating"] == 0)
                {
                  this.toastr.warningMessage("Dealer Grading doesn't have in rule file");
                }
          }
        )
      }
      this.ReqMouCustDsfObj = new RequestMouCustDsfObj();
      this.ReqMouCustDsfObj.MouCustId = this.MouCustId;
      this.ReqMouCustDsfObj.ChangeMouCustId = 0;
      await this.http.post<ResMouMainInfoObjXDsf>(URLConstantDsf.GetMouMainInfoByIdXDsf, this.ReqMouCustDsfObj).toPromise().then(
        (response) => {
              this.MouOsPlafond = response.OSPlafondAmt;
        }
      )
      //   CR Self Custom Change
  }

  setPayFreqMultipleInstallment(PayFreqCode: string){
    let PayFreq =  PayFreqCode.split(';');
    for(let i = 0; i < PayFreq.length; i++){
      PayFreq[i] = this.dictRefPayFreq[PayFreq[i]]
    }
    return PayFreq.join(', ');
  }
  
  async getDealerGrading() {
    // CR Change Self Custom
    // this.http.post(URLConstantX.GetDealerGradingX, { Id: this.MouCustId }).subscribe(
    //   (response) => {
    //     this.dealerGrading = response['DealerGrading'];
    //     this.dealerRating = response['DealerRating'];
    //   });

    this.RequestMouCustDsfObj = new RequestMouCustDsfObj();
    this.RequestMouCustDsfObj.MouCustId = this.MouCustId;
    this.RequestMouCustDsfObj.ChangeMouCustId = 0;
    await this.http.post<ReqMouCustDsfObj>(URLConstantDsf.GetMouCustXDsf, this.RequestMouCustDsfObj).toPromise().then(
      (response) => {
          
        this.dealerGrading = response.DealerGrading;
        this.dealerRating = response.DealerGradingMultiplier;
        this.IsNewCalculation = response.IsNewCalculation;
      });
    // CR Change Self Custom
  }

  dictMasterCode: { [id: string]: string } = {};
  GetRefMasterByRefMasterTypeCodeAndMasterCode(masterCode: string, typeVar: string, refMasterTypeCode: string) {
    var ObjectRefMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
      RefMasterTypeCode: refMasterTypeCode,
      MasterCode: masterCode
    }
    this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, ObjectRefMaster).subscribe(
      (responseRefMaster) => {
        this.dictMasterCode[typeVar] = responseRefMaster["Descr"];
      });
  }

  dictRefPayFreq: { [id: string]: string } = {};
  GetListActiveRefPayFreq() {
    this.http.post(URLConstant.GetListActiveRefPayFreq, null).subscribe(
      (response: GenericListObj) => {
        for (let index = 0; index < response.ReturnObject.length; index++) {
          const element = response.ReturnObject[index];
          this.dictRefPayFreq[element.PayFreqCode] = element.Descr;
        }
      }
    );
  }

  dictRefCurr: { [id: string]: string } = {};
  GetListKvpActiveRefCurr() {
    this.http.post(URLConstant.GetListKvpActiveRefCurr, null).subscribe(
      (response: GenericKeyValueListObj) => {
        for (let index = 0; index < response.ReturnObject.length; index++) {
          const element = response.ReturnObject[index];
          this.dictRefCurr[element.Key] = element.Value;
        }
      }
    );
  }

  ClickLinkManufacturer(vendorCode: string) {
    this.http.post(URLConstant.GetVendorByVendorCode, { Code: vendorCode }).subscribe(
      (responseLink: VendorObj) => {
        console.log(responseLink);
        AdInsHelper.OpenVendorBranchViewByVendorId(responseLink.VendorId);
      });
  }

  MouDataForm = this.fb.group({
  })

  AssetDataForm = this.fb.group({
  })

}
