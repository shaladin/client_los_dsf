import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission-page',
  templateUrl: './submission-page.component.html'
})
export class SubmissionPageComponent implements OnInit {
  reason: string;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.reason = params["reason"];
    })
  }

  ngOnInit() {
  }
}
