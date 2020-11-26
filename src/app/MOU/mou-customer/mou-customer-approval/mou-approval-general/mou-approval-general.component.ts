import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { ApvViewInfo } from 'app/shared/model/ApvViewInfo.Model';

@Component({
  selector: 'app-mou-approval-general',
  templateUrl: './mou-approval-general.component.html',
  providers: [NGXToastrService]
})
export class MouApprovalGeneralComponent implements OnInit {
  mouCustObj: MouCustObj;
  MouCustId: number;
  taskId: number;
  instanceId: number;
  MouType : string = CommonConstant.GENERAL;
  inputObj: ApvViewInfo;
  link: any;
  resultData: any;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  mouCustObject: MouCustObj = new MouCustObj();
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

  onAvailableNextTask(event) {

  }

  onApprovalSubmited(event) {
    this.toastr.successMessage("Success");
    this.router.navigate(["/Mou/Cust/Approval"]);
  }

  onCancelClick() {
    this.router.navigate(["/Mou/Cust/Approval"]);
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
