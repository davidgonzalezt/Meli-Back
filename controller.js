const axios = require("axios");

const autor = {
  name: "David",
  lastname: "Gonzalez",
};

const categories = ["tecnologia", "deporte"];

exports.getProductsByQuery = async (req, res) => {
  try {
    const { query } = req.query;
    const formatQuery =query.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const { data } = await axios.get(
      `https://api.mercadolibre.com/sites/MLA/search?q=${formatQuery}`
    );

    const datos = {
      autor,
      categories,
      items: [],
      breadcrumb: data.filters.length > 0 ? data.filters[0].values[0].path_from_root : []
    };

    datos.items = data.results.map((p) => {
      return {
        id: p.id,
        title: p.title,
        price: {
          currency: p.currency_id,
          amount: p.prices.prices ? p.prices.prices[0].amount : p.price,
          decimals: null,
        },
        picture: p.thumbnail,
        condition: p.condition,
        free_shipping: p.shipping.free_shipping,
        location: p.address.state_name,
      };
    });
    res.send(datos);
  } catch (error) {
    console.log(error);
    res.status(400).send("There was a mistake");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const getItem = axios.get(`https://api.mercadolibre.com/items/${id}`);
    const getDescription = axios.get(`https://api.mercadolibre.com/items/${id}/description`);

    const [dataGeneral, descripcion] = await Promise.all([
      getItem,
      getDescription,
    ]);

    const {data: catagory} = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?category=${dataGeneral.data.category_id}`);

    const datos = {
      autor,
      item: {
        id: id,
        title: dataGeneral.data.title,
        price: {
          currency: dataGeneral.data.currency_id,
          amount: dataGeneral.data.price,
          decimals: null,
        },
        picture: dataGeneral.data.thumbnail,
        condition: dataGeneral.data.condition,
        free_shipping: dataGeneral.data.shipping.free_shipping,
        sold_quantity: dataGeneral.data.sold_quantity,
        description: descripcion.data.plain_text,
      },
      breadcrumb: catagory.filters.length > 0 ? catagory.filters[0].values[0].path_from_root : []
    };

    res.send(datos);
  } catch (error) {
    console.log(error);
    res.status(400).send("There was a mistake");
  }
};
