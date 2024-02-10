"use client";
import { getColor } from "src/color";
import { useStore } from "store/store";
import React, { useEffect, useState } from "react";
import Xarrow from "react-xarrows";
import getHashedComment from "../sections/triples/utils/getHashedComment";

export default function ConnectElements() {
  const {
    pdf2triplesHideTriples,
    selectedRDFResource,
    pdf2triplesLxsChangeMode,
    pdf2triplesLxsHideConnections,
  } = useStore();

  const [animateDrawing, setAnimateDrawing] = useState(false);
  const [_document, setDocument] = React.useState<any>(null);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    setDocument(document);
  }, [
    pdf2triplesHideTriples,
    selectedRDFResource,
    pdf2triplesLxsChangeMode,
    pdf2triplesLxsHideConnections,
  ]);

  const shouldDrawArrow = () =>
    animateDrawing &&
    selectedRDFResource?.id &&
    document.getElementById(`word-${selectedRDFResource?.id}`);

  // delay the drawing of the arrows to avoid a bug where the arrows are drawn before the element is collapsed
  useEffect(() => {
    if (pdf2triplesLxsHideConnections) {
      setAnimateDrawing(false);
      return;
    }
    setTimeout(() => {
      setAnimateDrawing(true);
    }, 300);

    return () => {
      setAnimateDrawing(false);
    };
  }, [selectedRDFResource, pdf2triplesLxsHideConnections]);

  useEffect(() => {
    if (pdf2triplesLxsHideConnections) setAnimateDrawing(true);
  }, [pdf2triplesLxsHideConnections]);

  useEffect(() => {
    setDraw(!!shouldDrawArrow());
  }, [animateDrawing, selectedRDFResource, pdf2triplesLxsChangeMode]);

  if (pdf2triplesLxsHideConnections) return null;

  const hash = getHashedComment(selectedRDFResource);

  const color = getColor(hash, true);

  return (
    <>
      {draw && (
        <Xarrow
          showHead
          showTail
          animateDrawing={animateDrawing}
          // startAnchor={{
          //   position: "bottom",
          //   offset: { x: -200 },
          // }}
          // curveness={1}
          // endAnchor={{ position: "left", offset: { x: -1, y: 90 } }}
          zIndex={100}
          key={selectedRDFResource?.id}
          color={color}
          start={`word-${selectedRDFResource?.id}`}
          end={`rdf-box-${selectedRDFResource?.id}`}
        />
      )}
    </>
  );
}
