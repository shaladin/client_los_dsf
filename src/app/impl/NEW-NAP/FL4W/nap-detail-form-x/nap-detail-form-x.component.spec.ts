import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapDetailFormXComponent } from './nap-detail-form-x.component';

describe('NapDetailFormXComponent', () => {
  let component: NapDetailFormXComponent;
  let fixture: ComponentFixture<NapDetailFormXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapDetailFormXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapDetailFormXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
