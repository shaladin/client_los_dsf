import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-app-collateral-single',
  templateUrl: './view-app-collateral-single.component.html'
})
export class ViewAppCollateralSingleComponent implements OnInit {
  viewObj: string;
  viewUOLObj: string;
  viewEnvironment: string;
  @Input() agrmntId: number = 0;
  @Input() AppCollateralId: number = 0;
  AppCollateralObj: AppCollateralObj = new AppCollateralObj();
  AppCollateralDocs: AppCollateralDocObj = new AppCollateralDocObj();
  arrValue = [];
  IsHidden: boolean = true;
  @Output() outputTab: EventEmitter<boolean> = new EventEmitter();
  @Input() isMulti: boolean = false;
  IsReady: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewCollateralData.json";
    this.viewUOLObj = "./assets/ucviewgeneric/viewCollateralDataUserOwnerLocation.json";
    if (this.AppCollateralId != 0) {
      this.arrValue.push(this.AppCollateralId);
      this.IsReady = true;
      this.http.post<Array<AppCollateralDocObj>>(URLConstant.GetListAppCollateralDocsByAppCollateralId, { AppCollateralId: this.AppCollateralId }).subscribe(
        (response) => {
          this.AppCollateralDocs = response["AppCollateralDocs"];
        }
      );
    } else {
      this.http.post<AppCollateralObj>(URLConstant.GetAppCollateralByAgrmntId, { AgrmntId: this.agrmntId }).subscribe(
        (response) => {
          this.AppCollateralObj = response;
          this.arrValue.push(this.AppCollateralObj.AppCollateralId);
          this.IsReady = true;
          this.http.post<Array<AppCollateralDocObj>>(URLConstant.GetListAppCollateralDocsByAppCollateralId, this.AppCollateralObj).subscribe(
            (response) => {
              this.AppCollateralDocs = response["AppCollateralDocs"];
            }
          );
        });
    }
    this.viewEnvironment = environment.losUrl;
  }

  Back() {
    this.outputTab.emit(this.IsHidden);
  }
}
