import { Component, OnInit, ViewChild } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { ReceiptDsfObj } from 'app/dsf/model/ReceiptDsfObj.Model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { DatePipe } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcapprovalcreateComponent } from '@adins/Ucapprovalcreate';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-customer-group-plafond-detail',
  templateUrl: './customer-group-plafond-detail.component.html',
  styleUrls: ['./customer-group-plafond-detail.component.css'],
  providers: [NGXToastrService]
})
export class CustomerGroupPlafondDetailComponent implements OnInit {

  viewCustomerGroupPlafondDetailObj: UcViewGenericObj = new UcViewGenericObj();
  pageType: string = "add";
  CustGrpPlafondId: any;
  CustGrpPlfndObj: any;
  CustGrpPlfndObjAPL: Object;
  CustGrpPlfndObjOPL: Object;
  CustGrpPlfndObjLMS: Object;
  resultData: any;
  InputObj: UcInputRFAObj;
  IsReady: Boolean = false;
  ApprovalCreateOutput: any;

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }

  plafondProposalForm = this.fb.group({
    PlafondMax: ['',Validators.required],
    StartPlafondDate: ['',Validators.required],
    EndPlafondDate: ['',Validators.required],
    ListApprover: [''],
    Reason: [''],
    Notes: [''],
    ApvRecommendation: this.fb.array([])
  });
  readonly CancelLink: string = NavigationConstantDsf.CUSTOMER_GROUP_PLAFOND_PAGING;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder,private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] != null) {
        this.pageType = params['mode'];
      }
      if (params['CustGrpPlafondId'] != null) {
        this.CustGrpPlafondId = params['CustGrpPlafondId'];
      }
    });
  }


 
  ngOnInit() {
    this.viewCustomerGroupPlafondDetailObj.viewInput = "./assets/ucviewgeneric/viewCustomerGroupPlafondDetail.json";
    var datePipe = new DatePipe("en-US");
    if (this.pageType == "add") {
      this.GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId();
      this.initInputApprovalObj();
    }
    else if (this.pageType == "edit") { 
      
    }
  }

  GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId() {
    var obj = { CustomerGroupPlafondDsfId: this.CustGrpPlafondId }
    this.http.post(URLConstantDsf.GetListCustomerGroupPlafondDetailDsfByCustomerGroupPlafondId, obj).subscribe(
      (response) => {
        this.CustGrpPlfndObj = response;
      }
    );
  }

  initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
    let Attributes = [{}]
    let TypeCode = {
      "TypeCode": "MOUC_GEN_APV_TYPE",
      "Attributes": Attributes,
    }
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_MOU_APV_GENERAL;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_MOU_APV_GENERAL;

    // this.http.post(URLConstant.GetProductById, {Id : this.ProdId}).subscribe(
    //   (response) => {
    //     this.InputObj.TrxNo = response["ProdCode"];
    //     this.IsReady = true;
    //   });

    this.InputObj.TrxNo = "-";
    this.IsReady = true;
  }

  SaveForm():void {
    

    if (this.pageType == "add") {
      
  }
  else {

  }
  }

}
