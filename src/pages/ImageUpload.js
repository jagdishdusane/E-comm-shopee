import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

// import "../stylesheets/imageUpload.css";
const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  function pickedHandler(event) {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      props.setData((perv) => {
        return { ...perv, image: pickedFile };
      });
    }
  }

  function pickedImageHandler() {
    filePickerRef.current.click();
  }

  return (
    <div className="form-controll center">
      <input
        type="file"
        ref={filePickerRef}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className="image-upload">
        <div
          className="image-upload__perview"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {previewUrl && (
            <img
              src={previewUrl}
              alt="perview"
              style={{
                width: "301px",
                height: "268px",
                border: "3 px solid #ccc",
              }}
            />
          )}
          {!previewUrl && (
            <div>
              <Button
                className="image-upload-button"
                onClick={pickedImageHandler}
              >
                +
              </Button>
            </div>
          )}
        </div>
        {previewUrl && (
          <div className="center">
            <Button
              style={{ margin: "0.5rem 13rem" }}
              className="image-upload-button"
              onClick={pickedImageHandler}
            >
              <FaEdit />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
