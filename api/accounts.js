import getCoinbaseAccounts from "../../utils/coinbaseConnect";
console.log("Handler loaded");
export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("I made it to here");
    const accounts = await getCoinbaseAccounts();
    res.status(200).json(accounts);
  } else {
    res.status(400).json({ message: "Unsupported method" });
  }
}
