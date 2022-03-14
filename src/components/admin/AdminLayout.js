import React from "react";
import Loader from "../Loader";
import AdminHeader from "./AdminHeader";

const AdminLayout = (props) => {
  return (
    <div>
      {props.loading && <Loader />}
      <AdminHeader />
      <div className="content">{props.children}</div>
    </div>
  );
};

export default AdminLayout;
