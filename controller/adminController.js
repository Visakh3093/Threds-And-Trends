const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const categorySchema = require("../models/categoryModel")





const adminLogin = (req, res) => {
  res.render("admin-login");
};

const getAdmin = (req, res) => {
  res.render("admin-page");
};

const addProduct = async (req, res) => {
  try{
    const categoryData = await categorySchema.find()
    res.render("add-product",{category:categoryData});
  }
  catch(err)
  {
    console.log(err)
  }
  
};

const loadadminUser = async (req, res) => {
  try {
    const userlist = await userModel.find({ isAdmin: false });

    res.render("admin-user", { users: userlist });
  } catch (err) {
    console.log(err);
  }
};

const blockUser = async (req, res) => {
  

  try {
    const id = req.query.id;
  
    const userData = await userModel.findById({ _id: id });
  
    if (userData.isVerified === true) {
      await userModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isVerified: false } }
      );
  
    } else {
      await userModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isVerified: true } }
      );

    }
  
    res.redirect("/admin/userlist");
  
  } catch (err) {
    console.log(err);
  }
};

const verifyAdmin = async (req, res, next) => {
  const username = req.body.email;
  const password = req.body.password;

  const userdata = await userModel.findOne({ email: username });
  if (userdata.isAdmin === true) {
    if (userdata.password === password) {
      req.session.admin_id = userdata._id;
      req.session.admin = userdata.email;
      next();
    } else {
      res.render("admin-login",{message:'wrong passwrod'});
      // console.log("password error");
    }
  } else {
    res.render("admin-login",{message:'you are not a administrator'});
    // console.log("user not found");
  }
};

const isLogin = (req, res, next) => {
  if (req.session.admin) {
    next()
  } else {
    res.render("admin-login");
  }
};

const isLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};
const loadProduct = async (req, res, next) => {
  try {
    const images = req.files;
    const product = new productModel({
      name: req.body.sname,
      category: req.body.scategory,
      price: req.body.sprice,
      description: req.body.sdescription,
      rating: req.body.srating,
      image: images.map((x) => x.filename),
    });
    await product.save().then(() => console.log("product saved"));

    next()
  } catch (error) {
    console.log(error.message);
  }
};

const displayProduct = async (req, res) => {
  try {
    const productlist = await productModel.find();

    res.render("admin-product", { product: productlist });
  } catch (err) {
    console.log(err);
  }
};

const dltProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const productData = await productModel.findOne({ _id: id });

    if (productData.isAvailable === true) {
      await productModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable: false } }
      );
    } else {
      await productModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isAvailable: true } }
      );
    }

    res.redirect("/admin/product");
  } catch (err) {
    console.log(err);
  }
};

const getEdit = async (req, res) => {
  try {
    const id = req.query.id;

    const Sproduct = await productModel.findById({ _id: id });
    console.log(Sproduct);
    if (Sproduct) {
      res.render("edit-product", { product: Sproduct });
    } else {
      res.redirect("/admin/product");
    }
  } catch (err) {
    console.log(err);
  }
};

const editProduct = async (req, res) => {
  try {
    console.log(req.body.id);
    await productModel.findByIdAndUpdate({ _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          price: req.body.sprice,
          description: req.body.sdescription,
          rating: req.body.srating,
          category: req.body.scategory,
          image: req.body.sname,
        },
      }
    );

    res.redirect("/admin/product");
  } catch (err) {
    console.log(err);
  }
};

const loadCategory = async(req,res)=>{
  try{
    const categoryData = await categorySchema.find()
    res.render('admin-category',{category:categoryData})
  }
  catch(err){
    console.log(err)
  }
}

const unlistCategory = async (req,res)=>{
  try{
    const id = req.query.id
    await categorySchema.updateOne({_id:id},{$set:{isAvailable:0}})
    res.redirect('/admin/adminCategory')
  }
  catch(err)
  {
    console.log(err)
  }
} 

const listCategory = async (req,res)=>{
  try{

    const id = req.query.id
    await categorySchema.updateOne({_id:id},{$set:{isAvailable:1}})
    res.redirect('/admin/adminCategory')
  }
  catch(err){
    console.log(err)
  }
}

const addCategory = async (req,res)=>{
  try{
    // const categoryName = req.body.category
    const categoryData = await categorySchema.findOne({name:req.body.category})
    if(categoryData){
      res.redirect('/admin/adminCategory')

    }
    else
    {
      const category = categorySchema({name:req.body.category})
      await category.save()
      res.redirect('/admin/adminCategory')
    }
   

  }  
  catch(err){
    console.log(err)
  }
}


module.exports = {
  getAdmin,
  adminLogin,
  verifyAdmin,
  isLogin,
  isLogout,
  loadadminUser,
  blockUser,
  loadProduct,
  displayProduct,
  addProduct,
  dltProduct,
  getEdit,
  editProduct,
  loadCategory,
  unlistCategory,
  listCategory,
  addCategory
};
