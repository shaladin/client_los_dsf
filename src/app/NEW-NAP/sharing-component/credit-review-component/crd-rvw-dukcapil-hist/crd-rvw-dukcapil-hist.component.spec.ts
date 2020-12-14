import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwDukcapilHistComponent } from './crd-rvw-dukcapil-hist.component';

describe('CrdRvwDukcapilHistComponent', () => {
  let component: CrdRvwDukcapilHistComponent;
  let fixture: ComponentFixture<CrdRvwDukcapilHistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwDukcapilHistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwDukcapilHistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
