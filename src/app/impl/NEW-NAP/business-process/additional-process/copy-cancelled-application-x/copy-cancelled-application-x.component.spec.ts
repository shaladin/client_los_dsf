import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyCancelledApplicationXComponent } from './copy-cancelled-application-x.component';

describe('CopyCancelledApplicationXComponent', () => {
  let component: CopyCancelledApplicationXComponent;
  let fixture: ComponentFixture<CopyCancelledApplicationXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyCancelledApplicationXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyCancelledApplicationXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
