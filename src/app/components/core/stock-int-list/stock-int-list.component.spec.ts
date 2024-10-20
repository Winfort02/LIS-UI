import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIntListComponent } from './stock-int-list.component';

describe('StockIntListComponent', () => {
  let component: StockIntListComponent;
  let fixture: ComponentFixture<StockIntListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockIntListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockIntListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
