import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/models/product';
import { Responses } from 'src/app/models/responses';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ProductAPIService {


  constructor(private http: HttpClient,
    private toastr: ToastrService) { }

  public API_URL = "/products/v1.0/";


  private handleError<T>(result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.log(error)
      this.toastr.error(error.message, 'Veuillez vérifier ID de produit!', {
        timeOut: 5000,
      });
      return of(result);
    };
  }


  // url : /products/v1.0/?keywords=onion&includes=groups,subgroups
  // keywords, includes (option)
  getProducts(keywords?: string): Observable<Responses> {
    var url = "";
    if (keywords) url = this.API_URL + "?keywords=" + keywords + "&includes=groups,subgroups";
    else url = this.API_URL + "?includes=groups,subgroups";
    return this.http.get<Responses>(url).pipe(
      catchError(this.handleError<Responses>())
    );
  }

  // url : /product/913
  getProduct(id: string): Observable<Product> {
    let url = this.API_URL + id;
    return this.http.get<Product>(url).pipe(
      catchError(this.handleError<Product>())
    );
  }

  // url : /products/v1.0/
  postProduct(product: Product): Observable<Product> {
    // console.log(product)
    return this.http.post<Product>(this.API_URL, product).pipe(
      catchError(this.handleError<Product>())
    );
  }

  // url: /products/v1.0/:id
  deleteProduct(id: string): Observable<Product> {
    let url = this.API_URL + id;
    return this.http.delete<Product>(url).pipe(
      catchError(this.handleError<Product>())
    );
  }

  // url: /products/v1.0/:id
  putProduct(product: Product): Observable<Product> {
    let url = this.API_URL + product.id.toString();
    return this.http.put<Product>(url, product).pipe(
      catchError(this.handleError<Product>())
    );
  }
}

