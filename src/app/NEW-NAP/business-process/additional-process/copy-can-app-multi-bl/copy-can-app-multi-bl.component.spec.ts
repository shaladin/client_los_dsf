import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyCanAppMultiBlComponent } from './copy-can-app-multi-bl.component';

describe('CopyCanAppMultiBlComponent', () => {
  let component: CopyCanAppMultiBlComponent;
  let fixture: ComponentFixture<CopyCanAppMultiBlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyCanAppMultiBlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyCanAppMultiBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
