const Post = require("../models/Post");

exports.getAllPosts = async (req, res) => {
  try {
    //No coloco await porque no quiero ejecutarlo, solo quiero que la promesa se almacene en la variable query
    let query = Post.find();

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    //Determina después de que estoy en una determinada página, solo quiero los siguientes datos EX: si estoy en la pagina uno debe saltarse los primeros 50 datos y darme los siguientes 10 a ellos
    const skip = (page - 1) * pageSize;
    const total = await Post.countDocuments();

    const pages = Math.ceil(total / pageSize);

    query = query.skip(skip).limit(pageSize);

    if (page > pages) {
      return res.status(404).json({
        status: "fail",
        message: "No page found",
      });
    }

    const result = await query;

    res.status(200).json({
      status: "success",
      //Cantidad de posts por pagina
      count: result.length,
      //numero de la pagina
      page,
      //cantidad de paginas que hay
      pages,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
};