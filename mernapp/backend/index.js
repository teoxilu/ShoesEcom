const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

const bcrypt = require('bcrypt');

//mongodb connection
console.log(process.env.MONGODB_URL);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

//user
//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});
  

//model
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const result = await userModel.findOne({ email: email });
    console.log(result);
    if (result) {
      res.send({ message: "Email has already been registered", alert: false });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu bằng bcryptjs
      const userData = {
        email: email,
        password: hashedPassword, // Sử dụng mật khẩu đã mã hóa
        // Thêm các trường dữ liệu khác tùy theo yêu cầu
      };
      const data = userModel(userData);
      const saveResult = await data.save();
      res.send({ message: "Signed up successfully", alert: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        const dataSend = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        res.send({ message: "Logged in", alert: true, data: dataSend }); // Gửi phản hồi từ tuyến đường
      } else {
        res.send({ message: "Incorrect password", alert: false }); // Gửi phản hồi từ tuyến đường
      }
    } else {
      res.send({ message: "Account doesn't exist", alert: false }); // Gửi phản hồi từ tuyến đường
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" }); // Gửi phản hồi từ tuyến đường
  }
});

//product
//schema
const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product", schemaProduct);

//api
app.post("/uploadProduct", async (req, res) => {
  // console.log(req.body)
  if(req.user.role !== "admin"){
    res.status(403).send({ message: "Unauthorized" });
  }
  else{
    try {
      const data = await productModel(req.body);
      const datasave = await data.save();
      res.send({ message: "Upload successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "An error occurred" });
    }
  }
});

app.get("/product", async (req, res) => {
  try {
    const data = await productModel.find({});
    res.send(JSON.stringify(data));
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "An error occurred" });
  }
});

app.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.remove();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.put("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { name, price, description } = req.body;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name;
    product.price = price;
    product.description = description;

    const updatedProduct = await product.save();

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.listen(PORT, () => console.log("server is running at port: " + PORT));
