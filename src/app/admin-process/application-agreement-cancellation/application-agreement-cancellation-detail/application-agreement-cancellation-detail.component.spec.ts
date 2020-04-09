import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAgreementCancellationDetailComponent } from './application-agreement-cancellation-detail.component';

describe('ApplicationAgreementCancellationDetailComponent', () => {
  let component: ApplicationAgreementCancellationDetailComponent;
  let fixture: ComponentFixture<ApplicationAgreementCancellationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAgreementCancellationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAgreementCancellationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
