import { DeleteById, GetAllRecords } from "../../wailsjs/go/main/App";

const Card = ({
  title,
  price,
  id,
  setSubscriptions,
  setTotal,
}: {
  title: string;
  price: string;
  id: string;
  setSubscriptions: any;
  setTotal: any;
}) => {
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
  async function deleteAndGet(id: string) {
    await DeleteById(id);
    getRecords();
  }
  return (
    <div id="card">
      <div id="card-segment">{title}</div>
      <div id="card-segment-two">
        {price}
        <button onClick={() => deleteAndGet(id)}>Delete</button>
      </div>
    </div>
  );
};

export default Card;
