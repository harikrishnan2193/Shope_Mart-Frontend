import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{
  allProducts:any = []

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.getWishlistitem()
  }

  getWishlistitem(){
    this.api.getWishlistItemapi().subscribe({
      next:(res:any)=>{
        this.allProducts =res
        console.log(this.allProducts);
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  removeitem(id:any){
    this.api.removeItermFromWishlist(id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.getWishlistitem()
        this.api.getWishlistCount()
        
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
            text: "Product added To CART successfully",
            icon: "success"
          });
          this.api.getCartCount()
          this.removeitem(product._id)
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


}
