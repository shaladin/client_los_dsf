import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';

@Component({
  selector: 'app-uc-insurance-paging',
  templateUrl: './uc-insurance-paging.component.html',
  styleUrls: ['./uc-insurance-paging.component.css']
})
export class UcInsurancePagingComponent implements OnInit {

  @Input() DetailForGridCollateral: any;
  @Input() appId: number;
  @Output() select: EventEmitter<number> = new EventEmitter<number>();
  @Output() bindMultiInsGridData: EventEmitter<any> = new EventEmitter<any>();

  gridAppCollateralObj: InputGridObj = new InputGridObj();
  listAppCollateralIdtoDelete: Array<number> = new Array<number>();
  
  constructor(private http: HttpClient, private toastr : NGXToastrService) {
  }

  ngOnInit() {
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateralInsurance.json";
    this.gridAppCollateralObj.resultData = this.DetailForGridCollateral;
  }

  getIds(ev) {
    for (let i = 0; i < ev.length; i++) {
      if (ev[i].isActive != true) {
        let index = this.listAppCollateralIdtoDelete.findIndex(f=>f == ev[i].AppCollateralId)
        if(index != -1){
          this.listAppCollateralIdtoDelete.splice(index,1);
        }
      }
      else{
        let index = this.listAppCollateralIdtoDelete.findIndex(f=>f == ev[i].AppCollateralId)
        if(index == -1){
          this.listAppCollateralIdtoDelete.push(ev[i].AppCollateralId);
        }
      }
    }
  }

  deleteListCollateral(){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      let appAssetObj = new AppCollateralObj();
      appAssetObj.AppCollateralIds = this.listAppCollateralIdtoDelete;
      appAssetObj.AppId = this.appId;
      this.http.post(URLConstant.DeleteListInsuranceData, appAssetObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.bindMultiInsGridData.emit();
        }
      );
    }
  }

  event(event){
    this.select.emit(event.RowObj);
  }
}
