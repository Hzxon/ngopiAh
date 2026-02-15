import { useState, useEffect } from 'react'

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null); // <-- Ganti imageURL jadi imageFile
  const [loading, setLoading] = useState(false); // <-- Buat indikator loading

  // Mengambil data dari Backend saat website pertama kali dibuka
  useEffect(() => {
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai loading

    try {
      let finalImageUrl = "";

      // 1. Cek apakah user upload file?
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile); // 'image' harus sama dengan di backend (upload.single('image'))

        // Kirim ke Backend buat di-upload ke Cloudinary
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        finalImageUrl = uploadResult.imageUrl; // Dapat URL dari Cloudinary!
      }

      // 2. Simpan Produk ke Database (Neon)
      // Kirim URL gambar yang barusan didapat
      await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price,
          image: finalImageUrl // Kirim URL Cloudinary ke database
        }),
      });

      // 3. Reset Form & Refresh Data
      setName('');
      setPrice('');
      setImageFile(null);
      alert('Produk berhasil disimpan!');
      window.location.reload(); // Cara curang biar data update (nanti bisa diperbagus)

    } catch (error) {
      console.error("Gagal:", error);
      alert('Gagal menyimpan produk');
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  return (
    <div className="container">
      <h1>Toko Online Hazron</h1>

      <form onSubmit={handleSubmit} className="form-box">
        <input
          type="text"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {/* INPUT FILE BARU */}
        <input
          type="file"
          accept="image/*" // Cuma boleh pilih gambar
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {/* Tombol berubah jadi "Loading..." pas lagi upload */}
        <button type="submit" disabled={loading}>
          {loading ? 'Sedang Upload...' : 'Simpan Produk'}
        </button>
      </form>

      {/* Bagian Menampilkan Produk (List) */}
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="card">
            {/* Tampilkan gambar kalau ada */}
            {product.image && (
              <img src={product.image} alt={product.name} style={{ width: '100px' }} />
            )}
            <h3>{product.name}</h3>
            <p>Rp {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App
