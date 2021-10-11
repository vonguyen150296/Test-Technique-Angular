import { Component, OnInit } from '@angular/core';
import { Product } from 'src/model/product';
import { Responses } from 'src/model/responses';
import { ProductAPIService } from '../services/product-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public listProducts: Product[] = [];
  public keywords: string = "";
  public loading: Boolean = false;
  public productRemove: Product = {
    groupId: 132,
    id: 0,
    name: "Nom du produit",
    scientificName: "Nom scientifique du produit",
    subGroupId: 133
  };
  public listProductsRemove: Product[] = [];

  constructor(private productAPI: ProductAPIService) { }

  ngOnInit(): void {
    this.getData();

  }



  getData(keywords?: string) {
    var urltmp = "products/v1.0/?includes=groups,subgroups";
    if (keywords) {
      urltmp = "products/v1.0/?keywords=" + keywords + "&includes=groups,subgroups";
    }
    console.log("getData")
    this.loading = true;
    this.productAPI.getProducts(urltmp)
      .subscribe(data => {
        this.listProducts = data.hits;
        this.loading = false;
      });
  }

  search() {
    if (this.keywords !== "") {
      this.listProducts = [];
      this.getData(this.keywords);
    }
  }

  keyup() {
    if (this.keywords === "") this.getData();
  }

  deleteProduct(id: Number) {
    var res = confirm("Voulez-vous supprimer ce produit?");
    if (res) {
      var url = `products/v1.0/${id}`;
      this.loading = true;
      this.productAPI.deleteProduct(url)
        .subscribe(data => {
          var indexProduct = 0;
          this.listProducts.forEach((element, index) => {
            if (element.id === id) {
              this.productRemove = element;
              indexProduct = index;
            }
          });

          this.listProducts.splice(indexProduct, 1);
          this.listProductsRemove.push(this.productRemove);

          console.log("suppression produit!");
          console.log(this.productRemove);

          this.loading = false;
        });
    }

  }

  postProduct() {
    this.loading = true;
    this.productAPI.postProduct("products/v1.0/", this.productRemove)
      .subscribe(data => {
        this.listProducts.unshift(data);
        this.loading = false;
      });

    var index = this.listProductsRemove.length - 1;
    this.listProductsRemove.splice(index, 1);

    if (this.listProductsRemove.length > 0) {
      // prendre dernier produit supprimé
      this.productRemove = this.listProductsRemove[index - 1];
    } else {
      this.productRemove = {
        groupId: 132,
        id: 0,
        name: "Nom du produit",
        scientificName: "Nom scientifique du produit",
        subGroupId: 133
      };
    }
  }

}
