const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const BookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Номын  нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [250, "Номын нэрийн дээд талд 250 тэмдэгт авна"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },

    author: {
      type: String,
      required: [true, "Зоохиогчийн  нэрийг оруулна уу"],
      trim: true,
      maxlength: [50, "Кохиогчийн нэр талд 50 тэмдэгт авна"],
    },
    averageRating: {
      type: Number,
      min: [1, "Рэйтинг хамгийн багдаа 1 байх ёстой "],
      max: [10, "Рэйтинг хамгийн багдаа 1 байх ёстой "],
    },
    price: {
      type: Number,
      required: [true, "Номын үнийг оруулна уу"],
      min: [500, "Номын үнэ хамгийн багдаа 500 байх ёстой "],
    },
    balance: Number,
    content: {
      type: String,
      required: [true, "Номын тайлбарыг  оруулна уу"],
      trim: true,
      maxlength: [5000, "Номын нэрийн дээд талд 5000 тэмдэгт авна"],
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    available: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updateUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BookSchema.statics.computeCategoryAveragePrice = async function (catId) {
  const obj = await this.aggregate([
    { $match: { category: catId } },
    { $group: { _id: "$category", avgPrice: { $avg: "$price" } } },
  ]);
  console.log(obj);
  let avgPrice = null;
  if (obj.length > 0) avgPrice = obj[0].averagePrice;
  await this.model("Category").findByIdAndUpdate(catId, {
    averagePrice: avgPrice,
  });
  return obj;
};

BookSchema.post("save", function () {
  this.constructor.computeCategoryAveragePrice(this.category);
});

BookSchema.pre("remove", function () {
  this.constructor.computeCategoryAveragePrice(this.category);
});

BookSchema.virtual("zohiogch").get(function () {
  // return 'Amaraa'
  if (!this.author) return "";
  let tokens = this.author.split("");
  if (tokens.length === 1) tokens = this.auhtor.split(".");
  if (tokens.length === 2) return tokens[1];
  return tokens[0];
});

module.exports = mongoose.model("Book", BookSchema);
