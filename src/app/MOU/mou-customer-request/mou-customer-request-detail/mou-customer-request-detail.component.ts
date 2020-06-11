import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RefOfficeObj } from 'app/shared/model/RefOfficeObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-mou-customer-request-detail',
  templateUrl: './mou-customer-request-detail.component.html',
  providers: [NGXToastrService]
})
export class MouCustomerRequestDetailComponent implements OnInit {
  mouType: string;
  WfTaskListId: any;
  inputLookupCust: InputLookupObj;
  pageType: string = "add";
  mouCustId: number;
  refOfficeId: number;
  businessDtMin: Date;
  mouCustUrl: string;
  CustNo : string;
  custId : any;
  custUrl : string;
  MOUMainInfoForm = this.fb.group({
    MouCustId: [0, [Validators.required]],
    MouCustNo: [''],
    MouCustDt: ['', [Validators.required]],
    TopupMouCustId: [],
    CustNo: ['', [Validators.required]],
    CustName: ['', [Validators.required]],
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
    if (this.WfTaskListId != null || this.WfTaskListId != undefined)
      this.claimTask();

    var datePipe = new DatePipe("en-US");
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var context = JSON.parse(localStorage.getItem("UserAccess"));
    this.businessDtMin = new Date(context["BusinessDt"]);
    this.businessDtMin.setDate(this.businessDtMin.getDate());
    
    this.inputLookupCust = new InputLookupObj();
    this.inputLookupCust.urlJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";
    this.inputLookupCust.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupCust.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupCust.pagingJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";
    this.inputLookupCust.genericJson = "./assets/uclookup/MOU/lookupCust_MOURequest.json";
    this.mouCustUrl =  environment.losR3Web + "/Mou/Cust/View?MouCustId=" + this.mouCustId;
   
    var refOffice = new RefOfficeObj();
    refOffice.OfficeCode = currentUserContext["OfficeCode"];
    this.httpClient.post(AdInsConstant.GetRefOfficeByOfficeCode, refOffice).subscribe(
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
      this.httpClient.post(AdInsConstant.GetMouCustById, mouCust).subscribe(
        (response: any) => { 
          response["MouCustDt"] = datePipe.transform(response["MouCustDt"], "yyyy-MM-dd");
          response["StartDt"] = datePipe.transform(response["StartDt"], "yyyy-MM-dd");
          response["EndDt"] = datePipe.transform(response["EndDt"], "yyyy-MM-dd");
          this.MOUMainInfoForm.patchValue({
            ...response
          });
          var custObj = { CustNo: response['CustNo'] }; 
          this.httpClient.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
            (response: any) => { 
              this.custId = response['CustId'];
              this.custUrl = environment.FoundationR3Web + '/Customer/CustomerView/Page?CustId=' + this.custId;
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
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"]};
    console.log(wfClaimObj);
    this.httpClient.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  Back(): void {
    this.location.back();
  }

  getCustLookupResponse(e){
    this.MOUMainInfoForm.patchValue({
      CustNo: e.custNo,
      CustName: e.custName,
      MrCustTypeCode: e.mrCustTypeCode
    });
  }

  Save(){
    var mouCustFormData = this.MOUMainInfoForm.value;
    if(this.pageType == "add"){
      mouCustFormData["RefOfficeId"] = this.refOfficeId;
      this.httpClient.post(AdInsConstant.AddMouCust, mouCustFormData).subscribe(
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
      this.httpClient.post(AdInsConstant.EditMouCust, mouCustFormData).subscribe(
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

}
