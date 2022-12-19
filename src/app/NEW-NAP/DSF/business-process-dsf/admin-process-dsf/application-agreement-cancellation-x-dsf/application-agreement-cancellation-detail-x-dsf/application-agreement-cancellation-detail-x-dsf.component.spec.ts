import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAgreementCancellationDetailXDsfComponent } from './application-agreement-cancellation-detail-x-dsf.component';

describe('ApplicationAgreementCancellationDetailXDsfComponent', () => {
  let component: ApplicationAgreementCancellationDetailXDsfComponent;
  let fixture: ComponentFixture<ApplicationAgreementCancellationDetailXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAgreementCancellationDetailXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAgreementCancellationDetailXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
