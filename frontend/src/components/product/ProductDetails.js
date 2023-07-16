import React, { useEffect, useState, Fragment } from "react";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import ListReviews from "./ListReviews";
import Product from "./Product";
import { getProducts } from "../../actions/productsAction";
import {
  getProductDetails,
  clearErrors,
  newReview,
} from "../../actions/productsAction";
import { addItemToCart } from "../../actions/cartActions";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

import { Carousel } from "react-bootstrap";

const ProductDetails = ({ match }) => {
  const { products } = useSelector((state) => state.products);

  const [quantity, setQuantity] = useState(1);
  const [ratings, setRatings] = useState(0);
  const [review, setReview] = useState("");

  let paramsId = useParams().id;

  const dispatch = useDispatch();
  const alert = useAlert();

  const { loding, error, product } = useSelector(
    (state) => state.productDetails
  );
  const category = product.category;
  const { user } = useSelector((state) => state.auth);
  const { error: reviewError, success } = useSelector(
    (state) => state.newReview
  );

  console.log();
  useEffect(() => {
    dispatch(getProductDetails(paramsId));
    dispatch(getProducts("", 1, [1, 4000], category, 0));
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review Posted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, error, alert, success, category, reviewError, paramsId]);

  const addToCart = () => {
    dispatch(addItemToCart(paramsId, quantity));
    alert.success("Item is Added to Cart");
  };
  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= product.stock) return;

    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) return;

    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };
  function setUserRatings() {
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, index) => {
      star.starValue = index + 1;
      ["click", "mouseover", "mouseout"].forEach(function (e) {
        star.addEventListener(e, showRatings);
      });
    });
    function showRatings(e) {
      stars.forEach((star, index) => {
        if (e.type === "click") {
          if (index < this.starValue) {
            star.classList.add("orange");
            setRatings(this.starValue);
          } else {
            star.classList.remove("orange");
          }
        }
        if (e.type === "mouseover") {
          if (index < this.starValue) {
            star.classList.add("yellow");
          } else {
            star.classList.remove("yellow");
          }
        }
        if (e.type === "mouseout") {
          star.classList.remove("yellow");
        }
      });
    }
  }
  let similar_products;
  if(products.length>4){
    similar_products = products.slice(0,4);
  }else{
    similar_products = products;
  }
  const reviewHandler = () => {
    const formData = new FormData();
    formData.set("ratting", ratings);
    formData.set("comment", review);
    formData.set("productId", match.params.id);
    dispatch(newReview(formData));
  };
  return (
    <Fragment>
      {loding ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name} />
          <section className="prod_desc_section">
            <div className="prod_card">
              <div className="image_container">
                <Carousel pause="hover">
                  {product.images &&
                    product.images.map((image) => (
                      <Carousel.Item key={image.public_id}>
                        <img
                          className="d-block w-100"
                          src={image.url}
                          alt={product.title}
                        />
                      </Carousel.Item>
                    ))}
                </Carousel>
              </div>
              <div className="prode_desc_detail">
                <svg
                  version="1.1"
                  className="sale_svg"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  enable-background="new 0 0 512 512"
                >
                  <g>
                    <path
                      d="M505.6746,253.5676c0,10.8124-12.7002,20.6711-14.0782,31.1094c-1.378,10.6807,8.3472,23.4857,5.6087,33.688
		c-2.7739,10.3703-17.5957,16.6155-21.6553,26.3909c-4.1035,9.8981,1.9509,24.7943-3.3643,33.9832
		c-5.3547,9.253-21.3009,11.4185-27.7885,19.8553c-6.5056,8.465-4.4973,24.4242-12.0175,31.9556
		c-7.5421,7.5354-23.5144,5.5361-31.9709,12.0372c-8.426,6.4724-10.5916,22.4186-19.8441,27.7841
		c-9.1962,5.3045-24.0964-0.7481-34.0012,3.3553c-9.7646,4.0555-16.0027,18.8904-26.3797,21.6598
		c-10.1933,2.7322-22.9943-6.993-33.6817-5.5952c-10.4428,1.3538-20.3167,14.0714-31.1049,14.0714
		c-10.8187,0-20.6796-12.7177-31.1264-14.0714c-10.6659-1.3977-23.4839,8.3275-33.6817,5.5952
		c-10.3725-2.7694-16.6151-17.6042-26.3886-21.6598c-9.8914-4.1142-24.7875,1.9492-33.9787-3.3661
		c-9.266-5.3547-11.427-21.3009-19.8531-27.7778c-8.4695-6.5056-24.4332-4.4973-31.9534-12.0327
		c-7.5422-7.5314-5.5298-23.5014-12.0479-31.9556c-6.4751-8.4368-22.4254-10.6068-27.78-19.8593
		c-5.3112-9.1849,0.7522-24.0811-3.3643-33.9792c-4.0381-9.7798-18.8774-16.0206-21.6553-26.3909
		c-2.734-10.2022,7.0086-23.0073,5.5997-33.688c-1.3475-10.4384-14.0737-20.297-14.0737-31.1094
		c0-10.8034,12.7262-20.6706,14.0737-31.1045c1.4089-10.6812-8.3337-23.4906-5.5997-33.6992
		c2.7779-10.3703,17.6172-16.6043,21.6773-26.3841c4.0945-9.8936-1.9689-24.801,3.3554-33.9792
		c5.3416-9.2525,21.2919-11.4293,27.767-19.8593c6.5181-8.461,4.5058-24.4202,12.0479-31.9556
		c7.5422-7.5314,23.4839-5.5276,31.9534-12.0242c8.4345-6.4813,10.609-22.4383,19.8531-27.793
		c9.1912-5.3045,24.0874,0.7481,33.9877-3.3598c9.7861-4.0555,16.0072-18.8904,26.3797-21.666
		c10.1978-2.721,23.0158,6.9929,33.6817,5.6105c10.4469-1.3628,20.3078-14.0759,31.1264-14.0759
		c10.7882,0,20.6621,12.7132,31.1049,14.0759c10.6874,1.3937,23.4884-8.3315,33.6817-5.6105
		c10.377,2.7757,16.6151,17.6105,26.4017,21.675c9.9003,4.099,24.783-1.9536,33.9792,3.3616
		c9.2525,5.3439,11.418,21.3009,19.8615,27.7823c8.4475,6.4966,24.4113,4.4928,31.9534,12.0287
		c7.5422,7.531,5.5298,23.4902,12.0175,31.9512c6.4876,8.4301,22.4338,10.6068,27.7885,19.8638
		c5.3152,9.1737-0.7392,24.0811,3.3643,33.9787c4.0596,9.7843,18.8814,16.0098,21.6553,26.3801
		c2.7385,10.2085-7.0086,23.018-5.6087,33.6992C492.9744,232.8969,505.6746,242.7641,505.6746,253.5676z"
                    />
                  </g>
                  <g>
                    <path
                      fill="#C9C9C9"
                      d="M505.6746,253.5676c0,10.8124-12.7002,20.6711-14.0782,31.1094
		c-1.378,10.6807,8.3472,23.4857,5.6087,33.688c-2.7739,10.3703-17.5957,16.6155-21.6553,26.3909
		c-4.1035,9.8981,1.9509,24.7943-3.3643,33.9832c-5.3547,9.253-21.3009,11.4185-27.7885,19.8553
		c-6.5056,8.465-4.4973,24.4242-12.0175,31.9556c-7.5421,7.5354-23.5144,5.5361-31.9709,12.0372
		c-8.426,6.4724-10.5916,22.4186-19.8441,27.7841c-9.1962,5.3045-24.0964-0.7481-34.0012,3.3553
		c-9.7646,4.0555-16.0027,18.8904-26.3797,21.6598c-10.1933,2.7322-22.9943-6.993-33.6817-5.5952
		c-10.4428,1.3538-20.3167,14.0714-31.1049,14.0714c-10.8187,0-20.6796-12.7177-31.1264-14.0714
		c-10.6659-1.3977-23.4839,8.3275-33.6817,5.5952c-10.3725-2.7694-16.6151-17.6042-26.3886-21.6598
		c-9.8914-4.1142-24.7875,1.9492-33.9787-3.3661c-9.266-5.3547-11.427-21.3009-19.8531-27.7778
		c-8.4695-6.5056-24.4332-4.4973-31.9534-12.0327c-7.5422-7.5314-5.5298-23.5014-12.0479-31.9556
		c-6.4751-8.4368-22.4254-10.6068-27.78-19.8593c-5.3112-9.1849,0.7522-24.0811-3.3643-33.9792
		c-4.0381-9.7798-18.8774-16.0206-21.6553-26.3909c-2.734-10.2022,7.0086-23.0073,5.5997-33.688
		c-1.3475-10.4384-14.0737-20.297-14.0737-31.1094c0-10.8034,12.7262-20.6706,14.0737-31.1045
		c1.4089-10.6812-8.3337-23.4906-5.5997-33.6992c2.7779-10.3703,17.6172-16.6043,21.6773-26.3841
		c4.0945-9.8936-1.9689-24.801,3.3554-33.9792c5.3416-9.2525,21.2919-11.4293,27.767-19.8593
		c6.5181-8.461,4.5058-24.4202,12.0479-31.9556c7.5422-7.5314,23.4839-5.5276,31.9534-12.0242
		c8.4345-6.4813,10.609-22.4383,19.8531-27.793c9.1912-5.3045,24.0874,0.7481,33.9877-3.3598
		c9.7861-4.0555,16.0072-18.8904,26.3797-21.666c10.1978-2.721,23.0158,6.9929,33.6817,5.6105
		c10.4469-1.3628,20.3078-14.0759,31.1264-14.0759c10.7882,0,20.6621,12.7132,31.1049,14.0759
		c10.6874,1.3937,23.4884-8.3315,33.6817-5.6105c10.377,2.7757,16.6151,17.6105,26.4017,21.675
		c9.9003,4.099,24.783-1.9536,33.9792,3.3616c9.2525,5.3439,11.418,21.3009,19.8615,27.7823
		c8.4475,6.4966,24.4113,4.4928,31.9534,12.0287c7.5422,7.531,5.5298,23.4902,12.0175,31.9512
		c6.4876,8.4301,22.4338,10.6068,27.7885,19.8638c5.3152,9.1737-0.7392,24.0811,3.3643,33.9787
		c4.0596,9.7843,18.8814,16.0098,21.6553,26.3801c2.7385,10.2085-7.0086,23.018-5.6087,33.6992
		C492.9744,232.8969,505.6746,242.7641,505.6746,253.5676z"
                    />
                  </g>
                  <g>
                    <path
                      d="M468.5631,253.5676c0,117.7408-95.4404,213.1813-213.166,213.1813c-117.7471,0-213.1965-95.4404-213.1965-213.1813
		c0-117.7363,95.4494-213.1813,213.1965-213.1813C373.1227,40.3863,468.5631,135.8312,468.5631,253.5676z"
                    />
                  </g>
                  <g>
                    <path
                      fill="#FFFFFF"
                      d="M255.3971,454.2175c-110.6601,0-200.667-90.0114-200.667-200.65
		c0-110.6381,90.0069-200.645,200.667-200.645c110.63,0,200.6455,90.0069,200.6455,200.645
		C456.0426,364.2061,366.0271,454.2175,255.3971,454.2175z M255.3971,59.187c-107.1954,0-194.385,87.2071-194.385,194.3805
		c0,107.1779,87.1896,194.385,194.385,194.385c107.1739,0,194.3675-87.2071,194.3675-194.385
		C449.7646,146.3941,362.571,59.187,255.3971,59.187z"
                    />
                  </g>
                  <g>
                    <path
                      fill="#FFFFFF"
                      d="M255.3971,437.744c-101.5607,0-184.1872-82.6287-184.1872-184.1765
		c0-101.554,82.6265-184.172,184.1872-184.172c101.5432,0,184.1657,82.618,184.1657,184.172
		C439.5628,355.1153,356.9403,437.744,255.3971,437.744z M255.3971,70.9595c-100.6943,0-182.6121,81.92-182.6121,182.6081
		c0,100.6926,81.9178,182.6126,182.6121,182.6126c100.6858,0,182.5906-81.92,182.5906-182.6126
		C437.9877,152.8795,356.0829,70.9595,255.3971,70.9595z"
                    />
                  </g>
                  <g>
                    <g>
                      <g>
                        <polygon
                          fill="#FFFFFF"
                          points="255.3971,371.5928 272.1483,362.7775 268.9418,381.4515 282.5168,394.67 263.7662,397.3977 
				255.3971,414.3828 247.0109,397.3977 228.2519,394.67 241.8224,381.4515 238.6243,362.7775 			"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <polygon
                          fill="#FFFFFF"
                          points="315.5682,357.8318 328.9681,353.8946 323.9284,366.9272 331.8204,378.4482 317.8825,377.7001 
				309.3601,388.7639 305.7557,375.2591 292.6048,370.5737 304.3293,362.9899 304.7316,349.0322 			"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <polygon
                          fill="#FFFFFF"
                          points="360.2872,337.279 370.3273,338.2198 363.4763,345.611 365.6813,355.441 356.5381,351.213 
				347.867,356.3468 349.0658,346.3461 341.5062,339.6811 351.389,337.7364 355.3832,328.4839 			"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <polygon
                          fill="#FFFFFF"
                          points="195.196,360.9663 181.809,357.0291 186.8398,370.0616 178.9568,381.5935 192.8947,380.8369 
				201.4166,391.8898 205.0215,378.4044 218.1724,373.7104 206.4478,366.1244 206.0451,352.1622 			"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <polygon
                          fill="#FFFFFF"
                          points="150.4855,337.279 140.4673,338.2198 147.3008,345.611 145.0959,355.441 154.2476,351.213 
				162.9098,356.3468 161.7114,346.3461 169.2885,339.6811 159.3837,337.7364 155.3895,328.4839 			"
                        />
                      </g>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M230.063,154.8201h-19.6694v22.506h-10.5122V123.562h10.5122v21.8914h19.6694V123.562h10.5302v53.7641
			H230.063V154.8201z"
                      />
                    </g>
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M247.807,158.1271c0-6.5118,1.5836-11.5077,4.7553-15.0162c3.1892-3.5041,7.6385-5.2606,13.365-5.2606
			c3.0714,0,5.74,0.4878,7.9973,1.4568c2.2529,0.973,4.1124,2.347,5.6082,4.1187c1.4788,1.752,2.5987,3.8894,3.3249,6.4092
			c0.7526,2.5087,1.1244,5.2758,1.1244,8.2921c0,6.5118-1.5751,11.5126-4.7248,15.0252c-3.1497,3.4956-7.5901,5.2566-13.33,5.2566
			c-3.0709,0-5.7265-0.4923-7.9709-1.4568c-2.2658-0.9842-4.1559-2.3429-5.6606-4.1232c-1.5052-1.7632-2.6382-3.8979-3.3773-6.4047
			C248.1743,163.915,247.807,161.1483,247.807,158.1271z M258.0966,158.1271c0,1.6934,0.1572,3.2572,0.4507,4.6854
			c0.315,1.4331,0.7786,2.682,1.3954,3.7558c0.6124,1.076,1.4174,1.9182,2.4151,2.5047c1.0017,0.5797,2.196,0.8816,3.5695,0.8816
			c2.6207,0,4.5676-0.9452,5.8492-2.846c1.2687-1.89,1.9115-4.8866,1.9115-8.9815c0-3.539-0.5949-6.3891-1.7627-8.5591
			c-1.1814-2.1852-3.1807-3.277-5.998-3.277c-2.441,0-4.366,0.93-5.7485,2.7694
			C258.7834,150.9111,258.0966,153.9296,258.0966,158.1271z"
                      />
                    </g>
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M286.8958,138.9285h5.3152v-7.2317l9.9832-2.8348v10.0665h9.3708v8.439h-9.3708v14.7515
			c0,2.6668,0.254,4.5676,0.805,5.7332c0.534,1.1419,1.5576,1.7171,3.0319,1.7171c1.0236,0,1.9116-0.0981,2.6467-0.2997
			c0.7392-0.2074,1.5836-0.5116,2.4934-0.9206l1.7677,7.6775c-1.374,0.6608-2.9925,1.2252-4.8301,1.6844
			c-1.8636,0.4614-3.7317,0.6979-5.6127,0.6979c-3.5305,0-6.1292-0.9098-7.8046-2.721c-1.6625-1.8269-2.4805-4.8037-2.4805-8.9533
			v-19.367h-5.3152V138.9285z"
                      />
                    </g>
                  </g>
                  <g>
                    <path
                      fill="#FFFFFF"
                      d="M373.7745,274.1884h5.6786l1.317-6.8904c0.4722-2.5333,0.8485-4.9744,1.085-7.2971
		c0.2536-2.4522,0.3804-4.7248,0.3804-6.8509c0-6.3613-0.9713-11.6546-2.9616-16.2437c-2.0258-4.6352-4.8211-8.4542-8.3252-11.3397
		c-3.3863-2.7734-7.2841-4.7813-11.5758-5.9738c-3.8893-1.0868-7.9534-1.6383-12.0699-1.6383
		c-12.4202,0-22.3639,3.8195-29.5473,11.3634c-7.07,7.4266-10.6614,18.2058-10.6614,32.0345c0,3.4517,0.2665,6.6977,0.7172,9.804
		l-1.5352,0.6214c-0.0789,0.0394-0.1663,0.0743-0.2541,0.1026v-78.5382h-34.1364v43.599c-1.1419-3.4888-2.7779-6.6543-5.1406-9.2767
		c-2.756-3.0996-6.3957-5.4617-10.7882-7.0238c-4.0551-1.4568-8.7405-2.1611-14.3711-2.1611
		c-5.7879,0-11.4445,0.5228-16.7992,1.5464c-5.477,1.0393-10.346,2.5091-14.4629,4.3597l-6.8904,3.1058l8.5748,26.7999
		c-0.9843,0.7221-1.8417,1.5401-2.6991,2.3626c-0.6957-2.1131-1.5531-4.1299-2.6865-5.9321
		c-2.6466-4.2262-6.024-7.8356-10.0576-10.7578c-3.6618-2.6032-7.6206-4.8297-11.733-6.6149
		c-3.5655-1.5509-6.8729-3.0467-9.9223-4.5147c-2.441-1.1594-4.4489-2.4061-6.1422-3.819c0.0963-0.0833,1.2297-0.8444,4.6854-0.8444
		c3.7276,0,7.2447,0.4112,10.4124,1.2382c4.0945,1.0738,5.8094,1.9904,6.3389,2.3228l8.8198,5.602l11.8513-31.7236l-6.2385-3.5785
		c-3.9288-2.2444-8.6227-3.8893-14.3626-5.0008c-10.088-1.9599-22.3725-2.2833-31.7912,0.3633
		c-4.8651,1.343-9.1871,3.5041-12.8664,6.4177c-3.8195,3.0319-6.794,6.8662-8.8592,11.4051
		c-1.9904,4.4099-2.9921,9.5285-2.9921,15.2026c0,6.7963,1.4653,12.6124,4.3485,17.2803c2.6597,4.2916,6.0459,7.927,10.0795,10.8321
		c3.6134,2.5942,7.5901,4.8167,11.8513,6.6234c3.5435,1.4962,6.8509,2.9441,9.8824,4.3571
		c2.4415,1.1464,4.4404,2.3626,6.0244,4.0448c0,0.693-0.1183,0.934-0.3328,1.1132c-0.6693,0.422-2.7779,1.4066-7.857,1.4066
		c-1.8112,0-3.6005-0.1425-5.3153-0.418c-1.8681-0.3064-3.6398-0.6845-5.2933-1.1329c-1.6145-0.4421-3.0539-0.9188-4.3135-1.4174
		c-1.1724-0.4726-2.1262-0.9013-2.8613-1.2996l-8.5568-4.659l-11.8822,31.621l6.6583,3.4602
		c2.9795,1.5531,7.2317,2.997,12.9932,4.4229c5.6391,1.3825,12.2056,2.0912,19.4987,2.0912c5.7789,0,11.182-0.6823,16.0421-2.0208
		c5.2978-1.4438,9.9223-3.7406,13.8027-6.851c2.3013-1.8506,4.2697-4.0161,5.9845-6.4047c1.2906,2.476,2.8348,4.7857,4.8606,6.7591
		c2.6203,2.5284,5.7395,4.4838,9.2525,5.7879c3.4082,1.2839,7.2053,1.938,11.3088,1.938c6.1248,0,11.4185-1.2687,15.7626-3.7536
		l0.8659,2.824h32.0282l-2.1655-6.5078c0.7087,0.9278,1.4174,1.8331,2.2834,2.5942c4.2347,3.7406,10.0007,5.6347,17.1276,5.6347
		c3.7227,0,7.4239-0.4327,10.9979-1.2991c3.6398-0.8839,6.2695-1.7718,8.2773-2.7694l5.4116-2.721l-0.2361-1.6754
		c6.4572,5.5867,15.1672,8.465,26.0867,8.465c5.9456,0,11.694-0.8704,17.0662-2.5875c5.5733-1.7825,9.9832-4.0009,13.4873-6.7963
		l5.3722-4.2916L373.7745,274.1884z"
                    />
                  </g>
                  <g>
                    <path
                      d="M371.841,272.2545h5.6916l1.2996-6.8859c0.4897-2.5329,0.8485-4.9851,1.0935-7.3079
		c0.2536-2.4415,0.3718-4.7141,0.3718-6.8402c0-6.3546-0.9537-11.6654-2.9531-16.2482c-2.0388-4.646-4.8297-8.4543-8.3382-11.3437
		c-3.3862-2.7757-7.2796-4.784-11.5757-5.9693c-3.8759-1.0783-7.9315-1.6297-12.0659-1.6297
		c-12.4242,0-22.3461,3.8105-29.5473,11.3441c-7.0695,7.4284-10.6609,18.2054-10.6609,32.0452c0,3.4562,0.2755,6.6977,0.7172,9.804
		l-1.5267,0.6209c-0.0874,0.0287-0.1662,0.0681-0.2451,0.0918V191.402h-34.1364v43.6058c-1.1419-3.4893-2.7954-6.6498-5.1405-9.2767
		c-2.7735-3.0955-6.4133-5.4685-10.8057-7.0238c-4.0336-1.4523-8.7405-2.1611-14.3712-2.1611
		c-5.7879,0-11.4485,0.5228-16.7947,1.5464c-5.4685,1.0389-10.3331,2.5047-14.4675,4.3705l-6.8904,3.0951l8.5833,26.8043
		c-0.9842,0.7172-1.8416,1.5442-2.708,2.3622c-0.6953-2.1171-1.5442-4.1339-2.6861-5.9366
		c-2.6377-4.2325-6.015-7.8351-10.0576-10.7488c-3.6658-2.6072-7.6035-4.8386-11.733-6.6341
		c-3.5655-1.5401-6.8729-3.0364-9.9223-4.504c-2.441-1.1661-4.4533-2.4016-6.1422-3.8235c0.1137-0.0878,1.2382-0.8467,4.6814-0.8467
		c3.7446,0,7.2662,0.418,10.4379,1.2445c4.073,1.063,5.7834,1.9841,6.3259,2.334l8.8108,5.5957l11.8602-31.7348l-6.2296-3.5632
		c-3.9373-2.2641-8.6402-3.8938-14.3712-5.0093c-10.0795-1.9599-22.364-2.2748-31.8047,0.3633
		c-4.8521,1.343-9.1611,3.5041-12.8444,6.4088c-3.8415,3.0449-6.8116,6.8751-8.8812,11.4181
		c-1.9859,4.3992-2.9921,9.5133-2.9921,15.1981c0,6.7963,1.4788,12.6128,4.3745,17.2848c2.6337,4.2809,6.0199,7.923,10.058,10.8169
		c3.6223,2.6095,7.5986,4.8274,11.8513,6.6341c3.5435,1.4962,6.8509,2.9531,9.8824,4.3619c2.463,1.1414,4.4494,2.3514,6.0419,4.0444
		c0,0.6935-0.1138,0.9407-0.3503,1.1025c-0.6738,0.4287-2.7779,1.4129-7.8571,1.4129c-1.8022,0-3.6049-0.142-5.3153-0.409
		c-1.8681-0.3105-3.6443-0.6935-5.2978-1.1504c-1.61-0.4332-3.0494-0.9166-4.3091-1.4089
		c-1.1594-0.4681-2.1261-0.8901-2.8568-1.2991l-8.5618-4.6657L127.614,292.827l6.6498,3.4759
		c2.975,1.5594,7.2272,3.001,12.9932,4.4184c5.6521,1.3932,12.2056,2.1019,19.4942,2.1019c5.7834,0,11.1995-0.6845,16.0421-2.032
		c5.2978-1.4434,9.9438-3.7402,13.8112-6.8617c2.2923-1.8309,4.2612-3.9964,5.976-6.3828c1.2951,2.4652,2.8348,4.7683,4.8606,6.7479
		c2.6202,2.5288,5.7395,4.4775,9.2525,5.7879c3.4037,1.2839,7.2053,1.9294,11.3088,1.9294c6.1333,0,11.4181-1.2512,15.78-3.7514
		l0.8485,2.8303h32.0278l-2.1655-6.5073c0.7087,0.9166,1.4174,1.8264,2.3013,2.5987c4.2347,3.7402,9.9832,5.641,17.1096,5.641
		c3.7406,0,7.4243-0.444,10.9938-1.3099c3.6533-0.8794,6.291-1.761,8.2903-2.7694l5.4116-2.7165l-0.2271-1.6799
		c6.4397,5.5908,15.1627,8.4758,26.0647,8.4758c5.9671,0,11.6981-0.8772,17.0706-2.5943c5.5733-1.787,10.0007-4.0049,13.4828-6.8003
		l5.3986-4.2916L371.841,272.2545z"
                    />
                  </g>
                  <g>
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M182.5003,267.6283c0-2.8241-1.0456-5.1186-3.1148-6.8904c-2.0652-1.761-4.6814-3.3621-7.8136-4.8234
			c-3.1323-1.4564-6.5185-2.9526-10.1758-4.4973c-3.6658-1.5505-7.0605-3.4405-10.2018-5.6956
			c-3.1278-2.2489-5.7265-5.0442-7.8047-8.3996c-2.0737-3.3383-3.0973-7.63-3.0973-12.8359c0-4.4995,0.7436-8.3974,2.2399-11.7088
			c1.4963-3.3074,3.6443-6.0638,6.4222-8.2683c2.7734-2.205,6.0634-3.8347,9.8609-4.8978
			c3.7795-1.0586,8.0143-1.5948,12.6957-1.5948c5.3851,0,10.4553,0.4574,15.2196,1.3892c4.7642,0.9296,8.6841,2.2838,11.7724,4.0444
			l-5.6871,15.2178c-1.9509-1.2292-4.8561-2.3622-8.732-3.3818c-3.8893-1.0084-8.0847-1.52-12.5729-1.52
			c-4.2308,0-7.4812,0.8462-9.7211,2.5154c-2.2485,1.6822-3.3684,3.9261-3.3684,6.7569c0,2.6422,1.0236,4.8426,3.1018,6.6059
			c2.0777,1.761,4.6765,3.41,7.8042,4.8955c3.1282,1.4958,6.5145,3.0427,10.1978,4.6326c3.6528,1.584,7.048,3.513,10.1758,5.7485
			c3.1323,2.2578,5.731,5.0397,7.7957,8.3561c2.0912,3.2985,3.1149,7.4329,3.1149,12.3673c0,4.9327-0.8006,9.2001-2.4411,12.7571
			c-1.636,3.5784-3.9198,6.562-6.8729,8.9376c-2.9526,2.3779-6.5355,4.1496-10.7179,5.287
			c-4.1868,1.1571-8.8108,1.7323-13.8286,1.7323c-6.6148,0-12.4421-0.6258-17.4729-1.8613
			c-5.0312-1.2337-8.7324-2.4652-11.1121-3.7012l5.8273-15.4866c0.9622,0.5246,2.2224,1.111,3.7576,1.7211
			c1.5531,0.6146,3.2855,1.1925,5.2369,1.7171c1.9294,0.5385,3.9767,0.9802,6.1507,1.3345c2.157,0.3454,4.3839,0.5273,6.6847,0.5273
			c5.3721,0,9.4976-0.9058,12.3718-2.717C181.0609,274.0854,182.5003,271.3294,182.5003,267.6283z"
                      />
                    </g>
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M211.8724,230.1799c3.522-1.5903,7.7173-2.8456,12.5559-3.7756
			c4.8646-0.9251,9.9348-1.3932,15.2196-1.3932c4.5891,0,8.426,0.5515,11.5189,1.6647c3.0798,1.1025,5.5298,2.6771,7.341,4.6899
			c1.8112,2.0275,3.0884,4.4686,3.841,7.2837c0.7437,2.8196,1.12,5.9957,1.12,9.5285c0,3.8781-0.1402,7.7917-0.3938,11.7048
			c-0.267,3.9265-0.4112,7.7805-0.4637,11.5757c-0.0484,3.8038,0.0699,7.4808,0.3239,11.0485
			c0.28,3.5677,0.9273,6.945,1.9904,10.1189h-14.0168l-2.7954-9.1302h-0.6477c-1.7763,2.7363-4.2173,5.1029-7.3451,7.087
			c-3.1282,1.9796-7.1659,2.9638-12.1183,2.9638c-3.0798,0-5.8578-0.4592-8.3337-1.3887c-2.4635-0.921-4.5896-2.2444-6.3439-3.9525
			c-1.7673-1.7216-3.1278-3.7451-4.1035-6.092c-0.9712-2.3384-1.4434-4.9569-1.4434-7.8746c0-4.0511,0.8924-7.4767,2.6946-10.2524
			c1.8112-2.7802,4.4099-5.0352,7.8136-6.7523c3.3858-1.7086,7.4458-2.9137,12.1707-3.5722
			c4.7244-0.6603,9.9872-0.8574,15.806-0.5904c0.6209-4.9479,0.2756-8.4914-1.0545-10.6462
			c-1.3296-2.1763-4.2786-3.2528-8.8677-3.2528c-3.4252,0-7.0651,0.3633-10.915,1.0523c-3.8325,0.7199-6.9907,1.6495-9.4582,2.7802
			L211.8724,230.1799z M233.7029,279.3962c3.4342,0,6.1727-0.7719,8.198-2.3183c2.0303-1.5402,3.535-3.1891,4.4977-4.9502v-8.5985
			c-2.7345-0.276-5.3551-0.3261-7.875-0.1335c-2.5064,0.1725-4.7333,0.5663-6.6713,1.1809
			c-1.9469,0.6303-3.4866,1.5115-4.646,2.6534c-1.1334,1.1464-1.7108,2.5987-1.7108,4.3552c0,2.4805,0.7262,4.3902,2.183,5.7637
			C229.1353,278.7162,231.1435,279.3962,233.7029,279.3962z"
                      />
                    </g>
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M295.6368,270.2664c0,3.0906,0.3937,5.335,1.1808,6.7524c0.7965,1.4084,2.0782,2.1172,3.8369,2.1172
			c1.0675,0,2.0912-0.0896,3.1148-0.2665c1.0017-0.1774,2.2618-0.5752,3.7581-1.1813l1.8591,13.4962
			c-1.4089,0.698-3.5699,1.4022-6.4836,2.1109c-2.9048,0.6975-5.9058,1.063-8.9991,1.063c-5.0308,0-8.8588-1.1813-11.5183-3.5197
			c-2.6337-2.3425-3.9553-6.1902-3.9553-11.5713v-79.4001h17.2065V270.2664z"
                      />
                    </g>
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M369.7149,286.8138c-2.6337,2.1109-6.2386,3.8979-10.7752,5.3439
			c-4.5367,1.4568-9.3838,2.2005-14.5024,2.2005c-10.6655,0-18.4616-3.1215-23.4051-9.3314
			c-4.9435-6.2211-7.4194-14.7604-7.4194-25.6078c0-11.6394,2.7824-20.3758,8.3467-26.2027
			c5.5473-5.8166,13.365-8.7302,23.4051-8.7302c3.3688,0,6.6324,0.4422,9.804,1.3233c3.1717,0.8816,5.9935,2.3384,8.4654,4.3705
			c2.4585,2.0235,4.4489,4.7687,5.9671,8.194c1.4962,3.4494,2.2314,7.7281,2.2314,12.8467c0,1.8506-0.0963,3.828-0.3239,5.9451
			c-0.2276,2.1266-0.5515,4.3311-0.9842,6.6238h-39.7102c0.2801,5.5558,1.7064,9.7449,4.3136,12.564
			c2.5987,2.8218,6.8115,4.2285,12.6388,4.2285c3.6004,0,6.851-0.5403,9.7162-1.6427c2.8612-1.1025,5.0487-2.2202,6.545-3.3773
			L369.7149,286.8138z M345.111,238.2516c-4.4882,0-7.8396,1.343-9.9832,4.0399c-2.1655,2.6821-3.4646,6.2757-3.9068,10.7797
			h24.6169c0.3458-4.7643-0.3848-8.426-2.187-10.9961C351.8397,239.5355,348.9959,238.2516,345.111,238.2516z"
                      />
                    </g>
                  </g>
                </svg>
                <h1 className="prode_desc_heading">{product.name}</h1>
                <p id="product_id">Product # {product._id}</p>

                <hr />
                <p className="prode_desc_text">{product.description}</p>
                <p id="product_seller mb-3">
                  Sold by: <strong>{product.seller}</strong>
                </p>

                <hr />
                <div className="rating-outer">
                  <div
                    className="rating-inner"
                    style={{ width: `${(product.ratting / 5) * 100}%` }}
                  ></div>
                </div>
                <span id="no_of_reviews">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;({product.numOfReviews} Reviews)
                </span>

                <div id="product_price">
                  Rs.{product.price}&nbsp;
                  <small>Rs.{product.price + product.price * 0.2}</small>
                  <span className="stockCounter">
                    <button className="btn minus" onClick={decreaseQty}>
                      -
                    </button>

                    <input
                      type="number"
                      className="form-control count d-inline"
                      value={quantity}
                      readOnly
                    />

                    <button className="btn plus" onClick={increaseQty}>
                      +
                    </button>
                  </span>
                </div>
                <p>
                  Status:{" "}
                  <span
                    id="stock_status"
                    className={product.stock > 0 ? "greenColor" : "redColor"}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </p>
                {user ? (
                  <button
                    id="review_btn"
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#ratingModal"
                    onClick={setUserRatings}
                  >
                    Submit Review
                  </button>
                ) : (
                  <div className="login_alert" type="alert">
                    {/* Login to post your review */}
                  </div>
                )}
                <button
                  type="button"
                  id="cart_btn"
                  className="btn btn-primary"
                  disabled={product.stock <= 0}
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              </div>
              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <div
                    className="modal fade"
                    id="ratingModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="ratingModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="ratingModalLabel">
                            Submit Review
                          </h5>

                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <ul className="stars">
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                          </ul>

                          <textarea
                            name="review"
                            id="review"
                            className="form-control mt-3"
                            onChange={(e) => setReview(e.target.value)}
                          ></textarea>

                          <button
                            className="btn my-3 float-right review-btn px-4 text-white"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={reviewHandler}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="prod_review">
              {product.reviews && product.reviews.length > 0 && (
                <ListReviews reviews={product.reviews} />
              )}
            </div>
          </section>
          <div className="similar_products">

                <h1>Related Products</h1>
          <div className="card__container">
            {similar_products &&
              similar_products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
          </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;