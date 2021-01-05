import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ApvViewInfo } from 'app/shared/model/ApvViewInfo.Model';

@Component({
  selector: 'app-mou-approval-factoring',
  templateUrl: './mou-approval-factoring.component.html',
  providers: [NGXToastrService]
})
export class MouApprovalFactoringComponent implements OnInit {
  mouCustObj: MouCustObj;
  MouCustId : number;
  taskId: number;
  instanceId: number;
  inputObj: ApvViewInfo;
  MouType : string = "FACTORING";
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  resultData: any;
  MrCustTypeCode: string;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {

      if (params["MouCustId"] != null) {
        this.MouCustId = params["MouCustId"];
      }
      this.inputObj = new ApvViewInfo();
      this.inputObj.taskId = params["TaskId"];
      this.inputObj.instanceId =  params["InstanceId"];
      this.inputObj.approvalBaseUrl = environment.ApprovalR3Url;
    });
  }
  

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(URLConstant.GetMouCustById, this.mouCustObj).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
        this.MrCustTypeCode = response.MrCustTypeCode;
      }
    );
  }

  MouApprovalDataForm = this.fb.group({
  })

  onAvailableNextTask(event)
  {
    
  }

  onApprovalSubmited(event)
  {
    this.toastr.successMessage("Success");
    AdInsHelper.RedirectUrl(this.router,["/Mou/Cust/Approval"],{});
  }

  onCancelClick()
  {
    AdInsHelper.RedirectUrl(this.router,["/Mou/Cust/Approval"],{});
  }
  
  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }

  }
}
