"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
//import { api } from "~/lib/api";
import { api } from '~/trpc/react';

export default function Leaderboard() {

      const {data} = api.leaderboard.getAllUsers.useQuery();
      console.log(data);


  return (
    <Table className="m-auto w-1/2">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Greeting</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium"></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
