import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReqAddTrxSrcDataForAsliRIXObj } from 'app/impl/shared/model/asli-ri/req-add-trx-src-data-for-asli-ri-x-obj.model';
import { CustDocFileFormXObj } from 'app/impl/shared/model/cust-doc-file/cust-doc-file-form-x-obj.model';
import { CustDocFileXObj } from 'app/impl/shared/model/cust-doc-file/cust-doc-file-x-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { NgxSpinnerService } from 'ngx-spinner';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';

@Component({
  selector: 'app-asli-ri-req-confirmation-x',
  templateUrl: './asli-ri-req-confirmation-x.component.html',
  styleUrls: []
})
export class AsliRiReqConfirmationXComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private toastr: NGXToastrService,
              private http: HttpClient, private spinner: NgxSpinnerService,
              private cookieService: CookieService) { }

  @Input() isPhoneAgeVerifValid: boolean;
  @Input() isHomeAddressPercentageVerifValid: boolean;
  @Input() AsliRIForm: FormGroup;
  @Input() custDocFileFormObj: CustDocFileFormXObj;
  @Output() nextConfirm = new EventEmitter<boolean>();
  @Input() reqAddTrxSrcDataForAsliRIObjInput: ReqAddTrxSrcDataForAsliRIXObj;
  custDocFileObj: CustDocFileXObj;
  isProfessionalVerifValid: boolean = false;
  isTaxExtraVerifValid: boolean = false;
  isTaxCompanyVerifValid: boolean = false;
  isWorkplaceVerifValid: boolean = false;
  isReady: boolean = true;

  async ngOnInit() {
    if(this.custDocFileFormObj != undefined)
    {
      await this.ConvertToCustDocFileObj(this.custDocFileFormObj)
    }
  }

  async ConvertToCustDocFileObj(custDocFileFormObj: CustDocFileFormXObj){
    if(custDocFileFormObj.File != null){
      var custDocFileObj = new CustDocFileXObj();
      custDocFileObj.MrCustDocTypeCode = custDocFileFormObj.MrCustDocTypeCode;
      custDocFileObj.FileName = custDocFileFormObj.File.name;
      custDocFileObj.ByteBase64 = await this.readFileAsDataURL(custDocFileFormObj.File);
      custDocFileObj.ByteBase64 = custDocFileObj.ByteBase64.substring(custDocFileObj.ByteBase64.lastIndexOf(',') + 1)
      this.reqAddTrxSrcDataForAsliRIObjInput.SelfiePhoto = custDocFileObj.ByteBase64
    }
  }

  async readFileAsDataURL(file) {
    let result_base64 = await new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = (e) => resolve(reader.result);
        reader.readAsDataURL(file);
    });
    return result_base64;
  } 

  save()
  {
    this.uploadDocFileMultipart(this.reqAddTrxSrcDataForAsliRIObjInput)
    //set cookie here
    AdInsHelper.SetCookie(this.cookieService, CommonConstantX.REQ_ASLIRI, "done");
  }

  uploadDocFileMultipart(reqAddTrxSrcDataForAsliRIObj: ReqAddTrxSrcDataForAsliRIXObj)
  {
    if (environment.SpinnerOnHttpPost) this.spinner.show();

    var formData: any = new FormData();

    Object.keys(reqAddTrxSrcDataForAsliRIObj).forEach(key => {
      formData.append(key, reqAddTrxSrcDataForAsliRIObj[key]);
    });

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = evnt => {
      if (xhr.readyState !== 4) return;

      if (environment.SpinnerOnHttpPost) this.spinner.hide();
      if (xhr.status !== 200 && xhr.status !== 201) {
        this.toastr.errorMessage('Save Failed !');
        return;
      }
      else {
        var response = JSON.parse(xhr.response);
        if (response.HeaderObj.StatusCode != '200') {
          this.toastr.errorMessage(response.HeaderObj.Message);
          return
        }
      }

      if (xhr.status === 200) {
        this.toastr.successMessage(response["Message"]);
        this.activeModal.dismiss('Cross click')
        return;
      }
    };

    xhr.onerror = evnt => {
      this.toastr.errorMessage('Upload Failed !');
      return;
    };
    xhr.open('POST', URLConstantX.AddTrxScrDataForAsliRi, true);
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

  async back()
  {
    this.nextConfirm.emit(false)
  }

}
