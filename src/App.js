import { useEffect, useState } from "react";
import "./styles.css";
import Pokemon from "./Pokemon.js";
import Loading from "./Loading.js";

const apiUrl = "https://pokeapi.co/api/v2/pokemon-species?limit=1&offset=0";

export default function App() {
  const [current, setCurrent] = useState(apiUrl);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(current)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(setData)
      .catch((error) => {
        console.error("Something Bad Happened", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [current]);

  const goTo = (toURL) => {
    setCurrent(toURL);
  };

  const jumpTo = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const id = event.target.entry.value;
    if (id < 1) {
      console.error("Entry too low " + id + " < 1");
    } else if (id > data.count) {
      console.error("Entry too high " + id + " > " + data.count);
    } else {
      const baseURL = "https://pokeapi.co/api/v2/pokemon?limit=1&offset=";
      goTo(baseURL + (id - 1));
    }
  };

  if (loading) {
    return (
      <div className="App">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Pokédex API</h1>
      <p>Total Number of Pokémon: {data.count}</p>
      <div id="navigation">
        <button id="previous-button" onClick={() => goTo(data.previous)}>
          Previous
        </button>
        <div>
          <form onSubmit={(e) => jumpTo(e)}>
            <input
              type="number"
              name="entry"
              placeholder={"Number 1 to " + data.count}
            />
            <button type="submit">Go</button>
          </form>
        </div>
        <button id="next-button" onClick={() => goTo(data.next)}>
          Next
        </button>
      </div>
      <Pokemon data={data.results[0]} />
    </div>
  );
}
