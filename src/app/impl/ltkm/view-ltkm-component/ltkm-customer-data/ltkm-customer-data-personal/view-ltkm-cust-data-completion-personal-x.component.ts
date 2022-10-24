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
import { LtkmCustGrpObj } from 'app/shared/model/ltkm/ltkm-cust-grp-obj.model';
import { LtkmCustPersonalContactPersonObj } from 'app/shared/model/ltkm/ltkm-cust-personal-contact-person-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { LtkmCustPersonalFinDataObjX } from 'app/impl/shared/model/ltkm/ltkm-cust-personal-fin-data-objX.model';
import { ViewLtkmCustDetailComponent } from 'app/ltkm/view-ltkm-component/ltkm-customer-data/view-ltkm-cust-detail/view-ltkm-cust-detail.component';


@Component({
  selector: 'app-view-ltkm-cust-data-completion-personal-x',
  templateUrl: './view-ltkm-cust-data-completion-personal-x.component.html',
  styleUrls: []
})
export class ViewLtkmCustDataCompletionPersonalXComponent implements OnInit {

  @Input() LtkmCustId: number;
  @Input() isDetail: boolean = false;
  viewMainDataObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataProfObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataEmpObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataSmeObj:  UcViewGenericObj = new UcViewGenericObj();
  viewJobDataNonProfObj:  UcViewGenericObj = new UcViewGenericObj();
  viewEmergencyContactObj:  UcViewGenericObj = new UcViewGenericObj();

  customerTitle: string;
  arrValue = [];
  isDataAlreadyLoaded: boolean = false;
  
  isPopupDetail: boolean = false;
  isShowDetail: boolean = false;
  detailLtkmCustId: number;
  detailMrCustTypeCode: string;
  detailCustomerTitle: string;

  ltkmCustObj: LtkmCustObj;
  custModelCode: string;
  ltkmCustAddrForViewObjs: Array<LtkmCustAddrForViewObj>;
  ltkmCustBankAccObjs: Array<LtkmCustBankAccObj>;
  ltkmCustGrpObjs: Array<LtkmCustGrpObj>;
  ltkmCustPersonalContactPersonObjs: Array<LtkmCustPersonalContactPersonObj>;
  ltkmCustFamilyObjs: Array<LtkmCustObj>;

  TitleCustFinDataSuffix:string = '';
  IsShowCustFinDataDetail:boolean = false;
  ListCustPersonalFinData : Array<LtkmCustPersonalFinDataObjX>;
  CustPersonalFinData : LtkmCustPersonalFinDataObjX;
  currentCustFinDataIndex: number;  
  CustNoObj: GenericObj = new GenericObj();
  CustId: number = 0;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  async ngOnInit(): Promise<void> {    
    await this.getCustData();
    await this.getListFinData();
    this.arrValue.push(this.ltkmCustObj.LtkmCustId);
    this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalMainData.json";
    this.viewMainDataObj.whereValue = this.arrValue;

    this.viewJobDataProfObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalJobDataProf.json";
    this.viewJobDataProfObj.whereValue = this.arrValue;

    this.viewJobDataEmpObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalJobDataEmp.json";
    this.viewJobDataEmpObj.whereValue = this.arrValue;

    this.viewJobDataSmeObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalJobDataSme.json";
    this.viewJobDataSmeObj.whereValue = this.arrValue;

    this.viewJobDataNonProfObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustPersonalJobDataNonProf.json";
    this.viewJobDataNonProfObj.whereValue = this.arrValue;

    this.viewEmergencyContactObj.viewInput = "./assets/ucviewgeneric/viewLtkmCustEmrgncCntct.json";
    this.viewEmergencyContactObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  async getListFinData() {
    await this.http.post(URLConstantX.GetListCustPersonalFinDataXForCustViewByCustId,  {CustId: this.CustId }).toPromise().then(
      (response) => {
          this.ListCustPersonalFinData = response['ListCustPersonalFinDataForCustViewX'];
    });
  }

  async getCustData() {
      await this.http.post(URLConstant.GetLtkmCustDataPersonalForViewByLtkmCustId, { LtkmCustId: this.LtkmCustId, IsForNapCompletionVersion: true }).toPromise().then(
      (response) => {        
        this.ltkmCustObj = response["rLtkmCustObj"];
        this.custModelCode = response["MrCustModelCode"];
        this.ltkmCustAddrForViewObjs = response["rLtkmCustAddrObjs"];
        this.ltkmCustBankAccObjs = response["rLtkmCustBankAccObjs"];
        this.ltkmCustGrpObjs = response["rLtkmCustGrpObjs"];
        this.ltkmCustPersonalContactPersonObjs = response["rLtkmCustPersonalContactPersonObjs"] == null ? new Array<LtkmCustPersonalContactPersonObj>() : response["rLtkmCustPersonalContactPersonObjs"];
        this.ltkmCustFamilyObjs = response["rLtkmCustFamilyObjs"];             
        this.ListCustPersonalFinData = response["rLtkmCustPersonalFinDataObjs"];  

        // filter family yg punya relationship
        if(this.ltkmCustFamilyObjs && this.ltkmCustFamilyObjs.length > 0) {
          this.ltkmCustFamilyObjs = this.ltkmCustFamilyObjs.filter(item => item['MrCustRelationshipCode'])
        }        

        // filter cust group yg punya cust no & applicant no
        if(this.ltkmCustGrpObjs && this.ltkmCustGrpObjs.length > 0) {
          this.ltkmCustGrpObjs = this.ltkmCustGrpObjs.filter(item => item['CustNo'] || item['ApplicantNo'])
        }

        if(this.ltkmCustObj.IsFamily) this.customerTitle = 'Family';
        else if(this.ltkmCustObj.IsShareholder) this.customerTitle = 'Shareholder';
        else if(this.ltkmCustObj.IsGuarantor) this.customerTitle = 'Guarantor';
        else this.customerTitle = 'Customer';
      });

      this.CustNoObj.CustNo = this.ltkmCustObj.CustNo;

      await this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).toPromise().then(
        (response) => {
            this.CustId = response['CustId'];
      });
  }

  viewDetailFamilyHandler(LtkmCustId, MrCustTypeCode){
    if(this.isPopupDetail)
    {
      const modalInsDetail = this.modalService.open(ViewLtkmCustDetailComponent);
      modalInsDetail.componentInstance.LtkmCustId = LtkmCustId;
      modalInsDetail.componentInstance.MrCustTypeCode = MrCustTypeCode;
      modalInsDetail.componentInstance.CustomerTitle = 'Family';
      modalInsDetail.result.then().catch((error) => {
      });
    }
    else
    {
      this.detailLtkmCustId = LtkmCustId;
      this.detailMrCustTypeCode = MrCustTypeCode;
      this.detailCustomerTitle = 'Family';
      this.isShowDetail = true;      
    }
  }

  closeDetailHandler()
  {
    this.isShowDetail = false;
  }


  showDetailCustFinData(index:number){
    let datePipe = new DatePipe("en-US");
    this.currentCustFinDataIndex = index;
    this.CustPersonalFinData = this.ListCustPersonalFinData[this.currentCustFinDataIndex];
    this.TitleCustFinDataSuffix = 'Date as of '+datePipe.transform(this.CustPersonalFinData['DateAsOf'], 'dd-MMM-yyyy')
    this.IsShowCustFinDataDetail = true;
  }
  
  hideDetailCustFinData()
  {
    this.TitleCustFinDataSuffix = '';
    this.IsShowCustFinDataDetail = false;
    this.CustPersonalFinData = null;
  }
}
