import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-guarantor-paging-FL4W',
  templateUrl: './guarantor-paging-FL4W.component.html',
  styleUrls: []
})
export class GuarantorPagingFL4WComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  inputGridObj: InputGridObj;
  result: any = new Array();
  ListCustNoPersonal : any = new Array();
  ListCustNoCompany : any = new Array();
  closeResult: string;
  AppGuarantorId: number;
  MrGuarantorTypeCode: string;
  mode: string;
  appWizardObj: AppWizardObj;
  closeChk: any;
  MrCustRelationshipCode: any = new Array();

  constructor(private http: HttpClient, private modalService: NgbModal, private toastr: NGXToastrService) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/searchGuarantor.json";
    this.inputGridObj.deleteUrl = URLConstant.DeleteAppGuarantor;
    var guarantorObj = new GuarantorObj();
    guarantorObj.AppId = this.AppId;
    this.http.post(URLConstant.GetAppGuarantorList, guarantorObj).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
        this.result = this.inputGridObj.resultData.Data;
        for(let i=0;i<this.result.length;i++){
          var tempGuarantor = this.result[i]['MrGuarantorTypeCode'];
          var tempCustNo = this.result[i]['CustNo'];
          if(tempGuarantor == CommonConstant.CustTypePersonal && this.ListCustNoPersonal.includes(tempCustNo) == false){
            this.ListCustNoPersonal.push(this.result[i]['CustNo']);
          }
          else if(tempGuarantor == CommonConstant.CustTypeCompany && this.ListCustNoCompany.includes(tempCustNo)  == false){
            this.ListCustNoCompany.push(this.result[i]['CustNo']);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.loadGuarantorListData(this.AppId);
  }

  Cancel(){
    this.outputCancel.emit();
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
    this.outputTab.emit();
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
            this.ListCustNoPersonal = [];
            this.ListCustNoCompany = [];
            for(let i=0;i<this.result.length;i++){
              var tempGuarantor = this.result[i]['MrGuarantorTypeCode'];
              var tempCustNo = this.result[i]['CustNo'];
              if(tempGuarantor == CommonConstant.CustTypePersonal && this.ListCustNoPersonal.includes(tempCustNo) == false){
                this.ListCustNoPersonal.push(this.result[i]['CustNo']);
              }
              else if(tempGuarantor == CommonConstant.CustTypeCompany && this.ListCustNoCompany.includes(tempCustNo)  == false){
                this.ListCustNoCompany.push(this.result[i]['CustNo']);
              }
            }
          },
          (error) => {
            console.log(error);
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
        this.inputGridObj.resultData.Data = response[CommonConstant.ReturnObj];
        this.result = this.inputGridObj.resultData.Data;
        for(let i=0;i<this.result.length;i++){
          var tempGuarantor = this.result[i]['MrGuarantorTypeCode'];
          var tempCustNo = this.result[i]['CustNo'];
          if(tempGuarantor == CommonConstant.CustTypePersonal && this.ListCustNoPersonal.includes(tempCustNo) == false){
            this.ListCustNoPersonal.push(this.result[i]['CustNo']);
          }
          else if(tempGuarantor == CommonConstant.CustTypeCompany && this.ListCustNoCompany.includes(tempCustNo)  == false){
            this.ListCustNoCompany.push(this.result[i]['CustNo']);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  close(event) {
    this.closeChk = event;
    if (this.closeChk) {
      this.loadGuarantorListData(this.AppId);
      this.modalService.dismissAll();
    }
  }
}
