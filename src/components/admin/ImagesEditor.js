import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../util/server";
import FormData from "form-data";
import "./ImagesEditor.scss";

function ImagesEditor() {
  const [images, setImages] = useState([]);

  // Save new image
  const [image, setImage] = useState({ preview: "", data: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    getImages();
  }, []);

  async function saveImage(e) {
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append("image", image.data);
      const newImage = await axios.post(`${server}/image`, formData, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      });

      if (newImage) setStatus(newImage.statusText);
    } catch (err) {
      console.log(err);
    }

    getImages();
  }

  function handleFileChange(e) {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  }

  async function getImages() {
    setImages([]);
    try {
      const imagesData = await axios.get(`${server}/image`);
      setImages(imagesData.data);
    } catch (err) {
      console.log(err);
    }
  }

  function renderImages() {
    return images.map((image) => {
      return (
        <img
          width="100"
          height="100"
          className="thumbnail"
          key={image._id}
          src={`${server}/media/${image.img}`}
          alt={image.img}
          onClick={() => deleteImage(image._id, image.img)}
        />
      );
    });
  }

  function deleteImage(id, path) {
    if (
      window.confirm(
        "Are you sure you want to delete selected image? This image will be removed from all related categories!"
      )
    ) {
      axios
        .delete(`${server}/image/${id}/${path}`)
        .then(getImages())
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className="image-editor box">
      <h2>Image Editor</h2>
      <h3>Click an image to delete</h3>
      {/* {renderImages()} */}
      {images.map((image) => {
        return (
          <img
            width="100"
            height="100"
            className="thumbnail"
            key={image._id}
            src={`${server}/media/${image.img}`}
            alt={image.img}
            onClick={() => deleteImage(image._id, image.img)}
          />
        );
      })}
      <hr className="separator" />
      <h3>Choose new Image and press Submit</h3>
      {image.preview && (
        <img src={image.preview} alt="myImage" width="100" height="100" />
      )}
      <form onSubmit={saveImage}>
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          required
        ></input>
        <button type="submit">Submit</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default ImagesEditor;
