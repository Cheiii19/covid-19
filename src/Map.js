import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { showDataOnMap } from "./util";
import "./Map.css";
import "leaflet/dist/leaflet.css";

function Map({ countries, casesType, center, zoom, dark }) {
  return (
    <div className={`${dark ? "map_dark" : "map"}`}>
      <MapContainer key={JSON.stringify(center)} center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  );
}

export default Map;
