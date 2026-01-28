import { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import { FaEdit, FaTrash, FaSearch, FaUserPlus } from "react-icons/fa";

const API = "http://127.0.0.1:5000/customers";

const cardColors = [
  "linear-gradient(135deg, #FFDEE9, #B5FFFC)",
  "linear-gradient(135deg, #FEE140, #FA709A)",
  "linear-gradient(135deg, #C9FFBF, #FFAFBD)",
  "linear-gradient(135deg, #89F7FE, #66A6FF)",
  "linear-gradient(135deg, #FCCF31, #F55555)",
  "linear-gradient(135deg, #D9AFD9, #97D9E1)"
];

function App() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [search, setSearch] = useState("");
  const toastRef = useRef(null);
  const modalRef = useRef(null);

  const fetchCustomers = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => setCustomers(data));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastRef.current) {
      const toast = new bootstrap.Toast(toastRef.current);
      toast.show();
    }
  };

  const addCustomer = () => {
    if (!name || !email || !phone || !address) return alert("All fields are required!");
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Date.now(), name, email, phone, address })
    }).then(() => {
      fetchCustomers();
      showToast("Customer added successfully!");
      setName(""); setEmail(""); setPhone(""); setAddress("");
    });
  };

  const deleteCustomer = (id) => {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => {
        fetchCustomers();
        showToast("Customer deleted successfully!");
      });
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setAddress(customer.address);
    if (modalRef.current) {
      const modal = new bootstrap.Modal(modalRef.current);
      modal.show();
    }
  };

  const updateCustomer = () => {
    if (!name || !email || !phone || !address) return alert("All fields are required!");
    fetch(`${API}/${editingCustomer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, address })
    }).then(() => {
      fetchCustomers();
      showToast("Customer updated successfully!");
      setEditingCustomer(null);
      setName(""); setEmail(""); setPhone(""); setAddress("");
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
    });
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4 mb-5">
      <h2 className="text-center mb-4" style={{ color: "#1E3A8A", fontWeight: "700" }}>
        Customer Management System
      </h2>

      {/* Add Customer Form */}
      <div className="card shadow p-3 mb-4" style={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}>
        <div className="row g-2 align-items-center">
          <div className="col-md-3">
            <input type="text" className="form-control border-primary" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input type="email" className="form-control border-primary" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control border-primary" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control border-primary" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-success" style={{ fontWeight: "600" }} onClick={addCustomer}>
              <FaUserPlus /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6 offset-md-6 d-flex">
          <input
            type="text"
            className="form-control me-2 border-info"
            placeholder="Search by Name or Email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ boxShadow: "0 0 5px rgba(0,123,255,0.5)" }}
          />
          <button className="btn btn-info text-white">
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="row g-3">
        {filteredCustomers.length > 0 ? filteredCustomers.map((c, index) => (
          <div className="col-md-4" key={c.id}>
            <div
              className="card text-dark shadow h-100"
              style={{
                background: cardColors[index % cardColors.length],
                borderRadius: "12px",
                transition: "transform 0.3s, box-shadow 0.3s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"; }}
            >
              <div className="card-body">
                <h5 className="card-title" style={{ fontWeight: "700" }}>{c.name}</h5>
                <p className="card-text mb-1"><strong>Email:</strong> {c.email}</p>
                <p className="card-text mb-1"><strong>Phone:</strong> {c.phone}</p>
                <p className="card-text"><strong>Address:</strong> {c.address}</p>
                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-success btn-sm me-2" onClick={() => openEditModal(c)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteCustomer(c.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-center">
            <h5 style={{ color: "#6c757d" }}>No customers found</h5>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <div className="modal fade" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "12px" }}>
            <div className="modal-header bg-info text-white">
              <h5 className="modal-title">Edit Customer</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-2">
                <div className="col-md-3">
                  <input type="text" className="form-control border-primary" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="col-md-3">
                  <input type="email" className="form-control border-primary" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="col-md-3">
                  <input type="text" className="form-control border-primary" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="col-md-3">
                  <input type="text" className="form-control border-primary" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-warning" onClick={updateCustomer}>Update</button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div ref={toastRef} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header bg-primary text-white">
            <strong className="me-auto">Notification</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
          </div>
          <div className="toast-body">{toastMsg}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
