import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { AppCollateralDocObj } from 'app/shared/model/app-collateral-doc-obj.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';

@Component({
  selector: 'app-view-app-collateral-single',
  templateUrl: './view-app-collateral-single.component.html'
})
export class ViewAppCollateralSingleComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  viewUOLObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() agrmntId: number = 0;
  @Input() AppCollateralId: number = 0;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();
  AppCollateralDocs: Array<AppCollateralDocObj> = new Array<AppCollateralDocObj>();
  arrValue = [];
  IsHidden: boolean = true;
  @Output() outputTab: EventEmitter<boolean> = new EventEmitter();
  @Input() isMulti: boolean = false;
  IsReady: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewCollateralData.json";
    this.viewUOLObj.viewInput = "./assets/ucviewgeneric/viewCollateralDataUserOwnerLocation.json";

    if (this.AppCollateralId != 0) {
      this.arrValue.push(this.AppCollateralId);
      this.viewGenericObj.whereValue = this.arrValue;
      this.viewUOLObj.whereValue = this.arrValue;
      this.IsReady = true;
      this.http.post<Array<AppCollateralDocObj>>(URLConstant.GetListAppCollateralDocsByAppCollateralId, { Id: this.AppCollateralId }).subscribe(
        (response) => {
          this.AppCollateralDocs = response["AppCollateralDocs"];
        }
      );
    } else {
      this.http.post<AppCollateralObj>(URLConstant.GetAppCollateralByAgrmntId, { Id: this.agrmntId }).subscribe(
        (response) => {
          this.AppCollateralObj = response;
          this.arrValue.push(this.AppCollateralObj.AppCollateralId);
          this.IsReady = true;
          this.http.post<Array<AppCollateralDocObj>>(URLConstant.GetListAppCollateralDocsByAppCollateralId, { Id: this.AppCollateralObj.AppCollateralId}).subscribe(
            (response) => {
              this.AppCollateralDocs = response["AppCollateralDocs"];
            }
          );
        });
    }
  }

  Back() {
    this.outputTab.emit(this.IsHidden);
  }
}
