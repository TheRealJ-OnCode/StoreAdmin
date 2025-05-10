const productModel = require("../db/models/product.model");

const updateStockController = async (req, res) => {
  const { product_id } = req.query;
  if (!product_id) {
    return res.status(400).json({ message: "Eksik parametre" });
  }

  try {
    const product = await productModel.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    // Eğer ürünün alternatif varyantları varsa
    if (product.product_alternatives && product.product_alternatives.length > 0) {
      if (!req.body.alternatives || !Array.isArray(req.body.alternatives)) {
        return res.status(400).json({ message: "Alternatif güncelleme bilgisi eksik" });
      }
      // Her alternatif için gelen değere göre güncelleme yapıyoruz
      req.body.alternatives.forEach(({ key, count }) => {
        if (!key || typeof count !== "number") return; // Geçersiz verileri atla
        const alternative = product.product_alternatives.find(alt => alt.key === key);
        if (alternative) {
          alternative.count = (alternative.count || 0) + count;
        }
      });
      // Genel stok miktarını tüm alternatiflerin toplamı olarak güncelle
      product.product_count = product.product_alternatives.reduce(
        (total, alt) => total + (alt.count || 0),
        0
      );
    } else {
      // Varyant yoksa, doğrudan genel stok miktarını güncelle
      if (typeof req.body.count !== "number") {
        return res.status(400).json({ message: "Stok miktarı belirtilmeli" });
      }
      product.product_count += req.body.count;
    }

    await product.save();
    return res.json({ message: "Stok güncellendi", product });
  } catch (error) {
    console.error("Stok güncellenirken hata oluştu:", error);
    return res.status(500).json({ message: "Stok güncellenirken hata oluştu" });
  }
};

module.exports = updateStockController;
