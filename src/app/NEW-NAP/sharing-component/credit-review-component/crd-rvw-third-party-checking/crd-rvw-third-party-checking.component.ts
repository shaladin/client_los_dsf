import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { ThirdPartyDukcapilRsltObj } from 'app/shared/model/third-party-data/third-party-dukcapil-rslt-obj.model';
import { ThirdPartyPefindoRsltObj } from 'app/shared/model/third-party-data/third-party-pefindo-rslt-obj.model';
import { ThirdPartyProfindRsltObj } from 'app/shared/model/third-party-data/third-party-profind-rslt-obj.model';
import { ThirdPartyRapindoRsltObj } from 'app/shared/model/third-party-data/third-party-rapindo-rslt-obj.model';
import { ThirdPartyResultHObj } from 'app/shared/model/third-party-data/third-party-result-h.model';
import { ThirdPartySlikRsltObj } from 'app/shared/model/third-party-data/third-party-slik-rslt-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-crd-rvw-third-party-checking',
  templateUrl: './crd-rvw-third-party-checking.component.html',
  styleUrls: ['./crd-rvw-third-party-checking.component.scss']
})
export class CrdRvwThirdPartyCheckingComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  @Input() CrdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  @Input() AppNo: string = "";
  IsUseDigitalization: string;
  IsSvcExist: boolean = false;
  IsUseTs: boolean = false;
  IsUsePefindo: boolean = false;
  IsUseRapindo: boolean = false;
  IsUseDukcapil: boolean = false;
  IsUseProfind: boolean = false;
  IsUseSlik: boolean = false;
  IsUseAsliRi: boolean = false;
  sysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private cookieService: CookieService,
    private toastr: NGXToastrService) { }

  async ngOnInit(): Promise<void> {
    await this.GetIsUseDigitalization();
    await this.getDigitalizationSvcType();
    if (this.IsUseDigitalization == "1" && this.IsSvcExist) {
      await this.GetCrdRvwThirdPartyData();
    }
  }

  ThirdPartyDukcapilRsltObj: ThirdPartyDukcapilRsltObj = new ThirdPartyDukcapilRsltObj();
  ThirdPartyPefindoRsltObj: ThirdPartyPefindoRsltObj = new ThirdPartyPefindoRsltObj();
  ThirdPartyProfindRsltObj: ThirdPartyProfindRsltObj = new ThirdPartyProfindRsltObj();
  ListThirdPartyRapindoRsltObj: Array<ThirdPartyRapindoRsltObj> = new Array<ThirdPartyRapindoRsltObj>();
  ThirdPartySlikRsltObj: ThirdPartySlikRsltObj = new ThirdPartySlikRsltObj();

  RapindoDataObj: {
    DataExist: number,
    DataActive: number,
    DataNoActive: number,
  } = {
      DataExist: 0,
      DataActive: 0,
      DataNoActive: 0,
    };
  async GetCrdRvwThirdPartyData() {
    await this.http.post<ThirdPartyResultHObj>(URLConstant.GetCrdRvwThirdPartyData, { TrxNo: this.AppNo }).toPromise().then(
      (response) => {
        this.ThirdPartyDukcapilRsltObj = response.ThirdPartyDukcapilRsltObj;
        this.ThirdPartyPefindoRsltObj = response.ThirdPartyPefindoRsltObj;
        this.ThirdPartyProfindRsltObj = response.ThirdPartyProfindRsltObj;
        this.ListThirdPartyRapindoRsltObj = response.ListThirdPartyRapindoRsltObj;
        this.ThirdPartySlikRsltObj = response.ThirdPartySlikRsltObj;

        for (let index = 0; index < this.ListThirdPartyRapindoRsltObj.length; index++) {
          const element = this.ListThirdPartyRapindoRsltObj[index];
          if (element.IsExists) this.RapindoDataObj.DataExist++;

          if (element.IsActive) this.RapindoDataObj.DataActive++;
          else this.RapindoDataObj.DataNoActive++;
        }
      }
    )
  }

  async GetIsUseDigitalization() {
    var generalSettingObj = new GeneralSettingObj();
    generalSettingObj.GsCode = CommonConstant.GSCodeIsUseDigitalization;
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GSCodeIsUseDigitalization }).toPromise().then(
      (response: GeneralSettingObj) => {
        this.IsUseDigitalization = response.GsValue;
      }
    )
  }

  async pefindoHandler() {
    await this.http.post(URLConstant.GetCustByCustNo, { CustNo: this.CrdRvwCustInfoObj.CustNo }).toPromise().then(
      (response) => {
        let thirdPartyTrxNo = response["ThirdPartyTrxNo"]
        if (thirdPartyTrxNo == null || thirdPartyTrxNo == "")
        {
          this.toastr.warningMessage("Please request Pefindo first!");
          return;
        }

        const token = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
        AdInsHelper.OpenPefindoView(this.CrdRvwCustInfoObj.CustNo, true, token);
      })
  }

  closeResult: any;
  modalContainer: any;
  urlLink: string = "";
  trustingSocialHandler(model) {
    this.urlLink = environment.FoundationR3Web + NavigationConstant.VIEW_FOU_CUST_TRUST_SOC + "?CustNo=" + this.CrdRvwCustInfoObj.CustNo;
    // window.open(this.urlLink);
    this.modalContainer = this.modalService.open(model);
    this.modalContainer.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalContainer.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalContainer.close();
    });
  }

  asliRiHandler(model)
  {
    this.urlLink = environment.FoundationR3Web + NavigationConstant.VIEW_FOU_ASLI_RI + "?CustNo=" + this.CrdRvwCustInfoObj.CustNo;
    // window.open(this.urlLink);
    this.modalContainer = this.modalService.open(model);
    this.modalContainer.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalContainer.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalContainer.close();
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async getDigitalizationSvcType(){
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeDigitalizationSvcType}).toPromise().then(
      (response) => {
        this.sysConfigResultObj = response;
      });

    if(this.sysConfigResultObj.ConfigValue != null){
      var listSvcType = this.sysConfigResultObj.ConfigValue.split("|");

      var svcTypeDukcapil = listSvcType.find(x => x == CommonConstant.DigitalizationSvcTypeDukcapil);

      if(svcTypeDukcapil != null){
        this.IsUseDukcapil = true;
        this.IsSvcExist = true;
      }

      var svcTypePefindo = listSvcType.find(x => x == CommonConstant.DigitalizationSvcTypePefindo);

      if(svcTypePefindo != null){
        this.IsUsePefindo = true;
        this.IsSvcExist = true;
      }

      var svcTypeTs = listSvcType.find(x => x == CommonConstant.DigitalizationSvcTypeTrustingSocial);

      if(svcTypeTs != null){
        this.IsUseTs = true;
        this.IsSvcExist = true;
      }

      var svcTypeProfind = listSvcType.find(x => x == CommonConstant.DigitalizationSvcTypeProfind);

      if(svcTypeProfind != null){
        this.IsUseProfind = true;
        this.IsSvcExist = true;
      }

      var svcTypeRapindo = listSvcType.find(x => x == CommonConstant.DigitalizationSvcTypeRapindo);

      if(svcTypeRapindo != null){
        this.IsUseRapindo = true;
        this.IsSvcExist = true;
      }

      var svcTypeSlik = listSvcType.find(x => x == CommonConstant.DigitalizationSvcTypeSlik);

      if(svcTypeSlik != null){
        this.IsUseSlik = true;
        this.IsSvcExist = true;
      }

      await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.SvcTypeAsliRi}).toPromise().then(
        (response) => {
          if(response.ConfigValue == "1")
        {
          this.IsUseAsliRi = true;
        }
      });
    }
  }
}

