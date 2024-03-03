import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent implements OnInit {

  allproduct:any = []

  constructor(private api:ApiService){ }

  ngOnInit(): void {
    this.api.getallproductapi().subscribe({
      next:(res:any)=>{
        this.allproduct = res
        console.log(res);
        
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
            text: "Product added To WISHLIST successfully",
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
