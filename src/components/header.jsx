import React from "react";

export const Header = (props) => {
  return (
    <header id="header">
      <section class="hero">
        <div class="hero__logo">
          <img src="img/logo.jpg" alt="Company logo" />
        </div>
        <div class="hero__claim">
          <h1>Wir graben nicht - wir fräsen!</h1>
        </div>
      </section>
      {/* <div className="intro">
        <div className="overlay">
          <div className="container" style={{ width: "100%", height: "100%" }}>
            <div className="row">
              <div className="col-sm-4 col-xs-12" style={{ padding: "0" }}>
                <img
                  src="img/logo.jpg"
                  style={{
                    height: "70vh",
                    width: "100vw",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                ></img>
              </div>
              <div className="col-sm-8 col-xs-12">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </header>
  );
};
