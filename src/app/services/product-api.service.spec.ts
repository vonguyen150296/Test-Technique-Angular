import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ProductAPIService } from './product-api.service';
import { Responses } from '../models/responses';
import { Product } from '../models/product';
import { ToastrModule } from 'ngx-toastr';

describe('ProductAPIService', () => {
  let productService: ProductAPIService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,ToastrModule.forRoot()],
      providers: [ProductAPIService]
    });

    //Instantaites HttpClient, HttpTestingController and EmployeeService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    productService = TestBed.inject(ProductAPIService);
  });

  afterEach(() => {
    httpTestingController.verify(); //Verifies that no requests are outstanding.
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });


  // get products
  describe("#getAllProducts", () => {
    let responseExpect: Responses;
    let keywords: string;
    let urlExpect: string;

    beforeEach(() => {
      responseExpect = {
        hits: [
          {
            id: 1,
            name: "Test",
            scientificName: "Test",
            groupId: 1,
            subGroupId: 1
          }
        ],
        total: 1,
        groups: [
          { id: 0, name: "group test" }
        ],
        subgroups: [
          { id: 0, name: "subgroup test" }
        ]
      };

    });

    // Test case 1 : return responses with keywords
    it("should return responses with keywords!", () => {
      keywords = "test";
      urlExpect = productService.API_URL + "?keywords=" + keywords + "&includes=groups,subgroups";
      productService.getProducts(keywords).subscribe(
        res => expect(res).toEqual(responseExpect, "should return responses!"),
        fail
      );

      const req = httpTestingController.expectOne(urlExpect);
      expect(req.request.method).toEqual('GET');

      req.flush(responseExpect); //Return responseExpect
    });

    // Test case 2 : return responses without keywords
    it("should return responses without keywords!", () => {
      urlExpect = productService.API_URL + "?includes=groups,subgroups";
      productService.getProducts().subscribe(
        res => expect(res).toEqual(responseExpect, "should return responses!"),
        fail
      );

      const req = httpTestingController.expectOne(urlExpect);
      expect(req.request.method).toEqual('GET');

      req.flush(responseExpect); //Return responseExpect
    });

    // Test case 3: Error
    it("should turn 404 error", () => {
      urlExpect = productService.API_URL + "?includes=groups,subgroups";
      productService.getProducts().subscribe(
        res => expect(Object.keys(res).length).toEqual(0, "should return {}"),
        fail
      );

      const req = httpTestingController.expectOne(urlExpect);
      expect(req.request.method).toEqual('GET');

      const msg = "404 error";
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    })
  })

  // get product
  describe("#getProductWithId", () => {
    let resExpect: Product;
    let id: string;
    let urlExpect: string;

    beforeEach(() => {
      resExpect = {
        id: 1,
        name: "Test",
        scientificName: "Test",
        groupId: 1,
        subGroupId: 1
      };
      id = "1";
      urlExpect = productService.API_URL + id;

    });

    // test case 1: return responses!
    it("should return responses!", () => {
      productService.getProduct(id).subscribe(
        res => expect(res).toEqual(resExpect, "should return responses!"),
        fail
      );

      const req = httpTestingController.expectOne(urlExpect);
      expect(req.request.method).toEqual('GET');

      req.flush(resExpect);
    });

    // test case 2: error
    it("should turn 404 error", () => {
      productService.getProduct(id).subscribe(
        res => expect(Object.keys(res).length).toEqual(0, "should return {}"),
        fail
      );

      const req = httpTestingController.expectOne(urlExpect);
      expect(req.request.method).toEqual('GET');

      const msg = "404 error";
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    })

  })

  // post product
  describe("#postProduct", () => {
    let newProduct: Product;

    beforeEach(() => {
      newProduct = {
        id: 1,
        name: "Test",
        scientificName: "Test",
        groupId: 1,
        subGroupId: 1
      };

    });

    // test case 1: add product and return it
    it("should add a product and return it!", () => {
      productService.postProduct(newProduct).subscribe(
        res => expect(res).toEqual(newProduct, "should return the product!"),
        fail
      );

      // postProduct should have made one request to POST product
      const req = httpTestingController.expectOne(productService.API_URL);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(newProduct);

      // Expect server to return the product after POST
      const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: newProduct });
      req.event(expectedResponse);
    });

    // tese case 2: Error
    it('should turn 404 error', () => {
  
      productService.postProduct(newProduct).subscribe(
        res => expect(Object.keys(res).length).toEqual(0, "should return {}"),
        fail
      );
  
      const req = httpTestingController.expectOne(productService.API_URL);
  
      // respond with a 404 and the error message in the body
      const msg = '404 error';
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe("#putProduct", () => {
    let product: Product;
    let urlExpect: string;

    beforeEach(() => {
      product = {
        id: 1,
        name: "Test",
        scientificName: "Test",
        groupId: 1,
        subGroupId: 1
      };
      urlExpect = productService.API_URL+product.id.toString();

    });

    // test case 1: 
    it("should update the product!", () => {
      productService.putProduct(product).subscribe(
        res => expect(Object.keys(res).length).toEqual(0, "should return {}"),
        fail
      );

      // putProduct should have made one request to PUT product
      const req = httpTestingController.expectOne(urlExpect);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(product);

      // Expect server to return the product after PUT
      const expectedResponse = new HttpResponse({ status: 200 });
      req.event(expectedResponse);
    });

    // test case 2: Error
    it('should turn 404 error', () => {
  
      productService.putProduct(product).subscribe(
        res => expect(Object.keys(res).length).toEqual(0, "should return {}"),
        fail
      );
  
      const req = httpTestingController.expectOne(urlExpect);
  
      // respond with a 404 and the error message in the body
      const msg = '404 error';
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe("#deleteProduct", ()=>{
    let id: string;
    let urlExpect:string;

    beforeEach(()=>{
      id = "1";
      urlExpect = productService.API_URL+id;
    });

    // test case 1: 
    it("should delete the product!", () => {
      productService.deleteProduct(id).subscribe(
        res => expect(Object.keys(res).length).toEqual(0, "should return {}"),
        fail
      );

      // deleteProduct should have made one request to DELETE product
      const req = httpTestingController.expectOne(urlExpect);
      expect(req.request.method).toEqual('DELETE');

      // Expect server to return the product after DELETE
      const expectedResponse = new HttpResponse({ status: 200 });
      req.event(expectedResponse);
    });

    // test case 2: Error
    it('should turn 404 error', () => {
      productService.deleteProduct(id).subscribe(
        res => expect(Object.keys(res).length).toEqual(0, "should return {}"),
        fail
      );
  
      const req = httpTestingController.expectOne(urlExpect);

  
      // respond with a 404 and the error message in the body
      const msg = '404 error';
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });
});
