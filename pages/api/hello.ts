// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { seedDatabase } from '../../seed'; 
import { addDoc, setDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from '../../util/firebase';

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  seedDatabase(db, collection, addDoc, setDoc, doc, serverTimestamp());
  res.status(200).json({ message: 'seed database is initialized' })
}
