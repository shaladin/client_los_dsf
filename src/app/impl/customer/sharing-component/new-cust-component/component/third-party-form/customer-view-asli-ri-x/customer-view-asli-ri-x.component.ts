import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CustXObj } from 'app/impl/shared/model/cust-x-obj.model';

@Component({
  selector: 'app-customer-view-asli-ri-x',
  templateUrl: './customer-view-asli-ri-x.component.html'
})
export class CustomerViewAsliRiXComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['CustId'] != null) {
        this.CustId = params['CustId'];
      }
      if (params['CustNo'] != null) {
        this.CustNo = params['CustNo'];
      }
      if (params["IsEmbedded"] != null && params["Token"] != null) {
        const embeddHeaders = new HttpHeaders({
          'AdInsKey': params["Token"]
        });
        this.EmbeddOptions = { headers: embeddHeaders, withCredentials: true };
      }
    });
  }
  @Input() InputCustObj: CustXObj;
  @Input() parentForm: FormGroup;
  @Input() ActiveModal: NgbActiveModal;
  @Input() MrCustTypeCode: string;

  CustId: string = null;
  CustNo: string = null;
  custObj: CustXObj = new CustXObj();
  code: string;
  MrCustModelName: string;
  IDType: string;
  DataAsliRi: any;
  isReady: boolean = false;
  img: any;
  url: string;
  EmbeddOptions: object;

  isVisibleForTaxPersonalVerification: boolean = false;
  isFailedGetDataAsliRI: boolean = false;
  isGetIncomeGradeRange: boolean = false;
  isIncomeRangeSuccess: boolean = false;
  isRequestDtNull: boolean = true

  // REGION Variables of Income Grade Verification
  GradeIncome: number = 0;  // didapat dari API yang dibuat Tim Product
  IncomeRangeFrom: number = 0;
  IncomeRangeTo: number = 0;
  IsUseFromOnly: boolean = false;
  // END REGION

  async ngOnInit() {

    await this.GetDataCustObj()

    if (this.custObj.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.code = ""
      if (this.custObj.MrIdTypeCode == CommonConstant.MrIdTypeCodeEKTP) {
        this.code = this.custObj.IdNo
      }
    }
    else {
      this.code = this.custObj.TaxIdNo
    }

    await this.http.post(URLConstant.GetRefMasterByMasterCode, {Code : this.custObj.MrCustModelCode}, this.EmbeddOptions).toPromise().then(
      (res: any) => {
        this.MrCustModelName = res.Descr;
      })

    if (this.custObj.MrIdTypeCode != null) {
      await this.http.post(URLConstant.GetRefMasterByMasterCode, {Code : this.custObj.MrIdTypeCode}, this.EmbeddOptions).toPromise().then(
        (res: any) => {
          this.IDType = res.Descr;
        })
    }

    await this.GetData()
    if(this.custObj.MrCustTypeCode == CommonConstant.CustTypePersonal){
      await this.GetDataIncomeGradeRange();
    }
    this.isReady = true;

    await this.convertImage()
  }

  async GetDataIncomeGradeRange() {
    this.isGetIncomeGradeRange = true
    await this.http.post(URLConstantX.GetIncomeGradeRange, { GradeIncome: this.GradeIncome }).toPromise().then(
      (response: { IncomeRangeFrom: number, IncomeRangeTo: number, IsUseFromOnly: boolean }) => {
        if (response !== undefined) {
          this.isIncomeRangeSuccess = true;
          this.IncomeRangeFrom = response.IncomeRangeFrom
          this.IncomeRangeTo = response.IncomeRangeTo
          this.IsUseFromOnly = response.IsUseFromOnly
        }else{
          this.isIncomeRangeSuccess = false;
        }
      }
    );
  }

  async GetDataCustObj() {
    if (typeof this.InputCustObj != "undefined" && this.InputCustObj.CustId != 0) {
      this.custObj = this.InputCustObj;
      return;
    }
    if (this.CustId != null) {
      await this.http.post(URLConstant.GetCustByCustId, { Id: this.CustId }, this.EmbeddOptions).toPromise().then(
        (response: CustXObj) => {
          this.custObj = response;
        }
      );
    }
    else if (this.CustNo != null) {
      await this.http.post(URLConstant.GetCustByCustNo, { CustNo: this.CustNo }, this.EmbeddOptions).toPromise().then(
        (response: CustXObj) => {
          this.custObj = response;
        }
      );
    }
    else {
      this.custObj.MrCustTypeCode = this.MrCustTypeCode;
      this.custObj.CustName = this.parentForm != undefined && this.parentForm != null ? this.parentForm.controls.CustName.value : "";
      //this.custObj.MrCustModelCode= "PERSONAL",
      //this.custObj.MrCustModelCode= this.parentForm.controls.MrCustModelCode.value ? this.parentForm.controls.MrCustModelCode.value : "",
      this.custObj.MrCustModelCode = this.parentForm != undefined && this.parentForm != null ? this.parentForm.controls.CustType.value : "";
      this.custObj.TaxIdNo = this.parentForm != undefined && this.parentForm != null ? this.parentForm.controls.IdNo.value : "";
      if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
        this.custObj.MrIdTypeCode = this.parentForm.controls.MrIdTypeCode.value;
        this.custObj.IdNo = this.parentForm.controls.IdNo.value;
      }
      else {
        this.custObj.MrIdTypeCode = CommonConstant.MrIdTypeCodeNPWP;
        this.custObj.IdNo = this.parentForm != undefined && this.parentForm != null ? this.parentForm.controls.TaxIdNo.value : "";
      }
    }
  }

  IsOkAsliRiPhnAge: boolean = true;
  IsOkAsliRiHomeAddr: boolean = true;
  IsOkAsliRiIncomeGrade: boolean = true;
  IsOkAsliRiWorkplace: boolean = true;
  async GetData() {
    await this.http.post(URLConstantX.GetTrxSrcDataForAsliRi, {Code: this.code}, this.EmbeddOptions).toPromise().then(
      (res: any) => {
        if(res !== undefined){
          this.isFailedGetDataAsliRI = false;
          this.DataAsliRi = res;
          if(this.DataAsliRi.RequestDt != null){
            this.isRequestDtNull = false
          }
          
          if(res.ResAsliRiObj != undefined && res.ResAsliRiObj != null){
            if(res.ResAsliRiObj.IncomeGradeGrade != undefined && res.ResAsliRiObj.IncomeGradeGrade != null){
              this.GradeIncome = res.ResAsliRiObj.IncomeGradeGrade
            }
          }

          if(this.DataAsliRi.ResAsliRiStatusCodeObj != undefined && this.DataAsliRi.ResAsliRiStatusCodeObj != null){
            let statusCode = this.DataAsliRi.ResAsliRiStatusCodeObj
            
            if(this.DataAsliRi.ReqAsliRiObj.ListReqVerificationType.includes('ASLIRI_PHN_AGE') && typeof statusCode.ASLIRI_PHN_AGE != undefined){
              if(statusCode.ASLIRI_PHN_AGE != 200){
                this.IsOkAsliRiPhnAge = false;
              }
            }else{
              this.IsOkAsliRiPhnAge = false;
            }
            if(this.DataAsliRi.ReqAsliRiObj.ListReqVerificationType.includes('ASLIRI_HOME_ADDR') && typeof statusCode.ASLIRI_HOME_ADDR != undefined){
              if(statusCode.ASLIRI_HOME_ADDR != 200){
                this.IsOkAsliRiHomeAddr = false;
              }
            }else{
              this.IsOkAsliRiHomeAddr = false;
            }
            if(this.DataAsliRi.ReqAsliRiObj.ListReqVerificationType.includes('ASLIRI_WORKPLACE') && typeof statusCode.ASLIRI_WORKPLACE != undefined){
              if(statusCode.ASLIRI_WORKPLACE != 200){
                this.IsOkAsliRiWorkplace = false;
              }
            }else{
              this.IsOkAsliRiWorkplace = false;
            }
            if(this.DataAsliRi.ReqAsliRiObj.ListReqVerificationType.includes('ASLIRI_INCOME_GRADE') && typeof statusCode.ASLIRI_INCOME_GRADE != undefined){
              if(statusCode.ASLIRI_INCOME_GRADE != 200){
                this.IsOkAsliRiIncomeGrade = false;
              }
            }else{
              this.IsOkAsliRiIncomeGrade = false;
            }
          }
        }
      })
  }

  async convertImage() {
    if (!this.DataAsliRi || !this.DataAsliRi.ReqAsliRiObj || !this.DataAsliRi.ReqAsliRiObj.SelfiePhoto) return;
    this.url = "data:image/jpg|jpeg|png|bmp;base64"
    this.img = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.url}, ${this.DataAsliRi.ReqAsliRiObj.SelfiePhoto}`);
  }
}