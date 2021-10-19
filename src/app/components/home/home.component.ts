import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductAPIService } from '../../services/product-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public listProductsCopy: Product[] = []; 
  public listProducts: Product[] = [];
  public listProductsRemove: Product[] = [];
  public keywords: string = "";
  public loading: Boolean = false;
  public newProduct: Product = {
    groupId: 132,
    id: 0,
    name: "Nom du produit",
    scientificName: "Nom scientifique du produit",
    subGroupId: 133
  };

  constructor(private productAPI: ProductAPIService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // get list product removed in local
    let list = localStorage.getItem("listProductsRemove") || "[]";
    this.listProductsRemove = JSON.parse(list);
    // get data
    this.getProducts();
  }



  getProducts(keywords?: string) {
    console.log("Get products!")
    this.loading = true;
    this.productAPI.getProducts(keywords)
      .subscribe(
        (data) => {
          if(!keywords) this.listProductsCopy = data.hits;
          if(Object.keys(data).length !== 0){
            this.listProducts = data.hits;
            localStorage.setItem("subgroups", JSON.stringify(data.subgroups));
            localStorage.setItem("groups", JSON.stringify(data.groups));
          }
          this.loading = false;
        });
  }

  searchProducts() {
    if (this.keywords !== "") {
      this.listProducts = [];
      this.getProducts(this.keywords);
    }
  }

  // set products data when keywords null
  setdata() {
    if (this.keywords === "") this.listProducts = this.listProductsCopy;
  }

  deleteProduct(id: Number) {
    var res = confirm("Voulez-vous supprimer ce produit?");
    if (res) {
      this.loading = true;
      console.log("Suppression produit!");
      this.productAPI.deleteProduct(id.toString())
        .subscribe(
          (data) => {
          let indexProduct = 0;
          this.listProducts.forEach((element, index) => {
            if (element.id == id) {
              indexProduct = index;
            }
          });


          this.toastr.success(this.listProducts[indexProduct].name, 'Vous avez supprimé un produit!');
          this.listProductsRemove.push(this.listProducts[indexProduct]);
          localStorage.setItem("listProductsRemove", JSON.stringify(this.listProductsRemove));
          this.listProducts.splice(indexProduct, 1);

          this.loading = false;
        });
    }

  }

  postProduct() {
    this.loading = true;

    let product = this.newProduct; 
    if(this.listProductsRemove.length > 0){
      product = this.listProductsRemove[this.listProductsRemove.length-1];
    }
    
    this.productAPI.postProduct(product)
      .subscribe(
        (data) => {
        this.listProducts.unshift(data);
        this.toastr.success(data.name, 'Vous avez créé un nouveau produit!');
        let len = this.listProductsRemove.length;
        if(len>0){
          this.listProductsRemove.pop();
          localStorage.setItem("listProductsRemove", JSON.stringify(this.listProductsRemove));
        }
        this.loading = false;
      });
  }

}
