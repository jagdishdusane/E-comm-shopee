import React from "react";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { addDoc, collection } from "firebase/firestore";
import fireDB from "../fireConfig";
import { toast } from "react-toastify";

const CartPage = () => {
  var regName = /^[a-zA-Z ]+$/;
  var regAddress = /^[a-zA-Z0-9 ]+$/;
  var regPIN = /^\d{6}$/;
  var phoneno = /^\d{10}$/;

  const { cartItems } = useSelector((state) => state.cartReducer);
  const [enterName, setName] = useState("");
  const [enterAddress, setAddress] = useState("");
  const [enterPinCode, setPinCode] = useState("");
  const [enterMobileNo, setMobileNo] = useState("");
  const [totalAmount, settotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorAddress, setErrorAddress] = useState(false);
  const [errorPIN, setErrorPIN] = useState(false);
  const [errorMobile, setErrorMobile] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setName("");
    setAddress("");
    setPinCode("");
    setMobileNo("");
    setError(false);
    setErrorName(false);
    setErrorAddress(false);
    setErrorPIN(false);
    setErrorMobile(false);
  };

  useEffect(() => {
    let temp = 0;
    let discount = 0;
    cartItems.forEach((cartItem) => {
      temp = temp + parseFloat(cartItem.price);
    });
    if (cartItems.length > 4) {
      discount = (temp * 4) / 100;
      temp = temp - discount;
    }
    if (cartItems.length > 6) {
      discount = (temp * 5) / 100;
      temp = temp - discount;
    }
    setDiscountAmount(discount);
    setFinalAmount(temp);
  }, [cartItems]);

  useEffect(() => {
    let temp = 0;

    cartItems.forEach((cartItem) => {
      temp = temp + parseFloat(cartItem.price);
    });

    settotalAmount(temp);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const deleteFromCart = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: "DELETE_FROM_CART", payload: product });
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      }
    });
  };

  async function placeOrder() {
    if (!enterName || !enterAddress || !enterPinCode || !enterMobileNo) {
      setError(true);
      return 0;
    }
    setError(false);

    if (!enterName.match(regName)) {
      setErrorName(true);
      return 0;
    }
    setErrorName(false);

    if (!enterAddress.match(regAddress)) {
      setErrorAddress(true);
      return 0;
    }
    setErrorAddress(false);

    if (!enterPinCode.match(regPIN)) {
      setErrorPIN(true);
      return 0;
    }
    setErrorPIN(false);

    if (!enterMobileNo.match(phoneno)) {
      setErrorMobile(true);
      return 0;
    }
    setErrorMobile(false);

    const addressInfo = {
      enterName,
      enterAddress,
      enterPinCode,
      enterMobileNo,
    };

    const orderInfo = {
      cartItems,
      addressInfo,
      email: JSON.parse(localStorage.getItem("currentUser")).user.email,
      userid: JSON.parse(localStorage.getItem("currentUser")).user.uid,
    };

    try {
      setLoading(true);
      await addDoc(collection(fireDB, "orders"), orderInfo);
      while (cartItems.length) {
        cartItems.pop();
      }
      settotalAmount(0);
      setFinalAmount(0);
      setDiscountAmount(0);
      setLoading(false);
      toast.success("Order placed successfully");
      handleClose();
    } catch (error) {
      setLoading(false);
      toast.error("Order failed");
    }

    setName("");
    setMobileNo("");
    setAddress("");
    setPinCode("");
  }

  return (
    <Layout loading={loading}>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            return (
              <tr>
                <td>
                  <img src={item.imageURL} alt="" height="80" width="80" />
                </td>
                <td>{item.name}</td>
                <td>₹ {item.price}</td>
                <td>
                  <FaTrash onClick={() => deleteFromCart(item)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="inline-flex ">
        <h3 className="total-amount">
          Total Amount = ₹ {totalAmount.toFixed(2)}
        </h3>

        <h3 className="discount-amount">
          Discount Amount = ₹ -{discountAmount.toFixed(2)}
        </h3>
        <h3 className="total-amount">
          Final Amount = ₹ {finalAmount.toFixed(2)}
        </h3>
      </div>
      <div className="d-flex justify-content-end">
        <button className="button-62" onClick={handleShow}>
          PLACE ORDER
        </button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Address</Modal.Title>
        </Modal.Header>

        <div className="signup-form">
          <h2>Register</h2>
          <hr />
          <div className="mb-3">
            <label className="my-0 py-0">Name</label>
            <input
              type="text"
              className="form-control my-0"
              placeholder="Name"
              value={enterName}
              onChange={(e) => setName(e.target.value)}
            />
            {errorName && <div className="form-text">Enter valid name!</div>}
          </div>

          <div className="mb-3">
            <label className="my-0 py-0">Address</label>
            <textarea
              rows="3"
              type="text"
              className="form-control my-0"
              placeholder="Enter Address"
              value={enterAddress}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errorAddress && (
              <div className="form-text">Enter valid Address!</div>
            )}
          </div>

          <div className="mb-3">
            <label className="my-0 py-0">PIN Code</label>
            <input
              type="number"
              className="form-control my-0"
              placeholder="PIN Code"
              value={enterPinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
            {errorPIN && <div className="form-text">Enter valid PIN code!</div>}
          </div>

          <div className="mb-3">
            <label className="my-0 py-0">Mobile Number</label>
            <input
              type="number"
              className="form-control my-0"
              placeholder="Mobile Number"
              value={enterMobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
            {errorMobile && (
              <div className="form-text">Mobile number must be 10 digit!</div>
            )}
          </div>

          <hr />
          {error && <h3 className="error">All fields are required!</h3>}
        </div>
        <Modal.Footer>
          <button className="button-62" onClick={handleClose}>
            Close
          </button>
          <button className="button-62" onClick={placeOrder}>
            ORDER
          </button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default CartPage;
