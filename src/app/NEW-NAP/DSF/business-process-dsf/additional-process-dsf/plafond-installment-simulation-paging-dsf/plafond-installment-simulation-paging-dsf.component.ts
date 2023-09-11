import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { ExceptionConstantX } from 'app/impl/shared/constant/ExceptionConstantX';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AgrParentObjX } from 'app/impl/shared/model/Response/AgrParentObjX.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { ExceptionConstantDsf } from 'app/shared/constant/ExceptionConstantDsf';
import { PathConstantDsf } from 'app/shared/constant/PathConstantDsf';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { CustomerAgrmntMasterDsfObj } from 'app/shared/model/customer-agrmnt-master-dsf-obj.model';
import { MasterAgrmntDsfObj } from 'app/shared/model/master-agrmnt-dsf-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-plafond-installment-simulation-paging-dsf',
  templateUrl: './plafond-installment-simulation-paging-dsf.component.html',
  styleUrls: ['./plafond-installment-simulation-paging-dsf.component.css']
})
export class PlafondInstallmentSimulationPagingDsfComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: NGXToastrService, private cookieService: CookieService) { }

  linkUrl: string;
  isAgrmntParentGoLiveDtValid: boolean = false;
  isAgrmntParentMaturityDtValid: boolean = false;
  monthFromGoLiveDt: number = 6;  // 6 as default value
  monthFromMaturyityDateDt: number = 3;  // 3 as default value
  minCustPerAge: number;
  maxCustPerAge: number;
  minCustPerAgeDt: Date;
  maxCustPerAgeDt: Date;
  UserAccess: Object;
  isCustomerReady: boolean = false;
  isAgrmntReady: boolean = false;
  masterAgrmntList: Array<MasterAgrmntDsfObj>;
  customerMasterAgrmntList: Array<CustomerAgrmntMasterDsfObj>;
  currentItemsCustomerToShow: Array<CustomerAgrmntMasterDsfObj>;
  currentItemsMasterAgrmntToShow: Array<MasterAgrmntDsfObj>;
  CustNo: string;
  CustName: string;
  pageSize: number = 10;
  pageSizeAgrmnt: number = 10;
  pageIndex: number = 1;
  pageIndexAgrmnt: number = 1;
  isError: boolean = false;
  SimulationForm = this.fb.group({
    CustNo: ['', [Validators.maxLength(500)]],
    CustName: ['', [Validators.maxLength(500)]]
  });

  async ngOnInit() {
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    //LMS R2 API Up Validation
    await this.http.post(URLConstantDsf.CheckLMSR2APIConnection, null).toPromise().then(
      (response: boolean) => {
        if (!response)
        {
          this.isError = true;
          this.toastr.warningMessage(ExceptionConstantDsf.CHECK_API_LMS_R2_UP);
          return false;
        }
      }
    );
  }

  async Reset()
  {
    this.masterAgrmntList = new Array<MasterAgrmntDsfObj>();
    this.CustName = "";
    this.CustNo = "";

    this.SimulationForm.patchValue(
      {
        CustNo: "",
        CustName: ""
      }
    );

    this.isCustomerReady = false;
    this.isAgrmntReady = false;
    this.pageSize = 10;
    this.pageIndex = 1;
    this.pageSizeAgrmnt = 10;
    this.pageIndexAgrmnt = 1;
  }
  
  async SearchCustomer()
  {
    if (this.isError)
    {
      //LMS R2 API Up Validation
      await this.http.post(URLConstantDsf.CheckLMSR2APIConnection, null).toPromise().then(
        (response: boolean) => {
          if (!response)
          {
            this.isError = true;
            this.toastr.warningMessage(ExceptionConstantDsf.CHECK_API_LMS_R2_UP);
            return false;
          }
        }
      );
    }

    //Search Validation
    if (this.SimulationForm.controls.CustNo.value == "" && this.SimulationForm.controls.CustName.value == "")
    {
      this.toastr.warningMessage(ExceptionConstantDsf.SEARCH_CUSTOMER_VALIDATION);
      this.isCustomerReady = false;
      return false;
    }

    //Check Customer
    var searchParam = {
      CustNo : this.SimulationForm.controls.CustNo.value,
      CustName : this.SimulationForm.controls.CustName.value
    }

    await this.http.post(URLConstantDsf.GetCustforAgrmntMasterDsf, searchParam).toPromise().then(
      (response: any) => {
        this.customerMasterAgrmntList = response as CustomerAgrmntMasterDsfObj[];
      }
    );

    this.currentItemsCustomerToShow =  this.customerMasterAgrmntList.slice(0, ((this.pageIndex-1)*this.pageSize) + this.pageSize)
    this.isCustomerReady = true;
  }

  async viewDetailAgrmntMaster(CustomerNo: string = "", CustomerName: string = "")
  {
    //Overdue Validation
    let isOverdue: boolean = false;
    await this.http.post(URLConstantX.CheckAgrmntParentOverdueByCustNo, { CustNo: CustomerNo }).toPromise().then(
      (response: any) => {
        if (response.IsOverdue) isOverdue = true;
      }
    );
    
    if(isOverdue){
      this.toastr.warningMessage(ExceptionConstantX.AGRMNT_PARENT_OVERDUE_EXIST);
      this.isAgrmntReady = false;
      return false;
    }

    //Parent Agrmnt Available Validation
    let isHaveAgrmntParent : boolean = false;
      await this.http.post<Array<AgrParentObjX>>(URLConstantX.GetListAgrmntParentByCustNoX, { CustNo: CustomerNo }).toPromise().then(
        (response) => {
          if (response && response.length > 0) isHaveAgrmntParent = true;
        }
      );

    if (!isHaveAgrmntParent)
    {
      this.toastr.warningMessage(ExceptionConstantDsf.CUST_NOT_HAVE_AGR_PARENT);
      this.isAgrmntReady = false;
      return false;
    }

    var searchAgrmntMasterParam = {
      CustNo : CustomerNo,
      CustName : CustomerName
    }

    await this.http.post(URLConstantDsf.GetAgrmntMasterList, searchAgrmntMasterParam).toPromise().then(
      (response) => {
        this.masterAgrmntList = response as MasterAgrmntDsfObj[];
        for (var i = 0; i < this.masterAgrmntList.length; i++)
        {
          this.masterAgrmntList[i].AssetPriceDepreciation = (this.currencyFormatter(this.masterAgrmntList[i].AssetPriceDepreciation.toString()));
          this.masterAgrmntList[i].OSARParentAgrmnt = (this.currencyFormatter(this.masterAgrmntList[i].OSARParentAgrmnt.toString()));
          this.masterAgrmntList[i].OSNIChildAgrmnt = (this.currencyFormatter(this.masterAgrmntList[i].OSNIChildAgrmnt.toString()));
          this.masterAgrmntList[i].PlafondAgrmntParent = (this.currencyFormatter(this.masterAgrmntList[i].PlafondAgrmntParent.toString()));
          this.masterAgrmntList[i].RequestedPlafond = (this.currencyFormatter(this.masterAgrmntList[i].RequestedPlafond.toString()));
          this.masterAgrmntList[i].RemainingPlafond = (this.currencyFormatter(this.masterAgrmntList[i].RemainingPlafond.toString()));
        }
      }
    );

    //Customer Age Validation
    await this.getMinMaxAgeCustPersonalFromGenSet();
    await this.validateCustPersonalAge();
        
    this.isAgrmntReady = true;
  }

  async viewDetailPlafondInstallment(AgrmntParentNo: string, AgrmntParentId: number, CustNo: string, GoLiveDt?: Date, MaturityDt?: Date)
  {
    //GoLiveDt Validation
    await this.validateGoLiveDtAgrmntParent(GoLiveDt);
    if (!this.isAgrmntParentGoLiveDtValid)
    {
      this.toastr.warningMessage(String.Format(ExceptionConstantX.IS_AGRMNT_PARENT_GO_LIVE_DT_VALID, this.monthFromGoLiveDt));
      return false;
    }

    //MaturityDt Validation
    await this.validateMaturityDtAgrmntParent(MaturityDt);
    if (!this.isAgrmntParentMaturityDtValid)
    {
      this.toastr.warningMessage(String.Format(ExceptionConstantX.IS_AGRMNT_PARENT_MATURITY_DT_VALID, this.monthFromMaturyityDateDt));
      return false;
    }

    //AppInProgress Validation
    let objMPFFD = {
      AgrParentNo: AgrmntParentNo
    };
    await this.http.post(URLConstantDsf.CheckIfAgrmntParentHasOngoingAppV2Dsf, objMPFFD).toPromise().then(
      (response) => {
        let ResponseObj = response[CommonConstant.ReturnObj];
        if(!ResponseObj.IsAvailable)
        {
          this.toastr.warningMessage(ExceptionConstantDsf.SLC_AGR_PARENT_NOT_AVAILABLE);
          return false;
        }
      }
    )

    this.linkUrl = environment.losR3Web + "/Nap/AddProcess/" + PathConstantDsf.PLAFOND_INSTALLMENT_SIMULATION_DETAIL + "?AgrmntParentId=" + AgrmntParentId + "&CustNo=" + CustNo;
    window.open(this.linkUrl, '_blank');
  }

  async getMinMaxAgeCustPersonalFromGenSet()
  {
    var businessDt:Date = new Date(this.UserAccess[CommonConstant.BUSINESS_DT]);
    // jika bukan personal atau (family & bukan spouse) maka skip
    if(this.masterAgrmntList[0].MrCustTypeCode != CommonConstant.CustTypePersonal)
    {
      this.minCustPerAge = 0;
      this.minCustPerAgeDt = new Date(businessDt);
      return;
    }

    await this.http.post(URLConstant.GetGeneralSettingValueByCode, {Code: CommonConstant.GSCodeCustAgeLimit}).toPromise().then(
      (response) => {
        var listGsAge: Array<string> = response && response["GsValue"] ? response["GsValue"].split(';') : [17];
        this.minCustPerAge = Number(listGsAge[0]);
        this.maxCustPerAge = listGsAge && listGsAge.length > 1 ? Number(listGsAge[1]) : 0;

        this.minCustPerAgeDt = new Date(businessDt);
        this.minCustPerAgeDt.setFullYear(this.minCustPerAgeDt.getFullYear() - this.minCustPerAge);

        if(this.maxCustPerAge > 0 && this.maxCustPerAge > this.minCustPerAge) {
          this.maxCustPerAgeDt = new Date(businessDt);
          this.maxCustPerAgeDt.setFullYear(this.maxCustPerAgeDt.getFullYear() - this.maxCustPerAge);
        }
      }
    );
  }

  async validateCustPersonalAge()
  {
    // jika bukan personal atau (family & bukan spouse) maka skip
    if(
      this.masterAgrmntList[0].MrCustTypeCode != CommonConstant.CustTypePersonal
    ) return true;

    var birthDt:Date = new Date(this.masterAgrmntList[0].BirthDate);

    if(this.maxCustPerAge > 0 && (birthDt > this.minCustPerAgeDt || birthDt < this.maxCustPerAgeDt))
    {
      this.toastr.warningMessage(String.Format(ExceptionConstant.CUST_AGE_BETWEEN, this.minCustPerAge, this.maxCustPerAge));
      this.isAgrmntReady = false;
      return false;
    }

    if(birthDt > this.minCustPerAgeDt)
    {
      this.toastr.warningMessage(String.Format(ExceptionConstant.CUST_AGE_MIN, this.minCustPerAge));
      this.isAgrmntReady = false;
      return false;
    }

    return true;
  }

  async validateGoLiveDtAgrmntParent(agrmntParentGoLiveDt: Date){
									  
    let reqObj = {
        code: CommonConstantX.GSCodeDistanceGoLiveDtToSystemDt
    }
    await this.http.post(URLConstant.GetGeneralSettingByCode, reqObj).toPromise().then(
      (response: {GsCode: string, GsName: string, GsValue: string, GsDescr: string}) => {
        if(response.GsValue !== undefined && response.GsValue !== null && response.GsValue !== ""){
          this.monthFromGoLiveDt = parseInt(response.GsValue)
									 
        }
      });

    const monthDifference =  this.getMonthDifference(new Date(agrmntParentGoLiveDt),new Date(this.UserAccess[CommonConstant.BUSINESS_DT]));
    if( this.monthFromGoLiveDt < monthDifference){
      this.isAgrmntParentGoLiveDtValid = true
    } else {
      this.isAgrmntParentGoLiveDtValid = false
    }
  }

  async validateMaturityDtAgrmntParent(agrmntParentMaturityDt){
											 
    let reqObj = {
        code: CommonConstantX.GSCodeDistanceMaturityDtToSystemDt
    }
    await this.http.post(URLConstant.GetGeneralSettingByCode, reqObj).toPromise().then(
      (response: {GsCode: string, GsName: string, GsValue: string, GsDescr: string}) => {
        if(response.GsValue !== undefined && response.GsValue !== null && response.GsValue !== ""){
											   
          this.monthFromMaturyityDateDt = parseInt(response.GsValue)
									  
											
        }
      });
    const monthDifference =  this.getMonthDifference(new Date(this.UserAccess[CommonConstant.BUSINESS_DT]),new Date(agrmntParentMaturityDt));
    if(this.monthFromMaturyityDateDt <= monthDifference){
      this.isAgrmntParentMaturityDtValid  = true;
    } else {
      this.isAgrmntParentMaturityDtValid  = false;
    }
  }

  getMonthDifference(startDate, endDate) {
    return (
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear())
    );
  }

  currencyFormatter(value: string) {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  onPageCustomerChange($event) {
    this.pageIndex = Number($event);
    this.currentItemsCustomerToShow =  this.customerMasterAgrmntList.slice((this.pageIndex-1)*this.pageSize, ((this.pageIndex-1)*this.pageSize) + this.pageSize);
    this.currentItemsCustomerToShow;
  }

  onChangePageSize(pageSize)
  {
    this.pageSize = Number(pageSize);
    this.pageIndex = 1;
    this.currentItemsCustomerToShow =  this.customerMasterAgrmntList.slice(0, ((this.pageIndex-1)*this.pageSize) + this.pageSize)
    this.isCustomerReady = true;
  }

  onPageAgrmntChange($event) {
    this.pageIndexAgrmnt = Number($event);
    this.currentItemsMasterAgrmntToShow =  this.masterAgrmntList.slice((this.pageIndexAgrmnt-1)*this.pageSizeAgrmnt, ((this.pageIndexAgrmnt-1)*this.pageSizeAgrmnt) + this.pageSizeAgrmnt);
    this.currentItemsMasterAgrmntToShow;
  }

  onChangePageSizeAgrmnt(pageSize)
  {
    this.pageSizeAgrmnt = Number(pageSize);
    this.pageIndexAgrmnt = 1;
    this.currentItemsMasterAgrmntToShow =  this.masterAgrmntList.slice(0, ((this.pageIndexAgrmnt-1)*this.pageSizeAgrmnt) + this.pageSizeAgrmnt);
    this.isAgrmntReady = true;
  }

}
