import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Groupe } from 'src/app/models/groupe';
import { ActivatedRoute } from '@angular/router';
import { ProductAPIService } from '../../services/product-api.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public product: Product = {
    id: 0,
    name: "",
    scientificName: "",
    groupId: 0,
    subGroupId: 0
  };
  public groups: Groupe[];
  public subgroups: Groupe[];

  public breadcrumbs: string[] = ["Home",""];

  public loading: Boolean = false;

  constructor(private route: ActivatedRoute,
    private productAPI: ProductAPIService,
    private toastr: ToastrService) { }

  // form validator
  nameProduct = new FormControl(this.product.name, [Validators.required]);
  scientificNameProduct = new FormControl(this.product.scientificName, [Validators.required]);

  ngOnInit(): void {
    var groups: string = "[]";
    if(localStorage.getItem("groups") !== 'undefined') groups = localStorage.getItem("groups") || "[]";
    this.groups = JSON.parse(groups);
    let subgroups = "[]";
    if(localStorage.getItem("subgroups") !== 'undefined') subgroups =  localStorage.getItem("subgroups") || "[]";
    this.subgroups = JSON.parse(subgroups);
    this.getProduct();
   
  }

  getProduct(){
    this.loading = true;
    var id = this.route.snapshot.paramMap.get('id') || "";
    this.productAPI.getProduct(id).subscribe(
      (data) => {
        this.product = data;
        this.breadcrumbs[this.breadcrumbs.length - 1] = this.product.name;
        this.loading = false;
      });
  }

  putProduct() {
    if(!this.product.name) this.toastr.error("Erreur!", 'Veuillez entrer le nom du produit!', { timeOut: 3000});
    else if(!this.product.scientificName) this.toastr.error("Erreur!", 'Veuillez entrer le Nom scientifique du produit!', { timeOut: 3000});
    else{
      this.loading = true;
      this.productAPI.putProduct(this.product)
      .subscribe(
        (data) => {
        this.breadcrumbs[this.breadcrumbs.length - 1] = this.product.name;
        this.loading = false;
        this.toastr.success(data.name, 'Ce produit est mis à jour!');
      });
    }
  }

}
