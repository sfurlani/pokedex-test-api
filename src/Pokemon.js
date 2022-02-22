import { useEffect, useState } from "react";
import "./styles.css";
import Loading from "./Loading.js";
import FontAwesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faVenus } from "@fortawesome/fontawesome-free-solid";

FontAwesome.library.add(faMars, faVenus);

const faMale = <FontAwesomeIcon icon="fa-solid fa-mars" />;
const faFemale = <FontAwesomeIcon icon="fa-solid fa-venus" />;

const Pokemon = (props) => {
  console.log("Reloading Pokemon:", props.data.name);
  const [species, setSpecies] = useState(null);
  const [variety, setVariety] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(props.data.url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        console.log("Species", data);
        setSpecies(data);
        console.log(
          "Varieties",
          data.varieties.map((v) => v.pokemon.name)
        );
        const variety = data.varieties[0];
        if (!!variety && variety.is_default) {
          return fetch(variety.pokemon.url);
        } else {
          throw Error({
            name: "TypeError",
            message: "Can't use Variety"
          });
        }
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        console.log("Variety", data);
        setVariety(data);
      })
      .catch((error) => {
        console.error("Something Bad Happened", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.data.url]);

  if (loading) {
    return (
      <div className="Pokemon">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="Pokemon">
        <p>Error!</p>
      </div>
    );
  }

  const showSprites = (sprites, name) => {
    if (!!sprites.front_female) {
      return (
        <div id="sprites">
          <figure class="sprite">
            <img
              src={sprites.front_default}
              alt={"front sprite for male " + name}
            />
            <figcaption class="caption">{faMale}</figcaption>
          </figure>
          <figure class="sprite">
            <img
              src={sprites.front_default}
              alt={"front sprite for male " + name}
            />
            <figcaption class="caption">{faFemale}</figcaption>
          </figure>
        </div>
      );
    } else {
      return (
        <div id="sprites">
          <figure class="sprite">
            <img
              src={sprites.front_default}
              alt={"front sprite for male " + name}
            />
            <figcaption class="caption">
              {faMale}
              {faFemale}
            </figcaption>
          </figure>
        </div>
      );
    }
  };

  return (
    <div className="Pokemon">
      <h1>{species.name}</h1>
      {showSprites(variety.sprites, variety.name)}
      <table>
        <tr>
          <td class="name">Name</td>
          <td class="value">{species.name}</td>
        </tr>
        <tr>
          <td class="name">Number</td>
          <td class="value">{species.order}</td>
        </tr>
        <tr>
          <td class="name">Color</td>
          <td class="value" style={{ color: species.color.name }}>
            {species.color.name}
          </td>
        </tr>
        <tr>
          <td class="name">Habitat</td>
          <td class="value">{species.habitat.name}</td>
        </tr>
        {variety.types.map((val, key) => {
          return (
            <tr key={"type-" + key}>
              <td class="name">Type {val.slot}</td>
              <td class="value">{val.type.name}</td>
            </tr>
          );
        })}
        {variety.stats.map((val, key) => {
          return (
            <tr key={"stat-" + key}>
              <td class="name">{val.stat.name}</td>
              <td class="value">{val.base_stat}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Pokemon;
