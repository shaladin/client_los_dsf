import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqPersonalXObj } from 'app/impl/shared/model/new-cust/req-personal-x-obj.model';
import { ReqCoyXObj } from 'app/impl/shared/model/new-cust/req-coy-x-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeXObj } from 'app/impl/shared/model/ref-master/req-ref-master-by-type-code-and-master-cod-x-obj.model';
import { CustXObj } from 'app/impl/shared/model/cust-x-obj.model';
import { CustPersonalObj } from 'app/shared/model/cust-personal-obj.model';
import { ReqUploadConsentTsXObj } from 'app/impl/shared/model/third-party-rslt/req-upload-consent-ts-x-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ThirdPartyRsltHXObj } from 'app/impl/shared/model/third-party-rslt/third-party-rslt-h-x-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { String, StringBuilder } from 'typescript-string-operations';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResGenerateTrxNoXObj } from 'app/impl/shared/model/master-sequence/res-generate-trx-no-x-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { ReqGenerateTrxNoXObj } from 'app/impl/shared/model/master-sequence/req-generate-trx-no-x-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { ExceptionConstantX } from 'app/impl/shared/constant/ExceptionConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';


@Component({
  selector: 'app-trusting-social-req-consent-x',
  templateUrl: './trusting-social-req-consent-x.component.html',
  styleUrls: ['./trusting-social-req-consent-x.component.css'],
})
export class TrustingSocialReqConsentXComponent implements OnInit {
  @Input() CustObj: CustXObj;
  @Input() CustPersonalObj: CustPersonalObj;
  @Output() outUpload: EventEmitter<ThirdPartyRsltHXObj> = new EventEmitter();
  @Output() outCustObj: EventEmitter<CustXObj> = new EventEmitter();


  readonly CustTypePersonal: string = CommonConstantX.CustomerPersonal;
  readonly FileExtAllowed: Array<string> = [CommonConstantX.FileExtensionDoc, CommonConstantX.FileExtensionDocx, CommonConstantX.FileExtensionPdf]

  CustTypeName: string;
  FPP : string; 
  FileToUpload: File;
  Consent: any;
  businessDt: Date;
  ConsentForm = this.fb.group({
    Consent: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal,
    private toastr: NGXToastrService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.getCustTypeDescr();
  }

  getCustTypeDescr(){
    var refMasterObj = new ReqRefMasterByTypeCodeAndMasterCodeXObj();
    refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustType;
    refMasterObj.MasterCode = this.CustObj.MrCustTypeCode;
    this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, refMasterObj).subscribe(
      (response) => {
        this.CustTypeName = response["Descr"];
      }
    );
  }

  async UploadConsent(){
    await this.checkThirdPartyTrxNo();

    var lastDotIndex = this.FileToUpload.name.lastIndexOf('.');
    var ext = "." + this.FileToUpload.name.substring(lastDotIndex + 1);

    var extValid = this.FileExtAllowed.find(x => x == ext);

    if(extValid == undefined){
      var listExtStr = String.Join(", ", this.FileExtAllowed);
      this.toastr.warningMessage(String.Format(ExceptionConstantX.INVALID_FILE_FORMAT, listExtStr));
      return;
    }

    var reqUploadConsentTsObj = new ReqUploadConsentTsXObj();
    reqUploadConsentTsObj.TrxNo = this.CustObj.ThirdPartyTrxNo;
    reqUploadConsentTsObj.CustName = this.CustObj.CustName;
    reqUploadConsentTsObj.IdType = this.CustObj.MrIdTypeCode;
    reqUploadConsentTsObj.IdNo = this.CustObj.IdNo;
    
    if(this.CustObj.MrCustTypeCode == CommonConstantX.MR_CUST_TYPE_CODE_PERSONAL){
      reqUploadConsentTsObj.MobilePhnNo = this.CustPersonalObj.MobilePhnNo1;
    }

    if (this.CustObj.CustNo == "") {
      this.FPP = this.CustObj.ThirdPartyTrxNo; 
    } else {
      this.FPP = this.CustObj.CustNo; 
    }

    var month = ("0" + (this.businessDt.getMonth() + 1)).slice(-2);
    var date = ("0" + this.businessDt.getDate()).slice(-2);

    reqUploadConsentTsObj.FileName = 'CONSENT_' + date + month + this.businessDt.getFullYear() + '_' + this.CustPersonalObj.MobilePhnNo1 + '_' + this.FPP + ext; 
    //reqUploadConsentTsObj.FileName = this.FileToUpload.name;
    let reader = new FileReader();
    reader.readAsDataURL(this.FileToUpload);
    reader.onload = () => {
      reqUploadConsentTsObj.ConsentBase64 = reader.result;
      reqUploadConsentTsObj.ConsentBase64 = reqUploadConsentTsObj.ConsentBase64.substring(reqUploadConsentTsObj.ConsentBase64.lastIndexOf(',') + 1)
      this.uploadDocFileMultipart(reqUploadConsentTsObj);
    }
    //this.cookieService.put('reqSocial', 'done');
    //SET COOKIE HERE
  }

