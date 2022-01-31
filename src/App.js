import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyStats } from "./util";
import numeral from "numeral";
import { Brightness4, WbSunny } from "@material-ui/icons";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [darkMode, setDarkMode] = useState(getMode);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);

          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, [mapCountries]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        countryCode === "worldwide"
          ? setMapCenter({ lat: 34.80746, lng: -40.4796 })
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

        setMapZoom(4);
      });
  };

  //dark mode functionality
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  function getMode() {
    const savedmode = JSON.parse(localStorage.getItem("darkMode"));
    return savedmode || false;
  }

  const toggleMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div>
      <span className={`dark_mode ${darkMode ? "dark_mode_dark" : ""}`}>
        <p onClick={toggleMode}>
          {darkMode ? (
            <span className="darkmode__sunny">
              <WbSunny fontSize="large" />
            </span>
          ) : (
            <span className="darkmode__moon">
              <Brightness4 fontSize="large" />
            </span>
          )}
        </p>
      </span>

      <div className={`app ${darkMode ? "app_dark" : ""}`}>
        <div className="app__left">
          <div className="app__header">
            <h1>COVID-19 Tracker</h1>

            <FormControl>
              <Select
                variant="outlined"
                value={country}
                onChange={onCountryChange}
                className={`app__dropdown ${darkMode && "app__dropdownDark"}`}
              >
                <MenuItem
                  value="worldwide"
                  className={`app__dropdownItem ${
                    darkMode && "app__dropdownDark"
                  }`}
                >
                  Worldwide
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem
                    value={country.value}
                    className={`app__dropdownItem ${
                      darkMode && "app__dropdownDark"
                    }`}
                  >
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="app__stats">
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              isRed
              active={casesType === "cases"}
              cases={prettyStats(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
              dark={darkMode}
            />
            <InfoBox
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              active={casesType === "recovered"}
              cases={prettyStats(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0.0a")}
              dark={darkMode}
            />
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              isRed
              active={casesType === "deaths"}
              cases={prettyStats(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0.0a")}
              dark={darkMode}
            />
          </div>
          <Map
            countries={mapCountries}
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
            dark={darkMode}
          />
        </div>

        <div className="app_right">
          <Card>
            <CardContent className={`${darkMode && "app_rightDark"}`}>
              <div
                className={`${
                  darkMode ? "app__informationDark" : "app__information"
                }`}
              >
                <h3>Live Cases by Country</h3>
                <Table countries={tableData} dark={darkMode} />
                <h3>Worldwide New {casesType}</h3>
                <LineGraph casesType={casesType} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;
