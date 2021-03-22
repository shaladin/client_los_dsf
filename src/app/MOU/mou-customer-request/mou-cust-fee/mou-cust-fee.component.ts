import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustFeeObj } from 'app/shared/model/MouCustFeeObj.Model';
import { MouCustFeeDetailComponent } from './mou-cust-fee-detail/mou-cust-fee-detail.component';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-mou-cust-fee',
  templateUrl: './mou-cust-fee.component.html'
})
export class MouCustFeeComponent implements OnInit {
  @Input() MouCustId: number;
  @Output() ResponseMouCustFee: EventEmitter<any> = new EventEmitter<any>();
  mouCustFeeList: any;
  refFeeIdList : any;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private toastr: NGXToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.refFeeIdList = new Array();
    var mouCustFee = new MouCustFeeObj();
    mouCustFee.MouCustId = this.MouCustId;
    this.httpClient.post(URLConstant.GetMouCustFeeForMouRequestByMouCustId, {Id: this.MouCustId}).subscribe(
      (response) => {
        this.mouCustFeeList = response;
        for (var i = 0; i < this.mouCustFeeList.length; i++) {
          this.refFeeIdList.push(this.mouCustFeeList[i]['RefFeeId']);
        }
      });
  }

  openModalAddFee() {
    const modalMouFee = this.modalService.open(MouCustFeeDetailComponent, {size: 'lg', windowClass: 'modal-sm'});
    modalMouFee.componentInstance.MouCustId = this.MouCustId;
    modalMouFee.componentInstance.UsedRefFeeIdList = this.refFeeIdList;
    modalMouFee.result.then(
      (response) => {
        this.spinner.show();
        var mouCustFee = new MouCustFeeObj();
        mouCustFee.MouCustId = this.MouCustId;
        this.httpClient.post(URLConstant.GetMouCustFeeForMouRequestByMouCustId, mouCustFee).subscribe(
          (response) => {
            this.mouCustFeeList = response;
            this.refFeeIdList = new Array();
            for (var i = 0; i < this.mouCustFeeList.length; i++) {
              this.refFeeIdList.push(this.mouCustFeeList[i]['RefFeeId']);
            }
            modalMouFee.componentInstance.UsedRefFeeIdList = this.refFeeIdList;
          }
        );
        this.spinner.hide();
        this.toastr.successMessage(response["message"]);
      }
    ).catch((error) => {
    });
  }

  deleteMouCustFee(mouCustFeeId, idx) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var mouCustFee = new MouCustFeeObj();
      mouCustFee.MouCustFeeId = mouCustFeeId;
      this.httpClient.post(URLConstant.DeleteMouCustFee, { Id: mouCustFeeId }).subscribe(
        (response: any) => {
          this.mouCustFeeList.splice(idx, 1);
          this.refFeeIdList.splice(idx, 1);
          this.toastr.successMessage(response["message"]);
        });
    }
  }

  next() {
    this.ResponseMouCustFee.emit({ StatusCode: "200" });
  }

  back() {
    this.ResponseMouCustFee.emit({ StatusCode: "-1" });
  }

}
