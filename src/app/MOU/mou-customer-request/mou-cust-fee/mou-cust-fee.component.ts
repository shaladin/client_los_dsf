import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustFeeObj } from 'app/shared/model/MouCustFeeObj.Model';
import { MouCustFeeDetailComponent } from './mou-cust-fee-detail/mou-cust-fee-detail.component';

@Component({
  selector: 'app-mou-cust-fee',
  templateUrl: './mou-cust-fee.component.html',
  styleUrls: ['./mou-cust-fee.component.scss']
})
export class MouCustFeeComponent implements OnInit {
  @Input() MouCustId: number;
  @Output() ResponseMouCustFee: EventEmitter<any> = new EventEmitter<any>();
  mouCustFeeList: any;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private toastr: NGXToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    var mouCustFee = new MouCustFeeObj();
    mouCustFee.MouCustId = this.MouCustId;
    this.httpClient.post(AdInsConstant.GetMouCustFeeForMouRequestByMouCustId, mouCustFee).subscribe(
      (response) => { 
        this.mouCustFeeList = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openModalAddFee() {
    const modalMouFee = this.modalService.open(MouCustFeeDetailComponent);
    modalMouFee.componentInstance.MouCustId = this.MouCustId;
    modalMouFee.result.then(
      (response) => {
        this.spinner.show();
        var mouCustFee = new MouCustFeeObj();
        mouCustFee.MouCustId = this.MouCustId;
        this.httpClient.post(AdInsConstant.GetMouCustFeeForMouRequestByMouCustId, mouCustFee).subscribe(
          (response) => { 
            this.mouCustFeeList = response;
          },
          (error) => {
            console.log(error);
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    ).catch((error) => {
      if(error != 0){
        console.log(error);
      }
    });
  }

  deleteMouCustFee(mouCustFeeId, idx){
    if(confirm('Are you sure to delete this record?')){
      var mouCustFee = new MouCustFeeObj();
      mouCustFee.MouCustFeeId = mouCustFeeId;
      this.httpClient.post(AdInsConstant.DeleteMouCustFee, mouCustFee).subscribe(
        (response: any) => {
          this.mouCustFeeList.splice(idx, 1);
          this.toastr.successMessage(response["message"]);
        },
        (error) => {
          console.log(error);
        }
      );
    }  
  }

  next(){
    this.ResponseMouCustFee.emit({StatusCode: "200"});
  }

  back(){
    this.ResponseMouCustFee.emit({StatusCode: "-1"});
  }

}
