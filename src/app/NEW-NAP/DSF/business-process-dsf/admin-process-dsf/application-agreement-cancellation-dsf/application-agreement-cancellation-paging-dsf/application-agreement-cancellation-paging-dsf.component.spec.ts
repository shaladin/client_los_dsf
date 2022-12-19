import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAgreementCancellationPagingDsfComponent } from './application-agreement-cancellation-paging-dsf.component';

describe('ApplicationAgreementCancellationPagingDsfComponent', () => {
  let component: ApplicationAgreementCancellationPagingDsfComponent;
  let fixture: ComponentFixture<ApplicationAgreementCancellationPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAgreementCancellationPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAgreementCancellationPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
