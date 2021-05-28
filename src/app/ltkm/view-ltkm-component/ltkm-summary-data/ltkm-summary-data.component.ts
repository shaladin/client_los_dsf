import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { SummaryAppObj } from 'app/shared/model/App/SummaryAppObj.Model';
import { SerialNoObj } from 'app/shared/model/SerialNo/SerialNoObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
    selector: "view-ltkm-summary-app",
    templateUrl: "./ltkm-summary-data.component.html",
    providers: [NGXToastrService]
})

export class ViewLtkmSummaryDataComponent implements OnInit {
    @Input() LtkmCustId: number = 0;
    SummaryLtkmObj: any;

    constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {
    }

    ngOnInit() {
        this.http.post(URLConstant.GetSummaryByLtkmCustId, { Id: this.LtkmCustId }).pipe()
            .subscribe(
                (response) => {
                    this.SummaryLtkmObj = response["ReturnObject"];
                }
            );
    }

}
