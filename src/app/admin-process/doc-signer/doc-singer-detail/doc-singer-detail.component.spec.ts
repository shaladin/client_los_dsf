import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSingerDetailComponent } from './doc-singer-detail.component';

describe('DocSingerDetailComponent', () => {
  let component: DocSingerDetailComponent;
  let fixture: ComponentFixture<DocSingerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocSingerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSingerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
