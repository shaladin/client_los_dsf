import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { UcTempPagingObj } from 'app/shared/model/temp-paging/uc-temp-paging-obj.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-generate-potential-ro-x',
  templateUrl: './generate-potential-ro-x.component.html',
  providers: [NGXToastrService]
})
export class GeneratePotentialRoXComponent implements OnInit {

  OfficeCode: string;
  OfficeName: string;
  dropdownListObj: UcDropdownListObj = new UcDropdownListObj();
  user: CurrentUserContext;

  ListSelected: Array<{CRT_OFFICE_CODE:String, ORI_OFFICE_CODE:String, ORI_OFFICE_NAME:String, CUST_NO:string, CUST_NAME:string, AGRMNT_ID:number, AGRMNT_NO:string, AGRMNT_DT:Date, MATURITY_DT: Date, PLAFOND_AGR:number, MAX_TENOR:number, PLAFOND_CUST_AMT: number, OS_NI: number, LOB_CODE: string}> = new Array<{CRT_OFFICE_CODE:String, ORI_OFFICE_CODE:String, ORI_OFFICE_NAME:String, CUST_NO:string, CUST_NAME:string, AGRMNT_ID:number, AGRMNT_NO:string, AGRMNT_DT:Date, MATURITY_DT: Date, PLAFOND_AGR:number, MAX_TENOR:number, PLAFOND_CUST_AMT: number, OS_NI: number, LOB_CODE: string}>();
  TempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  ListForTemp: Array<{CrtOfficeCode:String, OriOfficeCode:String, OriOfficeName:String, CustNo:string, CustName:string, AgrmntId:number, AgrmntNo:string, AgrmntDt:Date, MaturityDt: Date, PlfndAgrmnt:number, RmnngTnr:number, PlfndCustAmnt: number, OsNi: number, LobCode: string}> = new Array<{CrtOfficeCode:String, OriOfficeCode:String, OriOfficeName:String, CustNo:string, CustName:string, AgrmntId:number, AgrmntNo:string, AgrmntDt:Date, MaturityDt: Date, PlfndAgrmnt:number, RmnngTnr:number, PlfndCustAmnt: number, OsNi: number, LobCode: string}>();

  constructor(
    private http: HttpClient,
    // private fb: FormBuilder,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) { this.route.queryParams.subscribe(params => {
    if (params["OfficeCode"] != null) this.OfficeCode = params["OfficeCode"];
    if (params["OfficeName"] != null) this.OfficeCode = params["OfficeName"];});
  }
  async ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.TempPagingObj.urlJson = "./assets/impl/ucpaging/ucTempPaging/GeneratePotentialROPaging.json";
    this.TempPagingObj.pagingJson = "./assets/impl/ucpaging/ucTempPaging/GeneratePotentialROPaging.json";

    this.TempPagingObj.isReady = true;
  }

  getListTemp(ev) {
    this.ListSelected = ev["TempListObj"];
  }

  onClickGenerate()
  {
    if (this.ListSelected.length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }


    var x = {
      "responseGenerateRoPotentialResultObjX" : this.ListSelected
    };
    this.http.post(URLConstantX.GenerateRoPotentialDataFromSpX, x).subscribe(
      (response) => {
        this.toastr.successMessage('Generate success with Batch No : '+response["BatchNo"]);
      });
  }
}
