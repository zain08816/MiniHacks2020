import React, { memo, useState} from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
const bent = require('bent');
const getJSON = bent('json');
const API_KEY = require('./api_key.js');

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const base = `https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&format=json&api_key=${API_KEY}`


const MapChart = ({ setTooltipContent }) => {

  const [name, setName] = useState("");
  const [json, setJson] = useState("");

  
  const handleClick = name => () => {
    console.log(name)
    // setName(name.toLowerCase())
    console.log(`${base}&country=${name}`)
    setName(`${base}&country=${name.toLowerCase()}`)
    setJson(JSON.stringify(getJSON(`${base}&country=${name.toLowerCase()}`)))

  }


  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME} = geo.properties;
                    setTooltipContent(`${NAME}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  onClick={handleClick(geo.properties.NAME_LONG)}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none"
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <div>
        <p>
        {name}
        </p>   
      </div>
    </>
  );
};

export default memo(MapChart);
