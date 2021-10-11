import { Component, OnInit } from '@angular/core';
import { Product } from 'src/model/product';
import { Groupe } from 'src/model/groupe';
import { ActivatedRoute } from '@angular/router';
import { ProductAPIService } from '../services/product-api.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public product:Product = {
    id: 0,
    name: "",
    scientificName: "",
    groupId: 0,
    subGroupId: 0
  };
  public groups:Groupe[];
  public subgroups: Groupe[];

  public breadcrumbs = [
    {name: "Home", routerLink: "/home"},
    {name: "", routerLink: null}
  ]

  public loading: Boolean = false;

  constructor(private route: ActivatedRoute,
    private productAPI: ProductAPIService) { }

  ngOnInit(): void {
    this.loading = true;
    this.productAPI.getProducts("products/v1.0/?includes=groups,subgroups")
      .subscribe(data => {
        this.subgroups = data.subgroups;
        this.groups = data.groups;
        this.loading = false;
      });
    var id = this.route.snapshot.paramMap.get('id');
    this.productAPI.getProduct("/products/v1.0/"+id).subscribe(data => {
      this.product = data;
      this.breadcrumbs[this.breadcrumbs.length-1].name = this.product.name;
      this.loading = false;
    })
  }

  putProduct(){
    this.loading = true;
    this.productAPI.putProduct("/products/v1.0/"+ this.product.id, this.product)
    .subscribe(data =>{
      this.loading = false;
      console.log(data);
    })
  }

}
