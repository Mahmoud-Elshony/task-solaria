import { useEffect, useState } from "react";
import image from "./assets/0-floor.png";
import svgOverlay from "./assets/0-floor.svg";
import dataObject from "./assets/data.json";

function App() {
  const [slectedRoom, setSelectedRoom] = useState(dataObject[0] || undefined);
  const [filterdRooms, setFilterdRoom] = useState(dataObject);
  const [price, setPrice] = useState("0");
  useEffect(() => {
    try {
      fetch(svgOverlay)
        .then((res) => res.text())
        .then((svgText) => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
          return svgDoc.documentElement;
        })
        .then((svgElem) => {
          svgElem.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 431;
            object-fit: cover;
          `;
          svgElem.querySelectorAll("polygon").forEach((polygonElement) => {
            polygonElement.style.opacity = ".6";
            polygonElement.addEventListener("mouseover", (event) => {
              if (event) {
                (
                  event.target as HTMLElement
                ) /*or polygonElement */.style.opacity = "0";
                const roomDataCode =
                  polygonElement.attributes[1 /*data-code*/].value;
                setSelectedRoom(
                  dataObject.find((code) => code.code === +roomDataCode) ||
                    dataObject[0]
                );
              }
            });
            polygonElement.addEventListener("mouseleave", (event) => {
              if (event) {
                polygonElement.style.opacity = ".6";
              }
            });
          });
          document.querySelector(".displayImg")?.appendChild(svgElem);
        });
    } catch (error) {
      throw error;
    }
  }, []);
  useEffect(() => {
    document
      .querySelector(".displayImg")
      ?.querySelectorAll("polygon")
      .forEach((polygonElement) => {
        polygonElement.style.opacity = "0";
        const roomsCodeData = filterdRooms.map((rom) => rom.code);
        const polygonDataCode =
          polygonElement.attributes[1 /*data-code*/].value;
        if (roomsCodeData.includes(+polygonDataCode)) {
          polygonElement.style.opacity = ".6";
        }
      });
  }, [filterdRooms]);
  function handelFilterWithStatus(status: string) {
    const filter = dataObject.filter((room) => room.status === status);
    setFilterdRoom(filter);
    console.log(filter);
  }
  function handelFilterWithPrice(price: string) {
    const filter = dataObject.filter((room) => room.price <= +price);
    setPrice(price)
    setFilterdRoom(filter);
    console.log(price);
  }
  return (
    <>
      <div className="displayImg">
        <img
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "431px",
            backgroundColor: "#272727",
            objectFit: "cover",
          }}
          src={image}
        />
      </div>
      <div className="details-card">
        <div className="details-card-content">
          <div className="details-card-header">
            <p>Unit F14</p>
            <p className="status">{slectedRoom?.status}</p>
          </div>
          <div className="details-card-row">
            <p>Unit Type</p>
            <p>f_b</p>
          </div>
          <div className="details-card-row">
            <p>Total Area</p>
            <p>36.6 M²</p>
          </div>
          <div className="details-card-row">
            <p>Price</p>
            <p>{slectedRoom?.price}</p>
          </div>
          <div className="details-card-actions">
            <button className="btn callback">Callback</button>
            <button className="btn info">Info</button>
          </div>
        </div>
      </div>
      <div className="filtercard">
        <div className="filter-container">
          <button className="toggle-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="svg-icon"
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
            </svg>
          </button>
          <div className="filter-content">
            <div className="tab-buttons">
              <div className="tab-indicator" data-tab="availability">
                •
              </div>
              <button className="tab-btn" data-tab="type">
                Type
              </button>
              <button className="tab-btn" data-tab="availability">
                Availability
              </button>
            </div>
            <div className="status-buttons">
              <button
                className="status-btn available"
                onClick={() => handelFilterWithStatus("available")}
              >
                available
              </button>
              <button
                className="status-btn reserved"
                onClick={() => handelFilterWithStatus("reserved")}
              >
                reserved
              </button>
              <button
                className="status-btn sold"
                onClick={() => handelFilterWithStatus("sold")}
              >
                sold
              </button>
              <button
                className="status-btn unlaunched"
                onClick={() => handelFilterWithStatus("unlaunched")}
              >
                unlaunched
              </button>
            </div>
            <div className="filter-sliders">
              <div className="filter-row">
                <p>Price</p>
                <p>LE 0.00 - {price}LE</p>
              </div>
              <div className="">
                <input type="range" min="0" max="100000" onChange={(EVENT)=>handelFilterWithPrice(EVENT.target.value)}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <img style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }} src={svgOverlay} /> */}
    </>
  );
}

export default App;
