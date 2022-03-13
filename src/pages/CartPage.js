import React from "react";
import { FaTrash } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { addDoc, collection } from "firebase/firestore";
import fireDB from "../fireConfig";
import { toast } from "react-toastify";
import { async } from "@firebase/util";

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cartReducer);
  const [totalAmount, settotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [enterName, setName] = useState("");
  const [enterAddress, setAddress] = useState("");
  const [enterPinCode, setPinCode] = useState("");
  const [enterMobileNo, setMobileNo] = useState("");

  useEffect(() => {
    let temp = 0;
    let discount;
    cartItems.forEach((cartItem) => {
      temp = temp + parseFloat(cartItem.price);
    });
    if (cartItems.length > 4 && cartItems.length <= 6) {
      discount = (temp * 4) / 100;
      temp = temp - discount;
      toast("Congratulations! You have got 4% discount ", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (cartItems.length > 6) {
      discount = (temp * 5) / 100;
      temp = temp - discount;
      toast("Congratulations! You have got 5% discount ", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    settotalAmount(temp);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const deleteFromCart = (product) => {
    dispatch({ type: "DELETE_FROM_CART", payload: product });
  };

  async function placeOrder() {
    if (!enterName && !enterAddress && !enterPinCode && !enterMobileNo) {
      toast.error("Please enter valid data");
      return 0;
    }

    const addressInfo = {
      enterName,
      enterAddress,
      enterPinCode,
      enterMobileNo,
    };
    console.log(addressInfo);

    const orderInfo = {
      cartItems,
      addressInfo,
      email: JSON.parse(localStorage.getItem("currentUser")).user.email,
      userid: JSON.parse(localStorage.getItem("currentUser")).user.uid,
    };

    try {
      setLoading(true);
      const result = await addDoc(collection(fireDB, "orders"), orderInfo);
      toast.success("Order placed successfully");
      setLoading(false);
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

      <div className="d-flex justify-content-end">
        <h3 className="total-amount">
          Total Amount = ₹ {totalAmount.toFixed(2)}
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
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={enterName}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            rows="3"
            type="text"
            className="form-control"
            placeholder="Enter Address"
            value={enterAddress}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            type="number"
            className="form-control"
            placeholder="PIN Code"
            value={enterPinCode}
            onChange={(e) => setPinCode(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Mobile Number"
            value={enterMobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
          />

          <hr />
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
