import React, { memo, useState} from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { TableCell, TableRow } from '@material-ui/core';
const bent = require('bent');
const getJSON = bent('json');
const api_key = require('./api_key.js');

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const base = `https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&api_key=${api_key}&format=json&country=`


const MapChart = ({ setTooltipContent }) => {

  const [name, setName] = useState("");
  const [res, setRes] = useState("");
  const [rows, setRows] = useState([]);
  
  
  const handleClick = name => () => {
    // setName(name.toLowerCase())
    // setName(`${base}&country=${name.toLowerCase()}`)
    
    getJSON(base+name.toLowerCase())
      .then(d => {
        setRes(process(d));
        let tracks = d.tracks.track
        let cell = []
        tracks.forEach((track, index) => {
          // console.log(track)
          
          cell.push(
            <TableRow>
                    <TableCell>{track.name}</TableCell>
                    <TableCell>{track.artist.name}</TableCell>
                    <TableCell>
                      <a href={track.url} target="blank">Song Link</a>
                    </TableCell>
            </TableRow>
          )
          
        })
        setRows(cell);
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
                    const { NAME } = geo.properties;
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
        <tbody>
          {rows}
        </tbody>   
      </div>
    </>
  );
};

export default memo(MapChart);
