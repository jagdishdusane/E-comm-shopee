import { React, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../fireConfig";
import { FaTrash, FaEdit } from "react-icons/fa";
import ImageUpload from "./ImageUpload";
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Modal } from "react-bootstrap";
import fireDB from "../fireConfig";
import { toast } from "react-toastify";

import AdminLayout from "../components/admin/AdminLayout";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: null,
    imageURL: "",
    category: "",
    description: "",
  });

  const [addProductDetails, setAddProductDetails] = useState({
    name: "",
    price: null,
    imageURL: "",
    category: "",
    description: "",
  });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [forAdd, setForAdd] = useState(false);
  const closeHandle = () => setForAdd(false);
  const showHandle = () => setForAdd(true);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);

      const users = await getDocs(collection(fireDB, "products"));
      const productsArray = [];
      users.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        productsArray.push(obj);
        setLoading(false);
      });
      setProducts(productsArray);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
      console.log();
      toast.error("Product update failed");
    }
  };

  const [data, setData] = useState({
    image: null,
  });

  async function imageAdd() {
    try {
      setLoading(true);
      const storageRef = ref(storage, `/files/${data.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, data.image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress;
          progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
            console.log(imageUrl);

            setAddProductDetails({ imageURL: imageUrl });
            setLoading(false);
          });
        }
      );
    } catch (error) {
      toast.error("Please Upload Image");
      setLoading(false);
    }
  }

  async function addProducData() {
    try {
      setLoading(true);
      await addDoc(collection(fireDB, "products"), addProductDetails);
      closeHandle();
      toast.success("Prodcut add successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Product add failed");
      setLoading(false);
    }
  }

  var regName = /^[a-zA-Z0-9 ]+$/;
  var regCategory = /^[a-zA-Z ]+$/;
  var regDescription = /^\w+(?:\s+\w+){0,4}$/;

  const [error, setError] = useState(false);

  const [errorName, setErrorName] = useState(false);

  const [errorDescription, setErrorDescription] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);

  const addProduct = async (e) => {
    if (
      !addProductDetails.name ||
      !addProductDetails.imageURL ||
      !addProductDetails.price ||
      !addProductDetails.category ||
      !addProductDetails.price ||
      !addProductDetails.description
    ) {
      // toast.error("Enter Valid Data");
      setError(true);
      return 0;
    }
    setError(false);

    if (!addProductDetails.name.match(regName)) {
      setErrorName(true);
      return 0;
    }
    setErrorName(false);

    if (!addProductDetails.category.match(regCategory)) {
      setErrorCategory(true);
      return 0;
    }
    setErrorCategory(false);
    if (!addProductDetails.description.match(regDescription)) {
      setErrorDescription(true);
      return 0;
    }
    setErrorDescription(false);

    addProducData();
  };

  const addHandler = () => {
    showHandle();
    setAddProductDetails("");
    setError(false);
    setErrorName(false);
    setErrorCategory(false);
    setErrorDescription(false);
  };

  const deleteProdcut = async (item) => {
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
        try {
          deleteDoc(doc(fireDB, "products", item.id));
          toast.success("Product delete successfully");
          getData();
        } catch (error) {
          toast.error("Product delete failed");
        }
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      }
    });
  };

  return (
    <AdminLayout loading={loading}>
      <div className="d-flex justify-content-between py-1 px-3 ">
        <h1 className=" mt-1">Product List</h1>
        <button className="button-62 mt-1" onClick={addHandler}>
          Add Product
        </button>
      </div>
      <div className="mx-5 ">
        <table className="table mt-2  px-3 adminPanel">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="adminPanel">
            {products.map((item) => {
              return (
                <tr key={item.id} className="adminPanel">
                  <td>
                    <img src={item.imageURL} alt="" height="80" width="80" />
                  </td>
                  <td>{item.name}</td>
                  <td>
                    {item.category.charAt(0).toUpperCase() +
                      item.category.slice(1)}
                  </td>
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
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{"Edit Product"}</Modal.Title>
        </Modal.Header>

        <div className="signup-form">
          <hr />

          <div className="mb-3">
            <label className="my-0 py-0">Product Name</label>
            <input
              type="text"
              className="form-control my-0"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="my-0 py-0">Image URL</label>
            <input
              type="text"
              className="form-control my-0"
              placeholder="Image URL"
              value={product.imageURL}
              onChange={(e) =>
                setProduct({ ...product, imageURL: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="my-0 py-0">Product Price</label>
            <input
              type="number"
              className="form-control my-0"
              placeholder="product Price"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="my-0 py-0">Category</label>
            <input
              type="text"
              className="form-control my-0"
              placeholder="Category"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="my-0 py-0">Description</label>
            <input
              type="text"
              className="form-control my-0"
              placeholder="Description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          <hr />
        </div>
        <Modal.Footer>
          <button className="button-62" onClick={handleClose}>
            Close
          </button>
          <button className="button-62" onClick={updateProduct}>
            Save
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={forAdd} onHide={closeHandle}>
        <Modal.Header closeButton>
          <Modal.Title>{"Add a Product"}</Modal.Title>
        </Modal.Header>

        <div className="signup-form">
          <hr />
          <div className="mb-3">
            <p>
              Upload Product Image
              <span style={{ color: "red", fontSize: "1.3rem" }}>*</span>
            </p>

            <ImageUpload setData={setData} />
            <Button className="btn btn-success btn-img " onClick={imageAdd}>
              Image Upload
            </Button>
          </div>
          <div className="mb-3">
            <label className="my-0 py-0">Product Name</label>
            <span style={{ color: "red" }}> *</span>
            <input
              type="text"
              className="form-control my-0"
              placeholder="Product Name"
              value={addProductDetails.name}
              onChange={(e) =>
                setAddProductDetails({
                  ...addProductDetails,
                  name: e.target.value,
                })
              }
            />
            {errorName && <div className="form-text">Enter valid name</div>}
          </div>

          <div className="mb-3">
            <label className="my-0 py-0">Image URL</label>
            <span style={{ color: "red" }}> *</span>
            <input
              type="text"
              className="form-control my-0"
              placeholder="Image URL"
              value={addProductDetails.imageURL}
            />
          </div>

          <div className="mb-3">
            <label className="my-0 py-0">Product Price</label>
            <span style={{ color: "red" }}> *</span>
            <input
              type="number"
              className="form-control my-0"
              placeholder="product Price"
              value={addProductDetails.price}
              onChange={(e) =>
                setAddProductDetails({
                  ...addProductDetails,
                  price: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="my-0 py-0">Category</label>
            <span style={{ color: "red" }}> *</span>
            <input
              type="text"
              className="form-control my-0"
              placeholder="Category"
              value={addProductDetails.category}
              onChange={(e) =>
                setAddProductDetails({
                  ...addProductDetails,
                  category: e.target.value,
                })
              }
            />
            {errorCategory && (
              <div className="form-text">Enter valid category</div>
            )}
          </div>
          <div className="mb-3">
            <label className="my-0 py-0">Description</label>
            <span style={{ color: "red" }}> *</span>
            <input
              type="text"
              className="form-control my-0"
              placeholder="Description"
              value={addProductDetails.description}
              onChange={(e) =>
                setAddProductDetails({
                  ...addProductDetails,
                  description: e.target.value,
                })
              }
            />
            {errorDescription && (
              <div className="form-text">Enter only maximum 5 words!</div>
            )}
          </div>

          <hr />
          {error && <h3 className="error">All fields are required!</h3>}
        </div>

        <Modal.Footer>
          <button className="button-62" onClick={closeHandle}>
            Close
          </button>

          <button className="button-62" onClick={addProduct}>
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default AdminPage;
