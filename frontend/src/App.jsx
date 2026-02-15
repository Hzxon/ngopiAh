import { useState, useEffect } from 'react'

function App() {
  const [products, setProducts] = useState([]);

  // Mengambil data dari Backend saat website pertama kali dibuka
  useEffect(() => {
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Toko Online Ku 🛒</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid black', padding: '10px' }}>
            <h3>{product.name}</h3>
            <p>Harga: Rp {product.price}</p>
            <button>Beli</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
