import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-customer-request-detail',
  templateUrl: './mou-customer-request-detail.component.html',
  providers: [NGXToastrService]
})
export class MouCustomerRequestDetailComponent implements OnInit {
  mouType: string;
  WfTaskListId: number;
  inputLookupCust: InputLookupObj;
  pageType: string = "add";
  mouCustId: number;
  refOfficeId: number;
  businessDtMin: Date;
  mouCustUrl: string;
  custId : number;
  custUrl : string;
  MOUMainInfoForm = this.fb.group({
    MouCustId: [0, [Validators.required]],
    MouCustNo: [''],
    MouCustDt: ['', [Validators.required]],
    TopupMouCustId: [],
    StartDt: ['', [Validators.required]],
    EndDt: ['', [Validators.required]],
    RefNo: [''],
    IsRevolving: [false],
    CurrCode: [''],
    PlafondAmt:  ['', [Validators.required, Validators.min(1.00)]],
    RealisationAmt: [0],
    MouStat: ['NEW', [Validators.required]],
    MrMouTypeCode: ['', [Validators.required]],
    Notes: [''],
    SrvyOrderNo: [''],
    MrCustTypeCode: [''],
    RowVersion: ['']
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] != null) {
        this.pageType = params['mode'];
      }
      if (params['MouCustId'] != null) {
        this.mouCustId = params['MouCustId'];
      }
      if (params['MrMouTypeCode'] != null) {
        this.mouType = params['MrMouTypeCode'];
      }
      if (params['WfTaskListId'] != null) this.WfTaskListId = params['WfTaskListId'];
    });
   }

  ngOnInit() {
    console.log('Shinano');

    if (this.WfTaskListId > 0)
      this.claimTask();

    var datePipe = new DatePipe("en-US");
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var context = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.businessDtMin = new Date(context[CommonConstant.USER_ACCESS]);
    this.businessDtMin.setDate(this.businessDtMin.getDate());
    
    this.inputLookupCust = new InputLookupObj();
    this.inputLookupCust.urlJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";
    this.inputLookupCust.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupCust.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupCust.pagingJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";
    this.inputLookupCust.genericJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";

    this.inputLookupCust.ddlEnvironments = [
      {
        name: "A.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
   
    var refOffice = new RefOfficeObj();
    refOffice.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.httpClient.post(URLConstant.GetRefOfficeByOfficeCode, refOffice).subscribe(
      (response: any) => {
        this.refOfficeId = response.RefOfficeId;
      },
      (error) => {
        console.log(error);
      }
    );

    if(this.pageType == "edit" || this.pageType == "return"){
      var mouCust = new MouCustObj();
      mouCust.MouCustId = this.mouCustId;
      this.httpClient.post(URLConstant.GetMouCustById, mouCust).subscribe(
        (response: any) => { 
          response["MouCustDt"] = datePipe.transform(response["MouCustDt"], "yyyy-MM-dd");
          response["StartDt"] = datePipe.transform(response["StartDt"], "yyyy-MM-dd");
          response["EndDt"] = datePipe.transform(response["EndDt"], "yyyy-MM-dd");
          this.MOUMainInfoForm.patchValue({
            ...response
          });
          var custObj = { CustNo: response['CustNo'] }; 
          this.httpClient.post(URLConstant.GetCustByCustNo, custObj).subscribe(
            (response: any) => { 
              this.custId = response['CustId'];
            });

        },
        (error) => {
          console.log(error);
        }
      );
    }
    else{
      this.MOUMainInfoForm.patchValue({
        MrMouTypeCode: this.mouType
      });
    }
  }

  async claimTask()
  {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME]};
    console.log(wfClaimObj);
    this.httpClient.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }

  Back(): void {
    this.location.back();
  }

  Save(){
    var mouCustFormData = this.MOUMainInfoForm.value;
    if(this.pageType == "add"){
      mouCustFormData["RefOfficeId"] = this.refOfficeId;
      this.httpClient.post(URLConstant.AddMouCust, mouCustFormData).subscribe(
        (response: any) => {
          this.toastr.successMessage(response["Message"]);
          var mouCustId = response["MouCustId"];
          this.router.navigate(["/Mou/Detail", this.mouType], { queryParams: { mouCustId: mouCustId }});
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else if(this.pageType == "edit" || this.pageType == "return"){
      this.httpClient.post(URLConstant.EditMouCust, mouCustFormData).subscribe(
        (response: any) => {
          this.toastr.successMessage(response["Message"]);
          if(this.pageType == "return"){
            this.router.navigate(['/Mou/Detail', this.mouType], { queryParams: { mouCustId: mouCustFormData.MouCustId, mode : "return" }});
          }
          else{
            this.router.navigate(['/Mou/Detail', this.mouType], { queryParams: { mouCustId: mouCustFormData.MouCustId }});
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  OpenView(key: string){
    if(key == "mou"){
      AdInsHelper.OpenMOUCustViewByMouCustId(this.mouCustId);
    }else if( key == "cust"){
      AdInsHelper.OpenCustomerViewByCustId(this.custId);
    }
  }
}
