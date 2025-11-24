import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const products = [
    { id: 1, name: "HP Probook", price: 40000, sold: 5, image: "https://pngfile.net/files/preview/1280x1231/21567004030eqj7zvpsguhtydm3naitz1ekhehaevhqrcehqkd8eil1fj5heplp74zldgirwlzfb7e82hfzycu6zu6rycgheonzxfedi0thd1sa.png" },
    { id: 2, name: "Vivo Y200 5G", price: 20000, sold: 10, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ18sNAdfw-ONZCw5x0sLDwZGj5p2xjzPqHJw&s" },
    { id: 3, name: "Rockerz 260", price: 800, sold: 30, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZeVk6gC57Ne4GCfbkM-OmuLxv8Rp6t1Z4aA&s" },
    { id: 1, name: "Apple Tab", price: 40000, sold: 2, image: "https://pngfile.net/files/preview/1280x1231/21567004030eqj7zvpsguhtydm3naitz1ekhehaevhqrcehqkd8eil1fj5heplp74zldgirwlzfb7e82hfzycu6zu6rycgheonzxfedi0thd1sa.png" },
    { id: 2, name: " I Phone", price: 600000, sold: 6, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSvgCPBUySTN1TjyFl-Lu-XqGoZlDnLDpnbQ&s" },
    { id: 3, name: "Headphones", price: 2000, sold: 100, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfY9y_HaPXn5z-oAUhLbdyaHDGNRti64H2tA&s" },
  ];

  const [cart, setCart] = useState([]);
  const [chartData, setChartData] = useState({
    labels: products.map(p => p.name),
    datasets: [{ label: "Units Sold", data: products.map(p => p.sold), backgroundColor: "hsla(147, 100%, 50%, 0.70)" }],
  });
  const [showModal, setShowModal] = useState(false);
  const [bill, setBill] = useState({ total: 0, items: [] });
  const [animatedCounters, setAnimatedCounters] = useState({ totalProducts: 0, cartItems: 0, revenue: 0 });

  // Animate summary counters
  useEffect(() => {
    const target = { totalProducts: products.length, cartItems: cart.length, revenue: cart.reduce((sum, i) => sum + i.price, 0) };
    const interval = setInterval(() => {
      setAnimatedCounters(prev => {
        const next = { ...prev };
        Object.keys(target).forEach(key => {
          if (prev[key] < target[key]) next[key] = prev[key] + Math.ceil((target[key] - prev[key]) / 5);
        });
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [cart, products.length]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    const updatedData = { ...chartData };
    const index = updatedData.labels.indexOf(product.name);
    updatedData.datasets[0].data[index] += 1;
    setChartData(updatedData);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const buyNow = () => {
    if (!cart.length) return;
    setBill({ total: cart.reduce((sum, i) => sum + i.price, 0), items: cart });
    setShowModal(true);
    setCart([]);
  };

  const onDragStart = (e, product) => {
    e.dataTransfer.setData("product", JSON.stringify(product));
  };

  const onDrop = (e) => {
    e.preventDefault();
    const product = JSON.parse(e.dataTransfer.getData("product"));
    addToCart(product);
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Product Sales" } },
    animation: { duration: 800 },
  };

  return (
    <div style={dashboardStyle}>
      <h1 style={{ textAlign: "center", color: "#000000ff"}}>Code Hunter Shopping</h1>

      {/* Summary Cards */}
      <div style={summaryCardContainer}>
        <Card title="Total Products" value={animatedCounters.totalProducts} />
        <Card title="Items in Cart" value={animatedCounters.cartItems} />
        <Card title="Total Revenue" value={` RS : ${animatedCounters.revenue}`} />
      </div>

      {/* Products & Cart */}
      <div style={productsCartContainer}>
        {/* Products */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#000000ff" }}>Products</h2>
          {products.map(product => (
            <div
              key={product.id}
              draggable
              onDragStart={e => onDragStart(e, product)}
              style={productCardStyle}
            >
              <img src={product.image} alt={product.name} style={productImageStyle} />
              <div style={{ flex: 1, marginLeft: "15px" }}>
                <h4>{product.name}</h4>
                <p>RS : {product.price}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <button style={buttonStyle} onClick={() => addToCart(product)}>Add to Cart</button>
                <button style={{ ...buttonStyle, backgroundColor: "#198754" }} onClick={() => { addToCart(product); buyNow(); }}>Buy Now</button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Drop Area */}
        <div style={cartDropAreaStyle} onDrop={onDrop} onDragOver={e => e.preventDefault()}>
          <h2 style={{ color: "#000000ff" }}>Cart (Drag products here)</h2><br />
          {cart.length === 0 ? <p>Cart is empty</p> : (
            <ul style={{ padding: 0, listStyle: "none" }}>
              {cart.map((item, index) => (
                <li key={index} style={cartItemStyle}>
                  <span>{item.name} - ${item.price}</span>
                  <button style={removeBtnStyle} onClick={() => removeFromCart(index)}>X</button>
                </li>
              ))}
            </ul>
          )}
          <br />
          <h3>Total: RS :{cart.reduce((sum, i) => sum + i.price, 0)}</h3><br />
          <button style={{ ...buttonStyle, width: "100%" }} onClick={buyNow}>Checkout</button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ marginTop: "50px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ color: "#198754" }}>Purchase Successful!</h2>
            <p>You bought: {bill.items.map(i => i.name).join(", ")}</p>
            <h3>Total Bill: RS :{bill.total}</h3>
            <button style={buttonStyle} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Components & Styles
const Card = ({ title, value }) => (
  <div style={cardStyle}>
    <h3>{title}</h3>
    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</p>
  </div>
);

const dashboardStyle = { fontFamily: "Arial, sans-serif", padding: "20px", background: "#898e94ff", minHeight: "100vh" };
const summaryCardContainer = { display: "flex", justifyContent: "space-around", margin: "30px 0", gap: "20px", flexWrap: "wrap" };
const productsCartContainer = { display: "flex", gap: "50px", flexWrap: "wrap" };
const cardStyle = { flex: 1, padding: "20px", borderRadius: "12px", background: "linear-gradient(145deg, #d4d4d4ff, #65696fff)", textAlign: "center", boxShadow: "0 6px 12px rgba(255, 255, 255, 0.46)", transition: "transform 0.3s" };
const productCardStyle = { display: "flex", alignItems: "center", padding: "15px", marginBottom: "15px", borderRadius: "12px", background: "linear-gradient(145deg, #d4d4d4ff, #3c5c8bff)", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", transition: "transform 0.3s", cursor: "grab" };
const productImageStyle = { width: "80px", height: "80px", borderRadius: "10px", transition: "transform 0.3s", ":hover": { transform: "scale(1.1)" } };
const buttonStyle = { padding: "8px 12px", border: "none", borderRadius: "6px", backgroundColor: "#2f1776ff", color: "#fff", cursor: "pointer", transition: "all 0.3s" };
const cartDropAreaStyle = { flex: 1, minHeight: "300px", padding: "20px", borderRadius: "12px", background: "linear-gradient(145deg, #f3f8fcff, #7f8184ff)", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", transition: "background 0.3s" };
const cartItemStyle = { display: "flex", justifyContent: "space-between", padding: "10px", marginBottom: "5px", borderRadius: "8px", border: "1px solid #eee" };
const removeBtnStyle = { backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", padding: "2px 6px" };
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalStyle = { backgroundColor: "#fff", padding: "30px", borderRadius: "12px", textAlign: "center", minWidth: "300px", transform: "translateY(-50px)", animation: "slideIn 0.3s forwards" };

export default Dashboard;
