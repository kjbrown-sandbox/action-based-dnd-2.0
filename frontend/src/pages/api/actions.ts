import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "lib/dynamodb";
import { NextApiRequest, NextApiResponse } from "next";

const TABLE_NAME = "action-based-dnd";

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (req.method === "POST") {
      const { action } = req.body;

      try {
         await dynamoDB.send(
            new PutCommand({
               TableName: TABLE_NAME,
               Item: { primaryKey: Date.now().toString(), action },
            })
         );
         res.status(200).json({ message: "Action saved!" });
      } catch (error) {
         console.error("Error saving action:", error); // Debugging log
         res.status(500).json({ error: "Failed to save action" });
      }
   } else if (req.method === "GET") {
      try {
         const data = await dynamoDB.send(
            new ScanCommand({ TableName: TABLE_NAME })
         );
         res.status(200).json(data.Items);
      } catch (error) {
         console.error("Error fetching actions:", error); // Debugging log
         res.status(500).json({ error: "Failed to fetch actions" });
      }
   } else {
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
   }
}
