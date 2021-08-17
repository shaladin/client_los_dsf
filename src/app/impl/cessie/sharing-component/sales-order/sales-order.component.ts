import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
    selector: 'cessie-sales-order-grid',
    templateUrl: './sales-order.component.html',
    styleUrls: []
})
export class SalesOrderComponent implements OnInit {

    @Input() CessieHXId: number;
    inputGridObj: InputGridObj;
    IsGridReady: boolean = false;
    WfTaskListId: number;
    constructor(private httpClient: HttpClient) {
    }

    ngOnInit() {
        this.inputGridObj = new InputGridObj();
        this.inputGridObj.pagingJson = "./assets/ucgridview/gridCessieListApp.json";

        var CessieObj = {
            Id: this.CessieHXId
        }

        this.httpClient.post(URLConstantX.GetListAppForView, CessieObj).subscribe(
            (response) => {
                this.inputGridObj.resultData = {
                    Data: ""
                }
                this.inputGridObj.resultData["Data"] = new Array();
                this.inputGridObj.resultData.Data = response["ReturnObject"]
                this.IsGridReady = true;
            });
    }
}
