const mongoose = require('mongoose')
const productModel = require('../models/productModel')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
       

    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true 
    },

    mobile:{
         type:Number,
         required:true,
         unique:true
         
    },
    
    password:{ 
        type:String,
        required:true 
    },
    isAdmin:Boolean,
    isVerified:Boolean,
    cart:{
        item:[
            {
                productId:{
                    type:mongoose.Types.ObjectId,
                    ref:'products',
                    required:true
                },
                qty:{
                    type:Number,
                    required:true    
                },   
                price:{
                    type:Number

                }
            }
        ],
        totalPrice :{
            type:Number,
            default:0
        }
    },
    wishlist: {
        item: [{
          productId: {
            type: mongoose.Types.ObjectId,
            ref: 'products',
            required: true
          },
          price: {
            type: Number
          }
        }]
      }
   


})


userSchema.methods.addToCart = function (product) {
    const cart = this.cart
    const isExisting = cart.item.findIndex((objInItems) => {
      return (
        new String(objInItems.productId).trim() == new String(product._id).trim()
      )
    })
    if (isExisting >= 0) {
      cart.item[isExisting].qty += 1
    } else {
      cart.item.push({ productId: product._id, qty: 1, price: product.price })
    }
    cart.totalPrice += product.price
    console.log('User in schema:', this)
    return this.save()
  }
  
  
  
  userSchema.methods.removefromCart = async function (productId) {
    const cart = this.cart
    const isExisting = cart.item.findIndex(
      (objInItems) =>
        new String(objInItems.productId).trim() === new String(productId).trim()
    )
    if (isExisting >= 0) {
      const prod = await productModel.findById(productId)
      cart.totalPrice -= prod.price * cart.item[isExisting].qty
      cart.item.splice(isExisting, 1)
      console.log('User in schema:', this)
      return this.save()
    }
  }
  
  
  
  userSchema.methods.addToWishlist = function (product) {
    const wishlist = this.wishlist
    const isExisting = wishlist.item.findIndex(objInItems => {
      return new String(objInItems.productId).trim() == new String(product._id).trim()
    })
    if (isExisting >= 0) {
    } else {
      wishlist.item.push({
        productId: product._id,
        price: product.price
      })
    }
    return this.save()
  }
  
      
  
  userSchema.methods.removefromWishlist = async function (productId) {
    const wishlist = this.wishlist
    const isExisting = wishlist.item.findIndex(objInItems => new String(objInItems.productId).trim() === new String(productId).trim())
    if (isExisting >= 0) {
      await productModel.findById(productId)
      wishlist.item.splice(isExisting, 1)
      return this.save()
    }
  }

module.exports=mongoose.model('users',userSchema)