import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  allProduct:any = []
  total:number = 0


  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.getAllCartItem()
  }

  getAllCartItem(){
    this.api.getCartItemapi().subscribe({
      next:(res:any)=>{
        this.allProduct = res
        this.getTotalPrice()
        
      },
      error:(err:any)=>{
        console.log(err);
      
      }
    })
  }

  getTotalPrice(){
    this.total = Math.ceil(this.allProduct.map((item:any)=>item.grantTotal).reduce((n1:any,n2:any)=>n1+n2))
    console.log(this.total);
    
  }

  removeCartItem(id:any){
    this.api.removeCartItem(id).subscribe((res:any)=>{
      this.getAllCartItem()
      this.api.getCartCount()
    })
  }

  incrementCartProduct(id:any){
    this.api.incrementCartItem(id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.getAllCartItem()
        this.api.getCartCount()
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  decrementCartProduct(id:any){
    this.api.decrementCartItem(id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.getAllCartItem()
        this.api.getCartCount()
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  emptyAllCartProduct(){
    this.api.emptyAllCartProduct().subscribe({
      next:(res:any)=>{
        console.log(res);
        this.getAllCartItem()
        this.api.getCartCount()
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  checkOut(){
    sessionStorage.setItem("total",JSON.stringify(this.total))
  }

}
