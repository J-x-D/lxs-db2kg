import { useStore } from "store/store";
import { Badge, TableCell, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import PredicateInlineSelect from "./PredicateInlineSelect";

import axios from "axios";
import { prefixPredicate } from "src/utils/prefixPredicate";

export default function PredicatePrefixTableCell({
  column,
  predicatesForColumns,
}: {
  column: string;
  predicatesForColumns?: {
    reference: string;
    predicate: string;
    child?: string;
  }[];
}) {
  const predicate = predicatesForColumns?.find((p) => {
    if (p.child) {
      return p.child === column;
    }

    return (
      p.predicate.toLowerCase().includes(column.toLowerCase()) ||
      p.reference === column
    );
  })?.predicate;
  const { rmlRules, selectedTable, prefixes } = useStore();
  async function doesPredicateExist() {
    if (!predicate) {
      setExists(true);
      return;
    }

    try {
      const prefixPredicateStr = prefixPredicate(predicate, prefixes);
      const prefixStr = prefixPredicateStr?.split(":")[0];
      const predicateStr = prefixPredicateStr?.split(":")[1];

      const req = await axios.get(
        `/api/checkPrefixPredicate?prefix=${prefixStr}&predicate=${predicateStr}`
      );

      if (req.data.isMatch) {
        setExists(true);
        return;
      }
      const ip = await axios
        .get(`/api/getCurrentIp`)
        .then((res) => res.data.ip);
      const localIp = process.env.NEXT_PUBLIC_LOCAL_IP;

      if (
        predicate?.includes(ip) ||
        (localIp && predicate?.includes(localIp)) ||
        predicate?.includes("localhost")
      ) {
        console.log(
          "%cPredicatePrefixTableCell.tsx line:61 predicate",
          "color: white; background-color: #007acc;",
          encodeURI(predicate)
        );
        axios
          .get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/verify_predicate?predicate=${encodeURIComponent(predicate)}`
          )
          .then((res) => {
            if (res?.data?.is_in_texts) {
              setExists(true);
            } else {
              setExists(false);
            }
          })
          .catch((err) => {
            setExists(false);
          });
      } else {
        setExists(false);
      }
    } catch (error) {
      setExists(false);
    }
  }
  useEffect(() => {
    console.log(predicate);
    doesPredicateExist();
  }, [predicate]);
  const [exists, setExists] = React.useState(true);
  if (column === "id") return null;

  return (
    <TableCell key={predicate}>
      <Tooltip
        enterDelay={1000}
        leaveDelay={200}
        title={
          predicate === undefined
            ? "This column doesn't have a predicate yet"
            : !exists
            ? "This predicate probably doesn't exist"
            : "This predicate exists"
        }
        placement="top"
      >
        <Badge
          variant={!exists ? "standard" : "dot"}
          badgeContent={exists ? <span></span> : <span>?</span>}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor:
                predicate === undefined
                  ? "grey"
                  : !exists
                  ? "warning.main"
                  : "success.main",
              color: "white",
            },
          }}
          invisible={!rmlRules[selectedTable]}
        >
          <PredicateInlineSelect column={column} predicateDefault={predicate} />
        </Badge>
      </Tooltip>
    </TableCell>
  );
}
