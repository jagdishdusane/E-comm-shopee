import { React, useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Modal } from "react-bootstrap";
import fireDB from "../fireConfig";
import { async } from "@firebase/util";
import { toast } from "react-toastify";
const AdminPage = () => {
  const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    imageURL: "",
    category: "",
    description: "",
  });

  const [add, setAdd] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      // setLoading(true);

      const users = await getDocs(collection(fireDB, "products"));
      const productsArray = [];
      users.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        productsArray.push(obj);
        // setLoading(false);
      });
      setProducts(productsArray);
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  }

  const editProductHandler = (item) => {
    setProduct(item);
    setShow(true);
  };

  const updateProduct = async () => {
    try {
      await setDoc(doc(fireDB, "products", product.id), product);
      handleClose();
      toast.success("Prodcut updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Product update failed");
    }
  };

  const addProduct = async () => {
    try {
      await addDoc(collection(fireDB, "products"), product);
      handleClose();
      toast.success("Prodcut add successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Product add failed");
    }
  };
  const addHandler = () => {
    setAdd(true);
    handleShow();
  };

  const deleteProdcut = async (item) => {
    try {
      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success("Product delete successfully");
      getData();
    } catch (error) {
      toast.error("Product delete failed");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between py-3 px-3">
        <h1>Product List</h1>
        <button className="button-62" onClick={addHandler}>
          Add Product
        </button>
      </div>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            return (
              <tr key={item.id}>
                <td>
                  <img src={item.imageURL} alt="" height="80" width="80" />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>₹ {item.price}</td>
                <td>
                  <FaTrash
                    color="red"
                    onClick={() => deleteProdcut(item)}
                    size={20}
                  />
                  <FaEdit
                    onClick={() => editProductHandler(item)}
                    color="blue"
                    size={20}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add or Update Prodcut</Modal.Title>
        </Modal.Header>

        <div className="signup-form">
          <hr />
          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Image URL"
            value={product.imageURL}
            onChange={(e) =>
              setProduct({ ...product, imageURL: e.target.value })
            }
          />

          <input
            type="number"
            className="form-control"
            placeholder="productPrice"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Category"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />

          <hr />
        </div>
        <Modal.Footer>
          <button className="button-62" onClick={handleClose}>
            Close
          </button>
          {add ? (
            <button className="button-62" onClick={addProduct}>
              Save
            </button>
          ) : (
            <button className="button-62" onClick={updateProduct}>
              Save
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPage;
