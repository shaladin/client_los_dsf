import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LtkmCustObj } from 'app/shared/model/ltkm/ltkm-cust-obj.model';
import { LtkmCustAddrForViewObj } from 'app/shared/model/ltkm/ltkm-cust-addr-for-view-obj.model';
import { LtkmCustBankAccObj } from 'app/shared/model/ltkm/ltkm-cust-bank-acc-obj.model';
import { LtkmCustSocmedObj } from 'app/shared/model/ltkm/ltkm-cust-socmed-obj.model';
import { LtkmCustGrpObj } from 'app/shared/model/ltkm/ltkm-cust-grp-obj.model';
import { LtkmCustCompanyMgmntShrholderObj } from 'app/shared/model/ltkm/ltkm-cust-company-mgmnt-shrholder-obj.model';
import { LtkmCustCompanyLegalDocObj } from 'app/shared/model/ltkm/ltkm-cust-company-legal-doc-obj.model';
import { LtkmCustCompanyFinDataObj } from 'app/shared/model/ltkm/ltkm-cust-company-fin-data-obj.model';
import { ViewLtkmCustDetailComponent } from 'app/ltkm/view-ltkm-component/ltkm-customer-data/view-ltkm-cust-detail/view-ltkm-cust-detail.component';
import { ViewLtkmCustDetailXComponent } from '../view-ltkm-cust-detail/view-ltkm-cust-detail-x.component';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-view-ltkm-cust-data-completion-company-x',
  templateUrl: './view-ltkm-cust-data-completion-company-x.component.html'
})
export class ViewLtkmCustDataCompletionCompanyXComponent implements OnInit {

  @Input() LtkmCustId: string;
  @Input() isDetail: boolean = false;
  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  viewJobDataProfObj: string;
  viewJobDataEmpObj: string;
  viewJobDataSmeObj: string;
  viewJobDataNonProfObj: string;
  viewAppCustCompanyContactPersonObj: UcViewGenericObj = new UcViewGenericObj();

  customerTitle: string;
  arrValue = [];
  isDataAlreadyLoaded: boolean = false;

  isPopupDetail: boolean = false;
  isShowDetail: boolean = false;
  detailLtkmCustId: number;
  detailMrCustTypeCode: string;
  detailCustomerTitle: string;
  CustNoObj: GenericObj = new GenericObj();
  CustId: number = 0;

  ltkmCustObj: LtkmCustObj;
  ltkmCustAddrForViewObjs: Array<LtkmCustAddrForViewObj>;
  ltkmCustBankAccObjs: Array<LtkmCustBankAccObj>;
  ltkmCustSocmedObjs: Array<LtkmCustSocmedObj>;
  ltkmCustGrpObjs: Array<LtkmCustGrpObj>;
  ltkmCustCompanyMgmntShrholderObjs: Array<LtkmCustCompanyMgmntShrholderObj>;
  ltkmCustCompanyLegalDocObjs: Array<LtkmCustCompanyLegalDocObj>;

  TitleCustFinSuffix: string = '';
  IsShowDetailCustFin: boolean = false;
  ListCustCoyFinData: Array<LtkmCustCompanyFinDataObj>;
  CustCoyFinData: object;
  currentCustFinDataIndex: number;
  NettIncomeAmtCoy: number = 0;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  async ngOnInit(): Promise<void> {
      await this.getCustData();
      await this.getListFinData();

      this.arrValue.push(this.ltkmCustObj.LtkmCustId);
      this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustCompanyMainData.json";
      this.viewMainDataObj.whereValue = this.arrValue;

      this.viewAppCustCompanyContactPersonObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustCompanyContactPerson.json";
      this.viewAppCustCompanyContactPersonObj.whereValue = this.arrValue;

      this.isDataAlreadyLoaded = true;
  }

  async getCustData() {
    await this.http.post(URLConstant.GetLtkmCustDataCompanyForViewByLtkmCustId, { LtkmCustId: this.LtkmCustId, IsForNapCompletionVersion: true }).toPromise().then(
        (response) => {
            this.ltkmCustObj = response["rLtkmCustObj"];
            this.ltkmCustAddrForViewObjs = response["rLtkmCustAddrObjs"];
            this.ltkmCustCompanyMgmntShrholderObjs = response["rLtkmCustCompanyMgmntShrholderObjs"];
            this.ltkmCustBankAccObjs = response["rLtkmCustBankAccObjs"];
            this.ltkmCustCompanyLegalDocObjs = response["rLtkmCustCompanyLegalDocObjs"];
            this.ltkmCustSocmedObjs = response["rLtkmCustSocmedObjs"];
            this.ltkmCustGrpObjs = response["rLtkmCustGrpObjs"];

            if (this.ltkmCustObj.IsFamily) this.customerTitle = 'Family';
            else if (this.ltkmCustObj.IsShareholder) this.customerTitle = 'Shareholder';
            else if (this.ltkmCustObj.IsGuarantor) this.customerTitle = 'Guarantor';
            else this.customerTitle = 'Customer';

            // filter cust group yg punya cust no & applicant no
            if (this.ltkmCustGrpObjs && this.ltkmCustGrpObjs.length > 0) {
                this.ltkmCustGrpObjs = this.ltkmCustGrpObjs.filter(item => item['CustNo'] || item['ApplicantNo'])
            }
        });
    this.CustNoObj.CustNo = this.ltkmCustObj.CustNo;

    await this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).toPromise().then(
        (response) => {
            this.CustId = response['CustId'];
        });
  }

  viewDetailShareholderHandler(LtkmCustId, MrCustTypeCode) {
      if (this.isPopupDetail) {
          const modalInsDetail = this.modalService.open(ViewLtkmCustDetailXComponent);
          modalInsDetail.componentInstance.LtkmCustId = LtkmCustId;
          modalInsDetail.componentInstance.MrCustTypeCode = MrCustTypeCode;
          modalInsDetail.componentInstance.CustomerTitle = 'Shareholder';
          modalInsDetail.result.then().catch((error) => {
          });
      }
      else {
          this.detailLtkmCustId = LtkmCustId;
          this.detailMrCustTypeCode = MrCustTypeCode;
          this.detailCustomerTitle = 'Shareholder';
          this.isShowDetail = true;
      }
  }

  closeDetailHandler() {
      this.isShowDetail = false;
  }

  async getListFinData() {
      await this.http.post(URLConstantX.GetListCustCompanyFinDataXForCustViewByCustId,  {Id: this.CustId }).toPromise().then(
        (response) => {
            this.ListCustCoyFinData = response['ListCustCompanyFinDataX'];
      });
  }

  showDetailCustFinData(index: number) {
      let datePipe = new DatePipe("en-US");
      this.currentCustFinDataIndex = index;
      this.CustCoyFinData = this.ListCustCoyFinData[this.currentCustFinDataIndex];
      this.calculateCompanyFinData()
      this.TitleCustFinSuffix = 'Date as of ' + datePipe.transform(this.CustCoyFinData['DateAsOf'], 'dd-MMM-yyyy')
      this.IsShowDetailCustFin = true;
  }

  hideDetailCustFinData() {
      this.TitleCustFinSuffix = '';
      this.IsShowDetailCustFin = false;
      this.CustCoyFinData = {};
  }

  calculateCompanyFinData(){
    this.NettIncomeAmtCoy = this.CustCoyFinData['GrossMonthlyIncomeAmt'] - this.CustCoyFinData['OthMonthlyInstAmt'] - this.CustCoyFinData['OprCost'];
  }
}
