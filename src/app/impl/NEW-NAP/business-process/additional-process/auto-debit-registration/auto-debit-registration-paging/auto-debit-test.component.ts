import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-auto-debit-test',
    templateUrl: './auto-debit-test.component.html'
  })
  export class AutoDebitTestComponent implements OnInit {
    constructor(private http: HttpClient){

    }
    

    ngOnInit() {
        window.addEventListener("message", (event) => {
            this.http.post(environment.losUrl + "/v1/AutoDebitRegistration/TestingOnly", {}).subscribe(
                (response) => {
                    window.postMessage(response, event.origin);
                }
            )
        })
    }

    hitApi()
    {
        
    }
  }