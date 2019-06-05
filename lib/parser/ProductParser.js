class ProductParser{
  static parse(rawProduct){
    return {
      id: rawProduct.skuId,
      url: rawProduct.productUrl,
      image: rawProduct.image,
      location: rawProduct.location,
      name: rawProduct.name,
      rating: rawProduct.ratingScore,
      description: rawProduct.description.join(" "),
      brand: { name: rawProduct.brandName },
      price: { original: rawProduct.originalPrice, discount: rawProduct.discount, final: rawProduct.price },
      seller: { id: rawProduct.sellerId, name: rawProduct.sellerName },
      review: { apiCount: parseInt(rawProduct.review), databaseCount: 0 }
    }
  }
}
module.exports = ProductParser;