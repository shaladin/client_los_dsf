import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-tab-analysis-result-history',
  templateUrl: './tab-analysis-result-history.component.html'
})
export class TabAnalysisResultHistoryComponent implements OnInit {
  @Input() appId: number;
  @Input() BizTemplateCode: string;

  isShowDetail: boolean = false;
  listAppCrdRvw: any;
  appCrdRvwHId: number;

  urlLink: string = "";
  isShowCrdRvw: boolean = false;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.GetListAppCrdRvwById();
  }

  async GetListAppCrdRvwById(){
    var obj = { Id: this.appId };
    await this.http.post(URLConstant.GetListAppCrdRvwById, obj).toPromise().then(
      (response) => {
        this.listAppCrdRvw = response;
        if (this.listAppCrdRvw.length > 0){
          this.isShowCrdRvw = true;
        }
      }
    );
  }

  ViewCreditReviewAnalysisDetail(appCrdRvwHId){
    this.appCrdRvwHId = appCrdRvwHId;
    this.isShowDetail = true;
  }

  closeDetailHandler()
  {
    this.isShowDetail = false;
  }
}
