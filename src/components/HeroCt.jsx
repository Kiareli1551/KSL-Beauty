import { useState } from "react"; 
export default function Hero() {
  //  onMouseover/onMouseout
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="container-fluid position-relative p-0 mt-4">
      <div className="hero-wrapper">
        <img
          src="/images/img2.jpg"
          className="hero-img"
          onMouseOver={() => setIsHovering(true)} //  onMouseover
          onMouseOut={() => setIsHovering(false)} // onMouseout
          onClick={() => {}} // onClick
        />

        <div className="texto-imagen1">
          <h3 id="titulos">CONTACTO</h3>
        </div>
      </div>
    </div>
  );
}