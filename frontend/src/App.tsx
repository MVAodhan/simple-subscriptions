import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CreateRecord, GetAllRecords } from "../wailsjs/go/main/App";
import Card from "./components/Card";

function App() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [total, setTotal] = useState<number | null>();

  const subRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);

  async function addSub() {
    await CreateRecord(
      JSON.stringify(subRef.current?.value),
      JSON.stringify(priceRef.current?.value)
    );
    subRef.current!.value = "";
    priceRef.current!.value = "";

    getRecords();
  }

  async function getRecords() {
    let subscriptions = await GetAllRecords();
    let subsJSON = await JSON.parse(subscriptions);

    let total: number = 0;
    subsJSON.forEach((sub: any) => {
      sub.Name = sub.Name.replace('"', "");
      sub.Name = sub.Name.replace('"', "");
      sub.Name = sub.Name.replace(" ", " ");

      sub.Price = sub.Price.replace('"', " ");
      sub.Price = sub.Price.replace('"', " ");
      let priceAsNum = Number(sub.Price);
      sub.Price = priceAsNum;
      total = total + sub.Price;
    });

    setSubscriptions(subsJSON);
    setTotal(total);
  }

  useEffect(() => {
    setTimeout(() => {
      getRecords();
    }, 2000);
  }, []);

  return (
    <div id="App">
      <div id="container">
        <h1>Simple Subscriptions Tracker</h1>
        <h3>
          Total : <span>{total}</span>
        </h3>
        <div id="main-container">
          <div id="sub-details">
            {subscriptions.map((sub) => (
              <Card
                id={sub.Id}
                key={sub.Id}
                title={sub.Name}
                price={sub.Price}
                setSubscriptions={setSubscriptions}
                setTotal={setTotal}
              />
            ))}
          </div>
          <div id="subs-container">
            <div id="input-labels">
              <h3>Title</h3>
              <h3>Price</h3>
            </div>
            <div id="sub-inputs">
              <input ref={subRef} />
              <input ref={priceRef} />
            </div>
            <button onClick={addSub}>Create Record</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