  HandleFileInput(files: FileList){
    this.FileToUpload = files.item(0);
  }

  ConvertSize(fileSize: number) {
    return fileSize < 1024000
      ? (fileSize / 1024).toFixed(2) + ' KB'
      : (fileSize / 1024000).toFixed(2) + ' MB';
  }

  async uploadDocFileMultipart(objDoc: ReqUploadConsentTsXObj)
  {
    if (environment.SpinnerOnHttpPost) this.spinner.show();

    var formData: any = new FormData();

    Object.keys(objDoc).forEach(key => {
      formData.append(key, objDoc[key]);
    });

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = evnt => {
      if (xhr.readyState !== 4) return;

      if (environment.SpinnerOnHttpPost) this.spinner.hide();
      if (xhr.status !== 200 && xhr.status !== 201) {
        this.toastr.errorMessage('Upload Failed !');
        return;
      }
      else {
        var response = JSON.parse(xhr.response);
        if (response.HeaderObj.StatusCode != '200') {
          this.toastr.errorMessage('Upload Failed ! '+  + response.HeaderObj.Message);
          return
        }
      }

      if (xhr.status === 200) {
        this.saveThirdPartyTrxNo();
        this.toastr.successMessage(response["Message"]);
        this.outUpload.emit(response);
        return;
      }
    };

    xhr.onerror = evnt => {
      this.toastr.errorMessage('Upload Failed !');
      return;
    };
    xhr.open('POST', URLConstantX.UploadConsentTrustingSocialV21, true);
    let value = this.cookieService.get('XSRF-TOKEN');
    let token = this.DecryptString(value, environment.ChipperKeyCookie);
    xhr.setRequestHeader('AdInsKey', `${token}`);
    xhr.send(formData);
  }

  private DecryptString(chipperText: string, chipperKey: string) {
    if (
      chipperKey == undefined || chipperKey.trim() == '' ||
      chipperText == undefined || chipperText.trim() == ''
    ) return chipperText;
    var chipperKeyArr = CryptoJS.enc.Utf8.parse(chipperKey);
    var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    var decrypted = CryptoJS.AES.decrypt(chipperText, chipperKeyArr, { iv: iv });
    var plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText;
  }

  async checkThirdPartyTrxNo() {
    if (this.CustObj.ThirdPartyTrxNo == null || this.CustObj.ThirdPartyTrxNo == "") {
      let context: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
      let officeCode = context[CommonConstant.OFFICE_CODE];

      var reqGenerateTrxNoObj = new ReqGenerateTrxNoXObj();
      reqGenerateTrxNoObj.MasterSeqCode = CommonConstantX.MasterSequenceCodeCustomerThirdParty;
      reqGenerateTrxNoObj.OfficeCode = officeCode;

      await this.http.post(URLConstantX.GenerateTransactionNoFromRedis, reqGenerateTrxNoObj).toPromise().then(
        (response: ResGenerateTrxNoXObj) => {
          this.CustObj.ThirdPartyTrxNo = response.TrxNo;
        }
      );
    }
  }

  async saveThirdPartyTrxNo() {
    if (!this.CustObj.CustId)
    {
      this.outCustObj.emit(this.CustObj)
      return;
    }

    let reqByIdAndCode: GenericObj = new GenericObj();
    reqByIdAndCode.Id = this.CustObj.CustId;
    reqByIdAndCode.Code = this.CustObj.ThirdPartyTrxNo;
    reqByIdAndCode.RowVersion = this.CustObj.RowVersion;

    await this.http.post(URLConstantX.SaveCustThirdPartyTrxNo, reqByIdAndCode).toPromise().then(
      response => {
        this.CustObj.RowVersion = response["RowVersion"]
        this.outCustObj.emit(this.CustObj)
      }
    )
  }
}
