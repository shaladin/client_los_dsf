import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { HttpClient } from '@angular/common/http';
import { GuarantorObj } from 'app/shared/model/GuarantorObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppWizardObj } from 'app/shared/model/App/AppWizard.Model';

@Component({
  selector: 'app-guarantor-paging',
  templateUrl: './guarantor-paging.component.html',
  styleUrls: []
})
export class GuarantorPagingComponent implements OnInit {

  @Input() AppId: any;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();

  inputGridObj: any;
  closeResult: any;
  AppGuarantorId : any;
  MrGuarantorTypeCode : any;
  mode: any;
  appWizardObj: AppWizardObj;
  closeChk : any;

  constructor(private http: HttpClient, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/searchGuarantor.json";
    this.inputGridObj.deleteUrl = AdInsConstant.DeleteAppGuarantor;

    var guarantorObj = new GuarantorObj();
    guarantorObj.AppGuarantorObj.AppId = this.AppId;
    this.http.post(AdInsConstant.GetListAppGuarantor, guarantorObj).subscribe(
      (response) => {
        console.log("response: ");
        console.log(response);
        console.log(this.inputGridObj);
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["ReturnObject"]

      },
      (error) => {
        console.log(error);
      }
    );
  }

  add(content){
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

  SaveAndContinue()
  {
    this.outputTab.emit();
  }

  event(content,ev){
    this.open(content);
    console.log("CHECK EVENT");
    console.log(ev);
    this.AppGuarantorId = ev.AppGuarantorId;
    this.MrGuarantorTypeCode = ev.MrGuarantorTypeCode;
    console.log("CHECK EVENT");
    console.log(this.AppGuarantorId);
  }

  close(event){
    this.closeChk=event;
    if(this.closeChk){
    this.modalService.dismissAll();
    }
  }

}
