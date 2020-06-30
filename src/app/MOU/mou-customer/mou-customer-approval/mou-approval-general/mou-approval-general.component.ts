import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-mou-approval-general',
  templateUrl: './mou-approval-general.component.html',
  providers: [NGXToastrService]
})
export class MouApprovalGeneralComponent implements OnInit {
  mouCustObj: MouCustObj;
  MouCustId : number;
  taskId: number;
  instanceId: number;
  MouType : string = "GENERAL";
  inputObj: any;
  link : any; 
  resultData : any;
  viewObj : string;
  mouCustObject : MouCustObj = new MouCustObj();
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {

      if (params["MouCustId"] != null) {
        this.MouCustId = params["MouCustId"];
      }

      var obj = {
        taskId: params["TaskId"],
        instanceId: params["InstanceId"],
        approvalBaseUrl: environment.ApprovalR3Url
      }

      this.inputObj = obj;
    });
  }
  

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewMouHeader.json";
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(AdInsConstant.GetMouCustById, this.mouCustObj).subscribe(
      (response: MouCustObj) => {
        this.resultData = response; 
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
    this.router.navigate(["/Mou/Cust/Approval"]);
  }

  onCancelClick()
  {
    this.router.navigate(["/Mou/Cust/Approval"]);
  }
  GetCallBack(event)
  {  
    if(event.Key == "customer"){
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          // this.link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"];
          // window.open(this.link, '_blank');
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    
  }
}
