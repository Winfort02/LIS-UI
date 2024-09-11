import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrinalysisDetailComponent } from './urinalysis-detail.component';

describe('UrinalysisDetailComponent', () => {
  let component: UrinalysisDetailComponent;
  let fixture: ComponentFixture<UrinalysisDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrinalysisDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UrinalysisDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
