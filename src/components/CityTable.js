import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const CityTable = () => {
  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset any previous errors
    try {
      const response = await axios.get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=&rows=50&start=${
          page * 50
        }`
      );
      const newCities = response.data.records.map((record) => ({
        name: record.fields.name,
        country: record.fields.country_name,
        timezone: record.fields.timezone,
        population: record.fields.population,
      }));

      setCities((prevCities) => [...prevCities, ...newCities]);

      if (newCities.length === 0) {
        setHasMore(false); // No more data to fetch
      }
    } catch (error) {
      setError("Failed to fetch cities. Please try again later.");
      console.error("Error fetching cities:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>City List</h1>
      <InfiniteScroll
        dataLength={cities.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Country</th>
              <th>Timezone</th>
              <th>Population</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr key={index}>
                <td>{city.name}</td>
                <td>{city.country}</td>
                <td>{city.timezone}</td>
                <td>{city.population}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
      {loading && <div>Loading more cities...</div>}
    </div>
  );
};

export default CityTable;
