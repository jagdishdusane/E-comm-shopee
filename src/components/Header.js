import { React, useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import fireDB from "../fireConfig";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { async } from "@firebase/util";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cartReducer);
  // const [currentUser, setcurrentUser] = useState({});
  const { user } = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  // useEffect(() => {
  //   getData();
  // }, []);

  /*   async function getData() {
    try {
      const currUser = await getDocs(collection(fireDB, "currentUser"));

      currUser.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        setcurrentUser(obj);
        console.log(currentUser);
      });
    } catch (error) {
      console.log(error);
    }
  } */
  /*   async function logout(currdata) {
    try {
      await deleteDoc(doc(fireDB, currdata.email));
    } catch (error) {
      console.log(error);
    }
  }
 */

  function logout(e) {
    localStorage.removeItem("currentUser");
    window.location.reload("");
    navigate(window.location.reload(""));
  }

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            E-Comm Shopee
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <FaBars size={25} color="white" />
            </span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  <FaUser size={20} color="white" className="mx-2" />
                  {user.email.substring(0, user.email.length - 10)}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  Order
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={logout}>
                  Logout
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  <FaCartPlus size={25} className="mx-2" />
                  {cartItems.length}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
