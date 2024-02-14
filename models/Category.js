const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Категорийн  нэрийг оруулна уу"],
    unique: true,
    trim: true,
    maxlength: [50, "Категорийн нэрийн дээд талд 50 тэмдэгт авна"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Категорийн төрлийг заавал оруулах ёстой "],
    maxlength: [500, "Категорийн тайлбарын  дээд талд 500 тэмдэгт авна"],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  averageRating: {
    type: Number,
    min: [1, "Рэйтинг хамгийн багдаа 1 байх ёстой "],
    max: [10, "Рэйтинг хамгийн багдаа 1 байх ёстой "],
  },
  averagePrice: Number,
  createAt: {
    type: Date,
    default: Date.now,
  }
},{toJSON:{virtuals:true},toObject:{virtuals:true}});

CategorySchema.virtual('books',{
  ref:'Book',
  localField:'_id',
  foreignField:'category',
  justOne:false

});

CategorySchema.pre("remove",async function (next) {
  //name хөрвүүлэх
  console.log("removing...");
  await this.model("Book").deleteMany({category:this._id})

  next();
});


CategorySchema.pre("save", function (next) {
  //name хөрвүүлэх
  this.slug = slugify(this.name);
  this.averageRating=Math.floor(Math.random()*10)+1;
  // this.averagePrice=Math.floor(Math.random()*100000)+3000;
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
