import { React, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import fireDB from "../fireConfig";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProductInfo = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cartReducer);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      const productTemp = await getDoc(
        doc(fireDB, "products", params.productid)
      );
      setProduct(productTemp.data());
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success("Product Add to Cart Successful", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {product && (
              <div>
                <p>
                  <b>{product.name}</b>
                </p>
                <img
                  src={product.imageURL}
                  alt=""
                  className="product-info-img"
                />
                <hr />
                <p>{product.description}</p>
                <h3>
                  <b>₹ {product.price}</b>
                </h3>
                <hr />
                <div className="d-flex justify-content-end my-3">
                  <button
                    className="button-62"
                    onClick={() => addToCart(product)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductInfo;
