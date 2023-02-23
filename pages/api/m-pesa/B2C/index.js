import mpesa from "../../../../util/m-pesa";
import { validateWithdrawalData } from "../../../../util/validators";

export default async function handler(req, res) {
  const data = {
    amount: req.body.amount,
    mssidn: req.body.number,
    uid: req.body.uid
  };
  const { valid, errors } = validateWithdrawalData(data);
  if (!valid) return res.status(400).json(errors);
  const { shortCode } = mpesa.configs
  await mpesa.b2c(
    shortCode, 
    data.mssidn,
    data.amount,
    process.env.SERVER_HOST + '/timeout', 
    process.env.SERVER_HOST + '/success',
  )
  .then((result) => {
    res.json(result.data)
  })
  .catch((err) => {
    console.log(err)
    res.status(500).json({ message: "Something went wrong, please try again" });
  });
};