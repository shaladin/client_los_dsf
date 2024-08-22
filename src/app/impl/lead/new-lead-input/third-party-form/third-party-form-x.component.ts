import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CustXObj } from 'app/impl/shared/model/cust-x-obj.model';
import { CustPersonalObj } from 'app/shared/model/cust-personal-obj.model';
import { ReqPefindoSmartSearchXObj } from 'app/impl/shared/model/digitalization/req-pefindo-smart-search-x-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqGenerateTrxNoXObj } from 'app/impl/shared/model/master-sequence/req-generate-trx-no-x-obj.model';
import { ResGenerateTrxNoXObj } from 'app/impl/shared/model/master-sequence/res-generate-trx-no-x-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { CookieService } from 'ngx-cookie';
import { String } from 'typescript-string-operations';
import { CustDocFileFormXObj } from 'app/impl/shared/model/cust-doc-file/cust-doc-file-form-x-obj.model';
import { CustDocFileXObj } from 'app/impl/shared/model/cust-doc-file/cust-doc-file-x-obj.model';
import { ResSysConfigResultXObj } from 'app/impl/shared/model/Response/res-sys-config-result-x-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ThirdPartyUploadXService } from 'app/impl/customer/sharing-component/new-cust-component/component/third-party-form/services/ThirdPartyUploadX.Service';
import { PefindoReqXComponent } from 'app/impl/customer/sharing-component/new-cust-component/component/third-party-form/pefindo/request/pefindo-req-x.component';
import { TrustingSocialReqHeaderXComponent } from 'app/impl/customer/sharing-component/new-cust-component/component/third-party-form/trusting-social/request/trusting-social-req-header-x.component';
import { TrustingSocialViewHeaderXComponent } from 'app/impl/customer/sharing-component/new-cust-component/component/third-party-form/trusting-social/view/trusting-social-view-header-x.component';
import { AsliRiViewXComponent } from 'app/impl/customer/sharing-component/new-cust-component/component/third-party-form/asli-ri/view/asli-ri-view-x/asli-ri-view-x.component';
import { ReqCustDocFileXObj } from 'app/impl/shared/model/cust-doc-file/req-cust-doc-file-x-obj.model';
import { AsliRiReqHeaderXComponent } from './asli-ri/request/asli-ri-req-header-x.component';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ReqPefindoSmartSearchV2XObj } from 'app/impl/shared/model/digitalization/req-pefindo-smart-search-v2-x-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { ExceptionConstantX } from 'app/impl/shared/constant/ExceptionConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-third-party-form-x',
  templateUrl: './third-party-form-x.component.html',
  styleUrls: ['./third-party-form-x.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ThirdPartyFormXComponent implements OnInit {

  constructor(private toastr: NGXToastrService,
    private http: HttpClient, private fb: FormBuilder,
    private cookieService: CookieService, private modalService: NgbModal,
    private thirdPartyUploadService: ThirdPartyUploadXService) {
  }

  @Input() parentForm: FormGroup;
  @Input() thirdPartyTrxNo: string = null;
  @Input() custObj: CustXObj = new CustXObj();
  @Input() MrCustTypeCode: string = CommonConstantX.MR_CUST_TYPE_CODE_PERSONAL;
  @Input() CustDataMode: string = CommonConstant.CustMainDataModeCust;
  @Output() OutputCustObj: EventEmitter<CustXObj> = new EventEmitter<CustXObj>();
  @Output() OutputUploadFile: EventEmitter<Array<CustDocFileFormXObj>> = new EventEmitter<Array<CustDocFileFormXObj>>();


  officeCode: string;
  IsUseDigitalization: string = "0";
  pefindoMultiResMax: number = 0;
  IsUseTs: Boolean = false;
  IsUsePefindo: Boolean = false;
  IsUseAsliRI: Boolean = false;
  ListDocumentKeyValueObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  thirdPartyGroupTrxNo: string = null;

  width: number;
  height: number;
  url: any;

  CustDocFileFormObjs: Array<CustDocFileFormXObj> = new Array<CustDocFileFormXObj>();
  CustDocFileObjs: Array<CustDocFileXObj> = new Array<CustDocFileXObj>();
  sysConfigResultObj: ResSysConfigResultXObj = new ResSysConfigResultXObj();

  readonly CustDataModeMain: string = CommonConstant.CustMainDataModeCust;
  readonly FileExtAllowed: Array<string> = [CommonConstantX.FileExtensionPdf, CommonConstantX.FileExtensionJpg, CommonConstantX.FileExtensionJpeg, CommonConstantX.FileExtensionGif, CommonConstantX.FileExtensionPng]
  readonly ExtStr: string = String.Join(", ", this.FileExtAllowed);

  readonly FileExtAllowedAsliRI: Array<string> = [CommonConstantX.FileExtensionJpg, CommonConstantX.FileExtensionJpeg, CommonConstantX.FileExtensionPng, CommonConstantX.FileExtensionBmp]
  readonly ExtStrAsliRI: string = String.Join(", ", this.FileExtAllowedAsliRI);

  async ngOnInit(): Promise<void> {
    let context: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.officeCode = context[CommonConstant.OFFICE_CODE];
    await this.getIsUseDigitalization();
    await this.checkIsPefindoMulti();
    if (this.IsUseDigitalization == CommonConstantX.TRUE_CONDITION) {
      await this.getDigitalizationSvcType();
      if (this.custObj.CustId > 0) {
        await this.getCustDocFiles();
      }
      await this.getListDocumentToBeUpload();
    }
  }
  async getIsUseDigitalization() {
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeIsUseDigitalization }).toPromise().then(
      (response) => {
        this.IsUseDigitalization = response["GsValue"];
      }
    );
  }

  async getDigitalizationSvcType() {
    await this.http.post<ResSysConfigResultXObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType }).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if (this.sysConfigResultObj.ConfigValue != null) {
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");

      var svcTypeTs = listSvcType.find(x => x == CommonConstant.DigitalizationSvcTypeTrustingSocial);

      if (svcTypeTs != null) {
        this.IsUseTs = true;
      }

      var svcTypePefindo = listSvcType.find(x => x == CommonConstant.DigitalizationSvcTypePefindo);

      if (svcTypePefindo != null) {
        this.IsUsePefindo = true;
      }
    }
    await this.http.post<ResSysConfigResultXObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.SvcTypeAsliRi }).toPromise().then(
      (response) => {
        if (response.ConfigValue == "1") {
          this.IsUseAsliRI = true;
        }
      });
  }

  async getListDocumentToBeUpload() {
    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    tempReq.RefMasterTypeCode = CommonConstantX.RefMasterTypeCodeCustDocType;
    tempReq.MappingCode = this.MrCustTypeCode;
    await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, tempReq).toPromise().then(
      async (response) => {
        this.ListDocumentKeyValueObj = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.ListDocumentKeyValueObj.length; i++) {
          var custDocFileFormObj = new CustDocFileFormXObj();

          custDocFileFormObj.MrCustDocTypeCode = this.ListDocumentKeyValueObj[i].Key;
          custDocFileFormObj.DocTypeName = this.ListDocumentKeyValueObj[i].Value;
          var existingCustDocFile = this.CustDocFileObjs.find(x => x.MrCustDocTypeCode == this.ListDocumentKeyValueObj[i].Key);
          if (this.custObj.CustId == 0 || existingCustDocFile == undefined) {
            custDocFileFormObj.IsRequired = true;
          } else {
            custDocFileFormObj.IsRequired = false;
          }
          if (custDocFileFormObj.DocTypeName == CommonConstantX.ASLI_RI_SELFIE) {
            custDocFileFormObj.IsRequired = false;
          }
          custDocFileFormObj.File = null;

          this.CustDocFileFormObjs.push(custDocFileFormObj);
        }
        this.OutputUploadFile.emit(this.CustDocFileFormObjs);
      }
    );
  }

  setDocFormCustMaritalTypeChanged(){
    let idxObj = this.CustDocFileFormObjs.findIndex(x => x.MrCustDocTypeCode == CommonConstantX.MasterCodeCustDocTypeSpouseId);
    if(this.parentForm.controls.MrMaritalStatCode.value == CommonConstantX.MR_MARITAL_STAT_CODE_SINGLE){
      this.CustDocFileFormObjs[idxObj].IsRequired = false;
    }
    else{
      this.CustDocFileFormObjs[idxObj].IsRequired = true;
    }
  }

  async getCustDocFiles() {
    var reqByIdObj = { Id: this.custObj.CustId };
    await this.http.post(URLConstantX.GetListCustDocFileByCustId, reqByIdObj).toPromise().then(
      async (response) => {
        this.CustDocFileObjs = response[CommonConstant.ReturnObj];
      }
    );
  }

  async checkIsPefindoMulti()
  {
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstantX.GsPefindoMultiResultMax }).toPromise().then(
      (response) => {
        this.pefindoMultiResMax = parseInt(response["GsValue"]);
      });
  }

  inqPefindoCustReq: string = "";

  async ReqPefindo() {
    this.markFormGroupTouched(this.parentForm);
    if (!this.thirdPartyUploadService.ValidateFileUpload(this.CustDocFileFormObjs)) {
      return;
    }

    if (!this.parentForm.valid) {
      return;
    }

    await this.checkIsPefindoMulti();

    let tempForm = this.parentForm.getRawValue();

    let reqPefindoSmartSearchObj = new ReqPefindoSmartSearchV2XObj();
    if (this.CustDataMode == this.CustDataModeMain) {
      reqPefindoSmartSearchObj.CustName = tempForm["CustName"];
    } else {
      reqPefindoSmartSearchObj.CustName = tempForm["ExistingCustName"]["value"];
    }
    reqPefindoSmartSearchObj.CustType = this.MrCustTypeCode;
    reqPefindoSmartSearchObj.BirthDt = tempForm["BirthDate"];

    await this.http.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstantX.GsInqPefindoCustReq }).toPromise().then(
      (result) => {
        this.inqPefindoCustReq = result["GsValue"];
      }
    );
    reqPefindoSmartSearchObj.MrPefindoInquiryReasonCode = this.inqPefindoCustReq;
    

    if (this.MrCustTypeCode == CommonConstantX.MR_CUST_TYPE_CODE_PERSONAL) {
      reqPefindoSmartSearchObj.IdType = tempForm["MrIdTypeCode"];
      reqPefindoSmartSearchObj.IdNo = tempForm["IdNo"];
    } else {
      reqPefindoSmartSearchObj.IdType = CommonConstant.MrIdTypeCodeNPWP;
      reqPefindoSmartSearchObj.IdNo = tempForm["TaxIdNo"];
    }

    if(this.custObj.CustId > 0) {
      var custDocFileObjs: ReqCustDocFileXObj = new ReqCustDocFileXObj();
      custDocFileObjs.CustId = this.custObj.CustId;
      custDocFileObjs.CustDocFileObjs = await this.thirdPartyUploadService.ConvertToCustDocFileObj(this.CustDocFileFormObjs);
      this.http.post(URLConstantX.SaveCustDocFile, custDocFileObjs).subscribe(
        (response) => {
          const modalRef = this.modalService.open(PefindoReqXComponent);
          modalRef.componentInstance.ReqPefindoSmartSearchObj = reqPefindoSmartSearchObj;
          modalRef.componentInstance.ThirdPartyTrxNo = this.thirdPartyTrxNo;
          modalRef.componentInstance.CustId = this.custObj.CustId;
          modalRef.componentInstance.RowVersion = this.custObj.RowVersion;

          if (this.pefindoMultiResMax > 0)
          {
            modalRef.result.then((res) => {
              this.thirdPartyGroupTrxNo = res["ThirdPartyRsltHGroupNo"];
              this.custObj.ThirdPartyGroupTrxNo = res["ThirdPartyRsltHGroupNo"];
              this.custObj.RowVersion = res["RowVersion"];
              this.OutputCustObj.emit(this.custObj);
            })
          }
          else
          {
            modalRef.result.then((res) => {
              this.thirdPartyTrxNo = res["Code"];
              this.custObj.ThirdPartyTrxNo = res["Code"];
              this.custObj.RowVersion = res["RowVersion"];
              this.OutputCustObj.emit(this.custObj);
            })
          }
        }
      );
    }
    else {
      const modalRef = this.modalService.open(PefindoReqXComponent);
      modalRef.componentInstance.ReqPefindoSmartSearchObj = reqPefindoSmartSearchObj;
      modalRef.componentInstance.ThirdPartyTrxNo = this.thirdPartyTrxNo;
      if (this.pefindoMultiResMax > 0)
      {
        modalRef.result.then((res) => {
          this.thirdPartyGroupTrxNo = res["ThirdPartyRsltHGroupNo"];
          this.custObj.ThirdPartyGroupTrxNo = res["ThirdPartyRsltHGroupNo"];
          this.OutputCustObj.emit(this.custObj);
        })
      }
      else
      {
        modalRef.result.then((res) => {
          this.thirdPartyTrxNo = res["Code"];
          this.custObj.ThirdPartyTrxNo = res["Code"];
          this.OutputCustObj.emit(this.custObj);
        })
      }
    }
  }

  async ViewPefindo() {
    await this.checkIsPefindoMulti();
    if (this.pefindoMultiResMax > 0)
    {
      let TrxNo = this.thirdPartyGroupTrxNo;

      if (this.custObj.CustId > 0)
      {
        await this.http.post(URLConstant.GetCustByCustId, { Id: this.custObj.CustId }).toPromise().then(
          (response: CustXObj) => {
            TrxNo = response["ThirdPartyGroupTrxNo"];
          });
      }

      if (TrxNo == null || TrxNo == "")
      {
        this.toastr.warningMessage("Please request Pefindo first!");
        return;
      }

      AdInsHelper.OpenPefindoMultiResultView(TrxNo, this.MrCustTypeCode);
    }
    else
    {
      let TrxNo = this.thirdPartyTrxNo;
      if (TrxNo == null || TrxNo == "")
      {
        this.toastr.warningMessage("Please request Pefindo first!");
        return;
      }
      AdInsHelper.OpenPefindoViewX(TrxNo, this.MrCustTypeCode);
    }
  }

  async ReqTrustingSocial() {
    this.markFormGroupTouched(this.parentForm);

    if (!this.parentForm.valid) {
      return;
    }

    let tempForm = this.parentForm.getRawValue();
    let custObj: CustXObj = new CustXObj();
    let custPersonalObj = new CustPersonalObj();

    // cek nomor telepon valid atau gak
    if (this.MrCustTypeCode == CommonConstantX.MR_CUST_TYPE_CODE_PERSONAL) {
      let MobilePhnNo = tempForm["MobilePhone1"];
      if (MobilePhnNo.substring(0, 2) != '62') {
        this.toastr.warningMessage(ExceptionConstantX.MOBILE_PHN_NO_INVALID);
        return;
      }
    }

    if (!this.thirdPartyUploadService.ValidateFileUpload(this.CustDocFileFormObjs)) {
      return;
    }

    if (this.CustDataMode == this.CustDataModeMain) {
      custObj.CustName = tempForm["CustName"];
    } else {
      custObj.CustName = tempForm["ExistingCustName"]["value"];
    }
    custObj.CustId = this.custObj.CustId;
    custObj.CustNo = this.custObj.CustNo;
    custObj.TaxIdNo = tempForm["TaxIdNo"];
    custObj.ThirdPartyTrxNo = this.thirdPartyTrxNo;
    custObj.MrCustTypeCode = this.MrCustTypeCode;
    custObj.RowVersion = this.custObj.RowVersion;

    if (tempForm["MrIdTypeCode"] == CommonConstant.MrIdTypeCodeEKTP) {
      custObj.MrIdTypeCode = tempForm["MrIdTypeCode"];
      custObj.IdNo = tempForm["IdNo"];
    } else {
      custObj.MrIdTypeCode = CommonConstantX.TrustingSocialDummyIdType;
      custObj.IdNo = CommonConstantX.TrustingSocialDummyIdNo;
    }

    if (this.MrCustTypeCode == CommonConstantX.MR_CUST_TYPE_CODE_PERSONAL) {
      custPersonalObj.MobilePhnNo1 = tempForm["MobilePhone1"];
    }

    if(this.custObj.CustId > 0) {
      var custDocFileObjs: ReqCustDocFileXObj = new ReqCustDocFileXObj();
      custDocFileObjs.CustId = this.custObj.CustId;
      custDocFileObjs.CustDocFileObjs = await this.thirdPartyUploadService.ConvertToCustDocFileObj(this.CustDocFileFormObjs);
      this.http.post(URLConstantX.SaveCustDocFile, custDocFileObjs).subscribe(
        (response) => {
          const modalRef = this.modalService.open(TrustingSocialReqHeaderXComponent);
          modalRef.componentInstance.CustObj = custObj;
          modalRef.componentInstance.CustPersonalObj = custPersonalObj;

          modalRef.result.then((res) => {
            this.thirdPartyTrxNo = res["ThirdPartyTrxNo"];
            this.custObj.ThirdPartyTrxNo = res["ThirdPartyTrxNo"];
            this.custObj.RowVersion = res["RowVersion"];
            this.OutputCustObj.emit(this.custObj);
          })
        }
      );
    }
    else {
      const modalRef = this.modalService.open(TrustingSocialReqHeaderXComponent);
      modalRef.componentInstance.CustObj = custObj;
      modalRef.componentInstance.CustPersonalObj = custPersonalObj;

      modalRef.result.then((res) => {
        this.thirdPartyTrxNo = res["ThirdPartyTrxNo"];
        this.custObj.ThirdPartyTrxNo = res["ThirdPartyTrxNo"];
        this.custObj.RowVersion = res["RowVersion"];
        this.OutputCustObj.emit(this.custObj);
      })
    }

  }

  ViewTrustingSocial() {
    const modalRef = this.modalService.open(TrustingSocialViewHeaderXComponent);
    modalRef.componentInstance.ThirdPartyTrxNo = this.thirdPartyTrxNo;
  }

  async ReqASLIRI() {
    this.markFormGroupTouched(this.parentForm);

    if (!this.thirdPartyUploadService.ValidateFileUploadAsliRI(this.CustDocFileFormObjs)) {
      return;
    }

    if (!this.parentForm.valid) {
      return;
    }

    const modalRef = this.modalService.open(AsliRiReqHeaderXComponent);
    modalRef.componentInstance.parentForm = this.parentForm;
    modalRef.componentInstance.custObj = this.custObj;
    modalRef.componentInstance.MrCustTypeCode = this.MrCustTypeCode;

    for (let i = 0; i < this.CustDocFileFormObjs.length; i++) {
      if (this.MrCustTypeCode == CommonConstant.CustTypePersonal && this.parentForm.controls.MrIdTypeCode.value == CommonConstant.MrIdTypeCodeEKTP && this.CustDocFileFormObjs[i].DocTypeName == CommonConstantX.ASLI_RI_SELFIE) {
        modalRef.componentInstance.custDocFileFormObj = this.CustDocFileFormObjs[i];
        modalRef.componentInstance.height = this.height;
        modalRef.componentInstance.width = this.width;
        modalRef.componentInstance.url = this.url;
      }
    }

  }

  async ViewASLIRI() {
    const modalRef = this.modalService.open(AsliRiViewXComponent);
    modalRef.componentInstance.custObj = this.custObj;
    modalRef.componentInstance.parentForm = this.parentForm;
    modalRef.componentInstance.MrCustTypeCode = this.MrCustTypeCode;
    modalRef.componentInstance.custObj.MrCustTypeCode = this.MrCustTypeCode;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  HandleFileInput(files: FileList, i) {
    this.CustDocFileFormObjs[i].File = files.item(0);
    this.OutputUploadFile.emit(this.CustDocFileFormObjs);
  }

  HandleFileInputAsliRI(files: FileList, img: any, i) {
    if (img.target.files && img.target.files.length) {
      let file = img.target.files[0];
      let image = new Image();
      let reader = new FileReader();
      image.src = window.URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        setTimeout(() => {
          this.width = image.naturalWidth
          this.height = image.naturalHeight
          this.url = reader.result
        })
      }
    }
    this.CustDocFileFormObjs[i].File = files.item(0);
    this.OutputUploadFile.emit(this.CustDocFileFormObjs);
  }

  ConvertSize(fileSize: number) {
    return fileSize < 1024000
      ? (fileSize / 1024).toFixed(2) + ' KB'
      : (fileSize / 1024000).toFixed(2) + ' MB';
  }
}
