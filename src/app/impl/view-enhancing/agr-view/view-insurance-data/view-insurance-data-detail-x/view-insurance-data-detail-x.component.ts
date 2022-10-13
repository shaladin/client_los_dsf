import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppInsObjObj } from 'app/shared/model/app-ins-obj-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { RequestInsuranceDataObj } from 'app/shared/model/request-insurance-data-obj.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'view-insurance-data-detail-x',
  templateUrl: './view-insurance-data-detail-x.component.html'
})
export class ViewInsuranceDataDetailXComponent implements OnInit {
  @Input() AppInsObjId: number;
  appAsset: any;
  appInsObj: AppInsObjObj;
  appInsCvgs: any;
  appInsAssId: number;
  appInsCvgsFinal: Array<any>;
  public static CUSTOMER: string = CommonConstant.InsuredByCustomer;
  public static COMPANY: string = CommonConstant.InsuredByCompany;
  public static CUSTOMER_COMPANY: string = CommonConstant.InsuredByCustomerCompany;
  public static OFF_SYSTEM: string = CommonConstant.InsuredByOffSystem;
  reqInsuranceDataObj: any;
  inputGridObj: InputGridObj = new InputGridObj();
  payName: string = "";

  constructor(private http: HttpClient, public activeModal: NgbActiveModal) { }

  async ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/impl/ucgridview/gridAppInsuranceAssetAccessory.json";
    this.reqInsuranceDataObj = new RequestInsuranceDataObj();
    this.reqInsuranceDataObj.AppInsObjObj.AppInsObjId = this.AppInsObjId;
    await this.http.post(URLConstant.GetAppInsObjViewDetail, { Id: this.AppInsObjId }).toPromise().then(
      (response: any) => {
        this.appInsObj = response.appInsObj;
        this.appInsAssId = this.appInsObj.AppAssetId
        this.appInsCvgs = response.appInsCvgs;
        this.appInsCvgsFinal = new Array<any>();

        for (const item of this.appInsCvgs) {
          var addCvg = "";
          for (var i = 0; i < item.appInsAddCvgObjs.length; i++) {
            if (i == (item.appInsAddCvgObjs.length - 1)) {
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode;
            }
            else {
              addCvg += item.appInsAddCvgObjs[i].MrAddCvgTypeCode + ", ";
            }
          }
          this.appInsCvgsFinal.push({
            YearNo: item.appInsMainCvgObj.YearNo,
            MrMainCvgTypeCode: item.appInsMainCvgObj.MrMainCvgTypeCode,
            MrAddCvgTypeCode: addCvg,
            CustMainPremiAmt: item.appInsMainCvgObj.CustMainPremiAmt,
            CustAddPremiAmt: item.appInsMainCvgObj.TotalCustAddPremiAmt,
            InscoMainPremiAmt: item.appInsMainCvgObj.InscoMainPremiAmt,
            InscoAddPremiAmt: item.appInsMainCvgObj.TotalInscoAddPremiAmt
          });
        }
      });
    await this.getAsset();
    await this.getPaymentType();
  }

  async getAsset(){
    let AppAsset = this.http.post(URLConstant.GetAppAssetByAppAssetIdWithSerialNoDefinition, { Id: this.appInsAssId });
    forkJoin([AppAsset]).toPromise().then(
      (response: any) => {
        this.appAsset = response[0];
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = this.appAsset.ResponseAppAssetAccessoryObjs;
      }
    );

  }
  async getPaymentType(){
    let refMaster: ReqRefMasterByTypeCodeAndMasterCodeObj = {
      RefMasterTypeCode: CommonConstantX.RefMasterTypeCodePayPeriodToInsco,
      MasterCode: this.appInsObj.PayPeriodToInsco
    };
    await this.http.post<KeyValueObj>(URLConstant.GetKvpRefMasterByRefMasterTypeCodeAndMasterCode, refMaster).toPromise().then(
      (response) => {
        this.payName = response.Value;
      }
    );
  }
}
