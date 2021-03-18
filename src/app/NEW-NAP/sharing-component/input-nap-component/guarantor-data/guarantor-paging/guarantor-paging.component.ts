import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { GuarantorObj } from 'app/shared/model/GuarantorObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppWizardObj } from 'app/shared/model/App/AppWizard.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppGuarantorObj } from 'app/shared/model/AppGuarantorObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-guarantor-paging',
  templateUrl: './guarantor-paging.component.html',
  styleUrls: []
})
export class GuarantorPagingComponent implements OnInit {

  @Input() AppId: any;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  inputGridObj: any;
  result: any = new Array();
  resultData: any;
  closeResult: any;
  AppGuarantorId: any;
  MrGuarantorTypeCode: any;
  mode: any;
  appWizardObj: AppWizardObj;
  closeChk: any;
  MrCustRelationshipCode: any = new Array();
  guarantorObj: GuarantorObj;

  constructor(private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/searchGuarantor.json";
    this.inputGridObj.deleteUrl = URLConstant.DeleteAppGuarantor;

    this.guarantorObj = new GuarantorObj();
    this.guarantorObj.AppId = this.AppId;
    this.http.post(URLConstant.GetAppGuarantorList, this.guarantorObj).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
        this.result = this.inputGridObj.resultData.Data;
      });
    this.loadGuarantorListData(this.AppId);
  }

  add(content) {
    this.mode = "add";
    this.open(content);
    this.AppGuarantorId = null;
  }
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  SaveAndContinue() {
    var guarantorObj = { Id: this.AppId };
    this.http.post(URLConstant.GetListAppGuarantorPersonalForView, guarantorObj).subscribe(
      (response) => {
        for (let i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
          if (response[CommonConstant.ReturnObj][i].MrMaritalStatCode == null || response[CommonConstant.ReturnObj][i].MrNationalityCode == null) {
            this.toastr.warningMessage(ExceptionConstant.PLEASE_COMPLETE_MANDATORY_INPUT);
            return;
          }
        }
        this.outputTab.emit();
      });
  }

  Cancel() {
    this.outputCancel.emit();
  }

  event(content, ev) {
    if (ev.Key == "edit") {
      this.AppGuarantorId = ev.RowObj.AppGuarantorId;
      this.MrGuarantorTypeCode = ev.RowObj.MrGuarantorTypeCode;
      this.open(content);
    }

    if (ev.Key == "delete") {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        var guarantorObj = new GuarantorObj();
        guarantorObj.AppGuarantorObj.AppGuarantorId = ev.RowObj.AppGuarantorId;
        guarantorObj.AppGuarantorObj.AppId = this.AppId;
        this.http.post(URLConstant.DeleteAppGuarantor, guarantorObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.inputGridObj.resultData = {
              Data: ""
            }
            this.inputGridObj.resultData["Data"] = new Array();
            this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj]
            this.result = this.inputGridObj.resultData.Data;
          }
        );
      }
    }
  }

  loadGuarantorListData(appId: number) {
    var guarantorObj = new AppGuarantorObj();
    guarantorObj.AppId = appId;
    this.http.post(URLConstant.GetAppGuarantorList, guarantorObj).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj]
        this.result = this.inputGridObj.resultData.Data;
      }); 
  }

  close(event) {
    this.closeChk = event;
    if (this.closeChk) {
      this.loadGuarantorListData(this.AppId);
      this.modalService.dismissAll();
    }
  }

}
