import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAgreementCancellationPagingComponent } from './application-agreement-cancellation-paging.component';

describe('ApplicationAgreementCancellationPagingComponent', () => {
  let component: ApplicationAgreementCancellationPagingComponent;
  let fixture: ComponentFixture<ApplicationAgreementCancellationPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAgreementCancellationPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAgreementCancellationPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
