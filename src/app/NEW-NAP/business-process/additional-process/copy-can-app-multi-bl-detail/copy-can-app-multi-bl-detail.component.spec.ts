import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyCanAppMultiBlDetailComponent } from './copy-can-app-multi-bl-detail.component';

describe('CopyCanAppMultiBlDetailComponent', () => {
  let component: CopyCanAppMultiBlDetailComponent;
  let fixture: ComponentFixture<CopyCanAppMultiBlDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyCanAppMultiBlDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyCanAppMultiBlDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
