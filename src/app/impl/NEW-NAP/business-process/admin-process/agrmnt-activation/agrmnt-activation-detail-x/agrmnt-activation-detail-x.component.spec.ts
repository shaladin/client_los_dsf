import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrmntActivationDetailXComponent } from './agrmnt-activation-detail-x.component';

describe('AgrmntActivationDetailXComponent', () => {
  let component: AgrmntActivationDetailXComponent;
  let fixture: ComponentFixture<AgrmntActivationDetailXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgrmntActivationDetailXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgrmntActivationDetailXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
