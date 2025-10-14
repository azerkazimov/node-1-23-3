import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cat, setCat] = useState();
  useEffect(() => {
    fetch("http://localhost:8080/")
      .then((res) => res.json())
      .then((data) => setCat(data));
  }, []);

  return (
    <div className="App">
      {cat && (
        <div>
          <h1 className="cat-name">{cat.name}</h1>
          {cat.dev ? <p>Smart cat</p> : <p>Stupid cat</p>}
          <p>{cat.training}</p>
          {cat.hobbies.map((elem) => (
            <p>{elem}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
