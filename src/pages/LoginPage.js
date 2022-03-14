import { React, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const [enterEmailId, setEnterEmailId] = useState("");
  const [enterPassword, setEnterPassword] = useState("");
  const [adminEmailId, setAdminEmailId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const adminId = "admin@gmail.com";
  const password = "admin@123";

  const adminLogin = () => {
    setIsAdmin(true);
    setIsUser(false);
  };

  const userLogin = () => {
    setIsUser(true);
    setIsAdmin(false);
  };

  let formIsValid = false;

  if (enterEmailId && enterPassword) {
    formIsValid = true;
  }
  if (adminEmailId && adminPassword) {
    formIsValid = true;
  }

  //User Auth
  async function login() {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(
        auth,
        enterEmailId,
        enterPassword
      );
      localStorage.setItem("currentUser", JSON.stringify(result));

      setLoading(false);
      toast.success("Login sccessful");
      navigate(`/`);
    } catch (error) {
      toast.error("Login failed ");
      setLoading(false);
    }

    setEnterEmailId("");
    setEnterPassword("");
  }

  //admin Auth
  function admin() {
    setLoading(true);

    if (adminId !== adminEmailId || password !== adminPassword) {
      toast.error("Login failed");
      return 0;
    }
    navigate(`/admin`);
    setAdminEmailId("");
    setAdminPassword("");
  }

  return (
    <div className="login-parent">
      {loading && <Loader />}
      <div className="row justify-content-center ">
        <div className="col-md-4 z1">
          <button onClick={userLogin} className="my-3 button-62">
            User Login
          </button>
          <button onClick={adminLogin} className="my-3 mx-3 button-62">
            Admin Login
          </button>

          {isAdmin && (
            <div className="login-form">
              <h2>Admin Login</h2>
              <hr />

              <input
                type="email"
                className="form-control"
                placeholder="Admin Email Id"
                value={adminEmailId}
                onChange={(e) => setAdminEmailId(e.target.value)}
              />
              <input
                type="password"
                className="form-control"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />

              <button
                className={`button-62 mt-3 ${!formIsValid ? "disabled" : ""}`}
                disabled={!formIsValid}
                onClick={admin}
                style={{
                  pointerEvents: !formIsValid ? "none" : "",
                }}
              >
                Login
              </button>
            </div>
          )}
          {isUser && (
            <div className="login-form">
              <h2>Login</h2>
              <hr />

              <input
                type="email"
                className="form-control"
                placeholder="Email Id"
                value={enterEmailId}
                onChange={(e) => setEnterEmailId(e.target.value)}
              />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={enterPassword}
                onChange={(e) => setEnterPassword(e.target.value)}
              />

              <button
                className={`button-62 mt-3 ${!formIsValid ? "disabled" : ""}`}
                disabled={!formIsValid}
                onClick={login}
                style={{
                  pointerEvents: !formIsValid ? "none" : "",
                }}
              >
                Login
              </button>
              <hr />
              <Link to="/signup">Click Here To Sign Up</Link>
            </div>
          )}
        </div>
        <div className="col-md-5 z1">
          <lottie-player
            src="https://assets10.lottiefiles.com/packages/lf20_hu9cd9.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>
      <div className="login-bottom"></div>
    </div>
  );
};

export default LoginPage;
