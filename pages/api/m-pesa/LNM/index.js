import mpesa from "../../../../util/m-pesa";
import { validateDepositData } from "../../../../util/validators";

export default async function handler(req, res) {
  const data = {
    amount: req.body.amount,
    mssidn: req.body.number,
    uid: req.body.uid
  };
  const { valid, errors } = validateDepositData(data);
  if (!valid) return res.status(400).json(errors);
  await mpesa.lipaNaMpesaOnline(
    data.mssidn, 
    data.amount, 
    process.env.SERVER_HOST + '/response',
    data.uid
  )
  .then((result) => {
    res.json(result.data)
  })
  .catch((err) => {
    console.log(err)
    res.status(500).json({ message: "Something went wrong, please try again" });
  });
};