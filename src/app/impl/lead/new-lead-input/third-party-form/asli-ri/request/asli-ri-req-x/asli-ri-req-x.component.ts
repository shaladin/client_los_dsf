import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReqAddTrxSrcDataForAsliRIXObj } from 'app/impl/shared/model/asli-ri/req-add-trx-src-data-for-asli-ri-x-obj.model';
import { CustDocFileFormXObj } from 'app/impl/shared/model/cust-doc-file/cust-doc-file-form-x-obj.model';
import { CustObj } from 'app/shared/model/cust-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-asli-ri-req-x',
  templateUrl: './asli-ri-req-x.component.html',
  styleUrls: []
})
export class AsliRiReqXComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
    private http: HttpClient) { }

  @Input() parentForm: FormGroup;
  @Input() MrCustTypeCode: string;
  @Input() custObj: CustObj;
  @Input() custDocFileFormObj: CustDocFileFormXObj;
  @Input() AsliRIFormInput: FormGroup;
  @Input() height: number;
  @Input() width: number;
  @Input() url: any;
  @Output() nextConfirm = new EventEmitter<boolean>();
  @Output() reqAddTrxSrcDataForAsliRIObjOutput = new EventEmitter<ReqAddTrxSrcDataForAsliRIXObj>();
  parent: any;
  Addr: any;
  address: string;
  MrCustModelName: any;
  IDType: any;
  reqAddTrxSrcDataForAsliRIObj: ReqAddTrxSrcDataForAsliRIXObj;
  isSelfieValid: boolean = true;
  isSelfieAvailable: boolean = false;
  isPhoneAgeVerification: boolean = false;
  isTaxExtraVerification: boolean = false;
  isTaxCompanyVerification: boolean = false;
  isWorkplaceVerification: boolean = false;
  isReady: boolean = false;
  key: string;
  isIncomeGradeVerification: boolean = false
  isProfessionalVerification: boolean = false;
  
  AsliRIForm: FormGroup = this.fb.group({
    MonthlyIncome: [0],
    AnnualRevenue: [0],
    NPWPCompany: ['', [Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
    CompanyName: [''],
    CompanyPhone: ['']
  });

  async ngOnInit() {
    this.reqAddTrxSrcDataForAsliRIObj = new ReqAddTrxSrcDataForAsliRIXObj();
    this.parent = this.parentForm.getRawValue();
    if(this.parent != null && this.parent != undefined && this.MrCustTypeCode == CommonConstant.CustTypePersonal){
      this.parent.MobilePhnNo1 = this.formatPhoneNumber08To628(this.parent.MobilePhone1);
    }
    this.Addr = this.parentForm.controls.legalAddress.value;
    this.address = this.Addr.Addr + " RT/RW " + this.Addr.AreaCode4 + "/" + this.Addr.AreaCode3 + " " + this.Addr.AreaCode2 + " " + this.Addr.AreaCode1 + " " + this.Addr.City;

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.key = "ASLIRI-" + this.parent.IdNo
    }
    else {
      this.key = "ASLIRI-" + this.parent.TaxIdNo
    }

    if (localStorage.getItem(this.key) != null) {
      this.reqAddTrxSrcDataForAsliRIObj = JSON.parse(AdInsHelper.GetLocalStorage(this.key))
    }

    this.CheckValidationSubsection()
    this.CheckValidationSelfie()

    await this.http.post(URLConstant.GetRefMasterByMasterCode, { Code: this.parent.MrCustModelCode }).toPromise().then(
      (res: any) => {
        this.MrCustModelName = res.Descr;
      })

    if (this.parent.MrIdTypeCode != null) {
      await this.http.post(URLConstant.GetRefMasterByMasterCode, { Code: this.parent.MrIdTypeCode }).toPromise().then(
        (res: any) => {
          this.IDType = res.Descr;
        })
    }

    this.isReady = true;
  }
  listAvailableReqVerificationType : Array<KeyValueObj> = [];
  async CheckValidationSubsection() {
    await this.http.post(URLConstantX.GetListReqVerificationTypeForAsliRi, {}).toPromise().then(
      (res: Array<KeyValueObj>) => {
        this.listAvailableReqVerificationType = res;
    })
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal && this.parent.MrIdTypeCode == CommonConstant.MrIdTypeCodeEKTP) {
      this.isProfessionalVerification = (this.listAvailableReqVerificationType.findIndex(x => x.Key == CommonConstantX.ASLI_RI_PROF) > -1);
      this.isPhoneAgeVerification = (this.listAvailableReqVerificationType.findIndex(x => x.Key == CommonConstantX.ASLI_RI_PHN_AGE) > -1);
      this.isTaxExtraVerification = (this.listAvailableReqVerificationType.findIndex(x => x.Key == CommonConstantX.ASLI_RI_TAX_EXTRA) > -1);
      this.isWorkplaceVerification = (this.listAvailableReqVerificationType.findIndex(x => x.Key == CommonConstantX.ASLI_RI_WORKPLACE) > -1);
      this.isIncomeGradeVerification = (this.listAvailableReqVerificationType.findIndex(x => x.Key == CommonConstantX.ASLI_RI_INCOME_GRADE) > -1);

      this.AsliRIForm.patchValue({
        MonthlyIncome: this.reqAddTrxSrcDataForAsliRIObj.MonthlyIncome,
        CompanyName: this.reqAddTrxSrcDataForAsliRIObj.CompanyName,
        CompanyPhone: this.reqAddTrxSrcDataForAsliRIObj.CompanyPhone
      })
    }

    if ((this.MrCustTypeCode == CommonConstant.CustTypePersonal && this.parent.MrCustModelCode == CommonConstantX.CUST_MODEL_SME) || this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      this.isTaxCompanyVerification = true;

      if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
        this.AsliRIForm.patchValue({
          NPWPCompany: this.reqAddTrxSrcDataForAsliRIObj.NpwpCompany != '' ? this.reqAddTrxSrcDataForAsliRIObj.NpwpCompany : this.parent.TaxIdNo,
          AnnualRevenue: this.reqAddTrxSrcDataForAsliRIObj.AnnualRevenue
        })
      }
      else {
        this.AsliRIForm.patchValue({
          NPWPCompany: this.reqAddTrxSrcDataForAsliRIObj.NpwpCompany,
          AnnualRevenue: this.reqAddTrxSrcDataForAsliRIObj.AnnualRevenue
        })
      }
    }
  }

  CheckValidationSelfie() {
    if (this.custDocFileFormObj == null || this.custDocFileFormObj.File == null) {
      this.isSelfieValid = true;
      this.isSelfieAvailable = false;
      return
    }

    let size: number = this.ConvertSize(this.custDocFileFormObj.File.size);
    if (size > 30 && size < 500 && this.width >= 400 && this.height >= 400) {
      this.isSelfieValid = true;
      this.isSelfieAvailable = true;
    }
    else {
      this.isSelfieValid = false;
    }
  }

  ConvertSize(fileSize: number) {
    return fileSize / 1024
  }

  patchObj() {
    this.reqAddTrxSrcDataForAsliRIObj = new ReqAddTrxSrcDataForAsliRIXObj();
    this.reqAddTrxSrcDataForAsliRIObj.CustType = this.MrCustTypeCode;
    this.reqAddTrxSrcDataForAsliRIObj.CustNo = this.custObj.CustNo;
    this.reqAddTrxSrcDataForAsliRIObj.CustName = this.parent.CustName;
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.reqAddTrxSrcDataForAsliRIObj.IdNo = this.parent.IdNo;
      this.reqAddTrxSrcDataForAsliRIObj.Phone = this.parent.MobilePhnNo1;
      if (this.parent.MrIdTypeCode == CommonConstant.MrIdTypeCodeEKTP) {
        this.reqAddTrxSrcDataForAsliRIObj.Nik = this.parent.IdNo,
          this.reqAddTrxSrcDataForAsliRIObj.NpwpPersonal = this.parent.TaxIdNo;
      }
    }
    else {
      this.reqAddTrxSrcDataForAsliRIObj.IdNo = this.parent.TaxIdNo;
    }
    this.reqAddTrxSrcDataForAsliRIObj.Address = this.address;
    this.parent.BirthDt ? this.reqAddTrxSrcDataForAsliRIObj.BirthDt = this.parent.BirthDt : this.reqAddTrxSrcDataForAsliRIObj.BirthDt = null;
    this.parent.BirthPlace ? this.reqAddTrxSrcDataForAsliRIObj.BirthPlace = this.parent.BirthPlace : this.reqAddTrxSrcDataForAsliRIObj.BirthPlace = "";
    this.reqAddTrxSrcDataForAsliRIObj.CompanyName = this.AsliRIForm.controls.CompanyName.value;
    this.reqAddTrxSrcDataForAsliRIObj.CompanyPhone = this.AsliRIForm.controls.CompanyPhone.value;
    this.reqAddTrxSrcDataForAsliRIObj.MonthlyIncome = this.AsliRIForm.controls.MonthlyIncome.value;
    this.reqAddTrxSrcDataForAsliRIObj.NpwpCompany = this.AsliRIForm.controls.NPWPCompany.value;
    this.reqAddTrxSrcDataForAsliRIObj.AnnualRevenue = this.AsliRIForm.controls.AnnualRevenue.value;

    this.isPhoneAgeVerification ? this.reqAddTrxSrcDataForAsliRIObj.ListReqVerificationType.push(CommonConstantX.ASLI_RI_PHN_AGE) : null;
    if (this.isTaxExtraVerification && this.parent.TaxIdNo != "" && this.AsliRIForm.controls.MonthlyIncome.value != 0) {
      this.reqAddTrxSrcDataForAsliRIObj.ListReqVerificationType.push(CommonConstantX.ASLI_RI_TAX_EXTRA)
    }
    if (this.isTaxCompanyVerification && this.AsliRIForm.controls.NPWPCompany.value != '' && this.AsliRIForm.controls.AnnualRevenue.value != 0) {
      this.reqAddTrxSrcDataForAsliRIObj.ListReqVerificationType.push(CommonConstantX.ASLI_RI_TAX_COY)
    }
    if (this.isWorkplaceVerification && this.AsliRIForm.controls.CompanyName.value != '' && this.AsliRIForm.controls.CompanyPhone.value != '') {
      this.reqAddTrxSrcDataForAsliRIObj.ListReqVerificationType.push(CommonConstantX.ASLI_RI_WORKPLACE)
    }
    
    if(this.isIncomeGradeVerification && this.parent.TaxIdNo != "" && this.parent.IdNo != "")
    {
      this.reqAddTrxSrcDataForAsliRIObj.ListReqVerificationType.push(CommonConstantX.ASLI_RI_INCOME_GRADE)
    }
  }

  next() {
    this.patchObj()
    AdInsHelper.SetLocalStorage(this.key, JSON.stringify(this.reqAddTrxSrcDataForAsliRIObj));
    this.nextConfirm.emit(true)
    this.reqAddTrxSrcDataForAsliRIObjOutput.emit(this.reqAddTrxSrcDataForAsliRIObj)
  }

  cancel() {
    this.activeModal.dismiss('Cross click')
  }

  formatPhoneNumber08To628(phoneNumber: string) {
    let phoneNumberArr: string[] = phoneNumber.split("")
    if (phoneNumberArr[0] === '0') {
      phoneNumberArr[0] = '62'
    }else if(phoneNumberArr[0] === '6' && phoneNumberArr[1] !== '2'){
      phoneNumberArr[0] = '62' + phoneNumberArr[0]
    }
    
    phoneNumber = ''
    phoneNumberArr.forEach(number => {
      phoneNumber += number
    });
    return phoneNumber
  }
}
