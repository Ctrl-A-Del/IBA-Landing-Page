import React from "react";

export const About = (props) => {
  return (
    <div id="about">
      <div className="container">
        <div className="row">
          {/* <div className="col-xs-12 col-md-6">
            {" "}
            <img src="img/about.jpg" className="img-responsive" alt="" />{" "}
          </div> */}
          <div className="col-xs-12 col-md-12">
            <div className="about-text">
              <h2 className="heading">
                Entwickelt für den Energie- und Versorgungsnetzausbau
              </h2>
              {/* <p>{props.data ? props.data.paragraph : "loading..."}</p> */}
              {/* <h3>Why Choose Us?</h3> */}
              <div class="card-container">
                <div class="card">
                  <h3>Stromtrassen</h3>
                  <p>Erdkabel und Energieübertragung</p>
                </div>
                <div class="card">
                  <h3>Wasserstoff & Fernwärme</h3>
                  <p>Neue Leitungsnetze der Energiewende</p>
                </div>
                <div class="card">
                  <h3>Wasser & Abwasser</h3>
                  <p>Großformatige Versorgungsgräben</p>
                </div>
                <div class="card">
                  <h3>Weitere Infrastruktur</h3>
                  <p>Gas-, Drainage- und industrielle Leitungstrassen</p>
                </div>
              </div>

              {/* <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`}> {d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
