import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppGuarantorObj } from 'app/shared/model/AppGuarantorObj.Model';
import { HttpClient } from '@angular/common/http';
import { GuarantorObj } from 'app/shared/model/GuarantorObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppWizardObj } from 'app/shared/model/App/AppWizard.Model';
import { WizardComponent } from 'angular-archwizard';

@Component({
  selector: 'app-guarantor-paging',
  templateUrl: './guarantor-paging.component.html',
  styleUrls: []
})
export class GuarantorPagingComponent implements OnInit {

  @Input() AppId: any;
  @Output() callbackSubmit: EventEmitter<AppWizardObj> = new EventEmitter();

  inputGridObj: any;
  closeResult: any;
  AppGuarantorId : any;
  MrGuarantorTypeCode : any;
  mode: any;
  appWizardObj: AppWizardObj;

  constructor(private http: HttpClient,
    private modalService: NgbModal,
    private wizard: WizardComponent) {
      this.appWizardObj = new AppWizardObj(this.wizard, AdInsConstant.AppStepRef);
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
    console.log("test")
    this.callbackSubmit.emit(this.appWizardObj);
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

}
