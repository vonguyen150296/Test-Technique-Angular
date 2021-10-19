import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { ProductAPIService } from 'src/app/services/product-api.service';

import { ProductDetailComponent } from './product-detail.component';


describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatProgressSpinnerModule

      ],
      providers: [
        ProductAPIService,
        ToastrService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (id: number) => { id: 1 } } }
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.product).toBeDefined();
    expect(component.groups).toBeDefined();
    expect(component.subgroups).toBeDefined();
    expect(component.breadcrumbs).toBeDefined();
    expect(component.loading).toBeDefined();
  });

  it("ngOnInit", () => {
    spyOn(component, 'getProduct');
    component.ngOnInit();
    expect(component.getProduct).toHaveBeenCalled();
  });

  it("putProduct", () => {
    component.product.name = "Test";
    component.product.scientificName = "Test";
    component.loading = false;
    spyOn(component, 'putProduct');
    
    fixture.detectChanges();
    var button = fixture.debugElement.nativeElement.querySelector('.product-detail-form button#btnSubmit');
    button.click();
    fixture.detectChanges();
    expect(component.putProduct).toHaveBeenCalled();

  })

});

