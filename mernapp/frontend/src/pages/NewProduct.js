import React, { useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { ImageToBase64 } from "../utility/ImageToBase64";
import Compressor from 'compressorjs';

const NewProduct = () => {
  const [data, setData] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    description: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
  
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      async success(result) {
        const compressedFile = await ImageToBase64(result);
        setData((prev) => ({
          ...prev,
          image: compressedFile,
        }));
      },
      error(err) {
        console.error('Error during image compression: ', err.message);
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    const { name, image, category, price } = data;

    if (name && image && category && price) {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/uploadProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const fetchRes = await fetchData.json();

      console.log(fetchRes);
      toast(fetchRes.message);

      setData(() => {
        return {
          name: "",
          category: "",
          image: "",
          price: "",
          description: "",
        };
      });
    } else {
      toast("Enter required Fields");
    }
  };

  return (
    <div className="p-4">
      <form
        className="m-auto w-full max-w-md shadow flex flex-col p-3 bg-white"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Name</label>
        <input
          type={"text"}
          name="name"
          className="bg-slate-200 p-1 my-1"
          onChange={handleOnChange}
          value={data.name}
        />

        <label htmlFor="category">Category</label>
        <select
          className="bg-slate-200 p-1 my-1"
          id="category"
          name="category"
          onChange={handleOnChange}
          value={data.category}
        >
          <option value={"other"}>select category</option>
          <option value={"running"}>Running</option>
          <option value={"lifestyle"}>Lifestyle</option>
          <option value={"tennis"}>Tennis</option>
          <option value={"football"}>Football</option>
          <option value={"skateboarding"}>Skateboarding</option>
        </select>

        <label htmlFor='image'>Image
        <div  className='h-40 w-full bg-slate-200  rounded flex items-center justify-center cursor-pointer'>
            {
              data.image ? <img src={data.image} className="h-full" /> :<span className='text-5xl'><BsCloudUpload/></span> 
            }
            
            
           <input type={"file"} accept="image/*" id="image" onChange={uploadImage} className="hidden"/>
        </div>
        </label>

        <label htmlFor="price" className="my-1">Price</label>
        <input
          type={"text"}
          className="bg-slate-200 p-1 my-1"
          name="price"
          onChange={handleOnChange}
          value={data.price}
        ></input>

        <label htmlFor="description">Description</label>
        <textarea
          rows={3}
          className="bg-slate-200 p-1 my-1 resize-none"
          onChange={handleOnChange}
          name="description"
          value={data.description}
        ></textarea>

        <button className="bg-blue-900 text-white hover:bg-orange-800 text-lime-400 text-lg font-semibold my-2 drop-shadow-md">
          Save
        </button>
      </form>
    </div>
  );
};

export default NewProduct;
