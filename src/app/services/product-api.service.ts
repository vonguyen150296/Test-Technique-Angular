import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/model/product';
import { Responses } from 'src/model/responses';


@Injectable({
  providedIn: 'root'
})
export class ProductAPIService {


  constructor(private http: HttpClient) { }


  // url : /products/v1.0/?keywords=onion&includes=groups,subgroups
  // keywords, includes (option)
  getProducts(url: string){
    return this.http.get<Responses>(url);
  }


  // url : /product/913
  getProduct(url: string){
    return this.http.get<Product>(url);
  }

  // url : /products/v1.0/
  postProduct(url: string, product: Product){
    return this.http.post<Product>(url, product);
  }

  // url: /products/v1.0/:id
  deleteProduct(url: string){
    return this.http.delete(url);
  }

  // url: /products/v1.0/:id
  putProduct(url: string, product: Product){
    return this.http.put<Product>(url, product);
  }
}
