import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementViewContainerComponent } from './agreement-view-container.component';

describe('AgreementViewContainerComponent', () => {
  let component: AgreementViewContainerComponent;
  let fixture: ComponentFixture<AgreementViewContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementViewContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
