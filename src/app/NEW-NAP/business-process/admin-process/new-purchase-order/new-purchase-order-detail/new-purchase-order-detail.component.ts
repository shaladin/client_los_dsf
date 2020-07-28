import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PoEntryComponent } from './po-entry/po-entry.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-new-purchase-order-detail',
  templateUrl: './new-purchase-order-detail.component.html',
  styles: []
})
export class NewPurchaseOrderDetailComponent implements OnInit {
  urlDetail: string;
  lobCode: string;
  AppId: number;
  AgrmntId: number;
  TaskListId: number;
  arrValue: Array<number>;
  POList: Array<Object>;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private toastr: NGXToastrService, 
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { 
    this.POList = new Array<Object>();
    this.arrValue = new Array<number>();
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["LobCode"] != null) {
        this.lobCode = params["LobCode"];
      }
      else{
        this.lobCode = CommonConstant.CFNA;
      }
    });
  }

  ngOnInit() {
    this.claimTask();
    this.arrValue.push(this.AgrmntId);
    
    this.http.post(URLConstant.GetPurchaseOrderListForNewPOByAppId, { AppId: this.AppId }).subscribe(
      (response) => {
        this.POList = response["PurchaseOrderForNewPOObjs"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.TaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  POEntryHandler(idx){
    const modalPOEntry = this.modalService.open(PoEntryComponent);
    modalPOEntry.componentInstance.SupplCode = this.POList[idx]["SupplCode"];
    modalPOEntry.componentInstance.PurchaseOrderHId = this.POList[idx]["PurchaseOrderHId"];
    modalPOEntry.componentInstance.AppId = this.AppId;
    modalPOEntry.componentInstance.AgrmntId = this.POList[idx]["AgrmntId"];
    modalPOEntry.componentInstance.MouNo = this.POList[idx]["MouNo"];
    modalPOEntry.result.then(
      (response) => {
        this.spinner.show();
        this.http.post(URLConstant.GetPurchaseOrderListForNewPOByAppId, { AppId: this.AppId }).toPromise().then(
          (response) => {
            this.POList = response["PurchaseOrderForNewPOObjs"];
          }
        ).catch(
          (error) => {
            console.log(error);
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    ).catch(
      (error) => {
        if (error != 0) {
          console.log(error);
        }
      }
    );
  }

  Cancel() {
    this.router.navigate(["/Nap/AdminProcess/NewPurchaseOrder/Paging"], { queryParams: { "BizTemplateCode": CommonConstant.CFNA } });
  }

  Save(){
    var isPOResolved = true;
    for (const item of this.POList) {
      if(!item["PurchaseOrderNo"] || item["PurchaseOrderNo"] === ""){
        isPOResolved = false;
      }
    }
    if(!isPOResolved){
      this.toastr.errorMessage("Please Resolve All Purchase Order");
    }
    else{
      this.toastr.successMessage("Success");
      this.router.navigate(["/Nap/AdminProcess/NewPurchaseOrder/Paging"], { queryParams: { "BizTemplateCode": CommonConstant.CFNA } });
    }
  }
}
