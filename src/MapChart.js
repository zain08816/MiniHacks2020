import React, { memo, useState} from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
const bent = require('bent');
const getBuffer = bent('buffer')

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const base = 'https://spotifycharts.com/regional/COUNTRY/daily/latest'


const MapChart = ({ setTooltipContent }) => {

  const [name, setName] = useState("");
  const [res, setRes] = useState("");

  
  const handleClick = name => () => {
    // setName(name.toLowerCase())
    // setName(`${base}&country=${name.toLowerCase()}`)
    getBuffer(base.replace('COUNTRY', name.toLowerCase()))
      .then(d => {
        setRes(process(d));
      })

  }

  const process = trackData => {
    if( !trackData.tracks )
      return ""
    return trackData.tracks.track.map(t => `${t.name} by ${t.artist.name}`).join(', ');
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
                  onClick={handleClick(geo.properties.ISO_A2)}
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
          ""
        </p>   
      </div>
    </>
  );
};

export default memo(MapChart);
