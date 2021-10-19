import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProductAPIService } from 'src/app/services/product-api.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule
      ],
      providers: [
        ProductAPIService,
        ToastrService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("ngOnInit", () => {
    spyOn(component, 'getProducts');
    component.ngOnInit();
    expect(component.getProducts).toHaveBeenCalled();
  })

  it("searchProducts", () => {
    spyOn(component, 'getProducts');
    component.keywords = "test";
    component.searchProducts();
    expect(component.getProducts).toHaveBeenCalled();
  })

  describe("setData", () => {
    beforeEach(() => {
      component.listProductsCopy = [
        {
          groupId: 132,
          id: 0,
          name: "Nom du produit",
          scientificName: "Nom scientifique du produit",
          subGroupId: 133
        }
      ];
      component.listProducts = [];
    })

    it("with keywords", () => {
      component.keywords = "test";
      component.setdata();
      expect(component.listProducts.length).toEqual(0)
    })
    it("without keywords", () => {
      component.keywords = "";
      component.setdata();
      expect(component.listProducts).toEqual(component.listProductsCopy);
    })
  })


  it("postProduct", () => {
    spyOn(component, 'postProduct');
    
    var button = fixture.debugElement.nativeElement.querySelector('#newProduct');
    button.click();
    fixture.detectChanges();
    expect(component.postProduct).toHaveBeenCalled();
  })
  

  it("deleteProduct", () => {
    component.listProducts = [
      {
        groupId: 132,
        id: 0,
        name: "Nom du produit",
        scientificName: "Nom scientifique du produit",
        subGroupId: 133
      }
    ]
    component.loading = false;
    spyOn(component, 'deleteProduct');
    fixture.detectChanges();
    var button = fixture.debugElement.nativeElement.querySelector('.mat-card button.btnDelete');
    button.click();
    fixture.detectChanges();
    expect(component.deleteProduct).toHaveBeenCalled();
  })
});
