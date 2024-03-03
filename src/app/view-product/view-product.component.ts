import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  product:any = {}

  constructor(private api:ApiService, private router:ActivatedRoute){}

  ngOnInit(): void {
    this.router.params.subscribe((res:any)=>{
      const id = res.id
      console.log(id);

      this.getAproduct(id)
      
    })
  }

  getAproduct(id:any){
    this.api.getaproductapi(id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.product = res[0]
        console.log(this.product);
        
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  addToCart(product:any){
    if (sessionStorage.getItem("token")) {
      Object.assign(product,{quantity:1})
      this.api.addToCartapi(product).subscribe({
        next:(res:any)=>{
          Swal.fire({
            position: "top",
            title: "Wow...",
            text: "Product added successfully",
            icon: "success"
          });
          this.api.getCartCount()
        },
        error:(err:any)=>{
          console.log(err);
          Swal.fire({
            position: "top",
            title: "Oops...",
            text: err.error,
            icon: "error"
          });
        }
      })
    }
    else{
      Swal.fire({
        position: "top",
        title: "Oops..",
        text: "Please Login",
        icon: "info"
      });
    }
  }

  addToWishlist(product:any){
    if (sessionStorage.getItem("token")) {
      this.api.addtowishlistapi(product).subscribe({
        next:(res:any)=>{
          console.log(res);
          this.api.getWishlistCount()
          Swal.fire({
            position: "top",
            title: "Wow..",
            text: "Product added to wishlist successfully",
            icon: "success"
          });         
        },
        error:(err:any)=>{
          console.log(err);
          Swal.fire({
            position: "top",
            title: "Oops..",
            text: `${err.error}`,
            icon: "error"
          });
          
        }
      })
    }
    else{
      Swal.fire({
        position: "top",
        title: "Oops..",
        text: "Please Login",
        icon: "info"
      });
    }
  }

}
