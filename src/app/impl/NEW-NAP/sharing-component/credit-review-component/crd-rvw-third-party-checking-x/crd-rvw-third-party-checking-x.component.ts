import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { ThirdPartyDukcapilRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartyDukcapilRsltObj.Model';
import { ThirdPartyPefindoRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartyPefindoRsltObj.Model';
import { ThirdPartyProfindRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartyProfindRsltObj.Model';
import { ThirdPartyRapindoRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartyRapindoRsltObj.Model';
import { ThirdPartyResultHObj } from 'app/shared/model/ThirdPartyData/ThirdPartyResultH.Model';
import { ThirdPartySlikRsltObj } from 'app/shared/model/ThirdPartyData/ThirdPartySlikRsltObj.Model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-crd-rvw-third-party-checking-x',
  templateUrl: './crd-rvw-third-party-checking-x.component.html'
})
export class CrdRvwThirdPartyCheckingXComponent implements OnInit {

  @Input() CrdRvwCustInfoId: number;
  @Input() CrdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  @Input() AppNo: string = "";
  IsUseDigitalization: string;
  user: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private cookieService: CookieService) { }

  async ngOnInit() : Promise<void> {
    await this.GetIsUseDigitalization();

    if(this.IsUseDigitalization == "1"){
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
          if(element.IsExists) this.RapindoDataObj.DataExist++;

          if(element.IsActive) this.RapindoDataObj.DataActive++;
          else this.RapindoDataObj.DataNoActive++;
        }
      }
    )
  }

  async GetIsUseDigitalization() {
    var generalSettingObj = new GeneralSettingObj();
    generalSettingObj.GsCode = CommonConstant.GSCodeIsUseDigitalization;
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, {Code: CommonConstant.GSCodeIsUseDigitalization}).toPromise().then(
      (response: GeneralSettingObj) => {
        this.IsUseDigitalization = response.GsValue;
      }
    )
  }

  async pefindoHandler() {
    let PefindoBasicRole = "";
    await this.http.post(URLConstant.GetGeneralSettingValueByCode, {Code: CommonConstantX.GSCodePefindoBasicRole}).toPromise().then(
      (response: GeneralSettingObj) => {
        PefindoBasicRole = response.GsValue;
      }
    )
    let Roles = PefindoBasicRole.split(',');
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (Roles.includes(this.user.RoleCode)) {
      AdInsHelper.OpenPefindoView(this.CrdRvwCustInfoObj.CustNo, false);
    } else {
      AdInsHelper.OpenPefindoView(this.CrdRvwCustInfoObj.CustNo, true);
    }
  }
  
}
