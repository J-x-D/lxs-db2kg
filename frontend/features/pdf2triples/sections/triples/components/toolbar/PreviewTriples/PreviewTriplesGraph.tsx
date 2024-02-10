"use client";
import { useStore } from "store/store";
import React from "react";

// @ts-ignore
import VisGraph, { GraphData, Options } from "react-vis-graph-wrapper";
import {
  getColor,
  computeColorFromRgbaAndBackgroundIntoRgb,
} from "src/color";
import { KNOWN_KEYS } from "features/pdf2triples/types/triple";
import getHashedComment from "../../../utils/getHashedComment";
import { getLabel } from "../../../utils/getTripleLabelAndClass";

export default function PreviewTriplesGraph() {
  const { rdfResources } = useStore();

  try {
    const nodesMap = new Map();
    const edges: GraphData["edges"] = [];

    rdfResources
      .filter((rdf) =>
        Object.keys(rdf).includes(
          "http://www.w3.org/2000/01/rdf-schema#comment",
        ),
      )
      .forEach((triple, index) => {
        const s = getLabel("subject", triple, rdfResources);
        const subjectNodeId = s.toLowerCase();
        const hash = getHashedComment(triple);
        const color = getColor(hash);

        const subjectNode = {
          id: subjectNodeId,
          label: s,
          color: computeColorFromRgbaAndBackgroundIntoRgb(
            color,
            "rgb(255,255,255)",
          ),
          font: {
            size: 18,
            strokeColor: "black",
            strokeWidth: 0.5,
          },
          subLabel: `(${s})`,
        };

        if (!nodesMap.has(subjectNodeId)) {
          nodesMap.set(subjectNodeId, subjectNode);
        }

        const unknownKeys = Object.keys(triple).filter(
          (key) => !KNOWN_KEYS.includes(key),
        );

        const p = getLabel("predicate", triple, rdfResources);

        const o = getLabel("object", triple, rdfResources);

        const objectNodeId = o.toLowerCase();
        const objectNode = {
          id: objectNodeId,
          label: o,
          color: computeColorFromRgbaAndBackgroundIntoRgb(
            color,
            "rgb(255,255,255)",
          ),
          subLabel: `(${triple?.object?.class?.class})`,
        };

        if (!nodesMap.has(objectNodeId)) {
          nodesMap.set(objectNodeId, objectNode);
        }

        const edgeId = `${subjectNodeId}-${objectNodeId}-${p.toLowerCase()}-${index}`;
        const edge = {
          id: edgeId,
          from: subjectNodeId,
          to: objectNodeId,
          label: p,
        };

        edges.push(edge);
      });

    const graph: GraphData = {
      nodes: Array.from(nodesMap.values()),
      edges,
    };

    const options: Options = {
      layout: {
        improvedLayout: true,
      },
      nodes: {
        shape: "dot",
        borderWidth: 1,
        size: 30,
        opacity: 0,
        widthConstraint: {
          maximum: 250,
        },
        font: {
          // background: "white",
          size: 14,
          face: "Arial",
        },
      },
      edges: {
        arrowStrikethrough: false,
        width: 2,
        font: {
          background: "white",
          face: "Arial",
        },
      },
      physics: {
        barnesHut: {
          centralGravity: 0,
          damping: 0.07,
          avoidOverlap: 0.5,
          springLength: 220,
          springConstant: 0.01,
        },
      },
    };

    return (
      <div style={{ height: "100%", position: "relative" }}>
        <VisGraph graph={graph} options={options} />
      </div>
    );
  } catch (e) {
    console.log(e);
    return <div>Graph could not be rendered</div>;
  }
}
