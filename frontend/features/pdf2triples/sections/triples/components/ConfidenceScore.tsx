import { RDFResource } from "features/pdf2triples/types/triple";
import { useStore } from "store/store";
import { CircularProgress, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { getLabel, getTripleClass } from "../utils/getTripleLabelAndClass";

type LabelClassCombo = {
  label: string;
  className: string;
};

export default function ConfidenceScore({ triple }: { triple: RDFResource }) {
  const { ontologyUrls, rdfResources } = useStore();
  const [confidenceScore, setConfidenceScore] = React.useState<number>(0);
  const [subjectLabelClassCombo, setSubjectLabelClassCombo] =
    React.useState<LabelClassCombo>();
  const [objectLabelClassCombo, setObjectLabelClassCombo] =
    React.useState<LabelClassCombo>();

  const [subjectConfidence, setSubjectConfidence] = React.useState<number>(0);
  const [objectConfidence, setObjectConfidence] = React.useState<number>(0);

  useEffect(() => {
    const subjectClass = getLabel("subject", triple, rdfResources);
    const subjectLabel = getTripleClass("subject", rdfResources, triple);
    const objectClass = getLabel("object", triple, rdfResources);
    const objectLabel = getTripleClass("object", rdfResources, triple);

    if (
      subjectClass !== subjectLabelClassCombo?.className ||
      subjectLabel !== subjectLabelClassCombo?.label
    ) {
      setSubjectLabelClassCombo({
        className: subjectClass,
        label: subjectLabel,
      });
    }

    if (
      objectClass !== objectLabelClassCombo?.className ||
      objectLabel !== objectLabelClassCombo?.label
    ) {
      setObjectLabelClassCombo({
        className: objectClass,
        label: objectLabel,
      });
    }

    return () => {};
  }, [triple]);

  let confidenceScoreColor:
    | "primary"
    | "error"
    | "warning"
    | "info"
    | "success" = "primary";
  if (confidenceScore < 25) confidenceScoreColor = "error";
  else if (confidenceScore < 50) confidenceScoreColor = "warning";
  else if (confidenceScore < 75) confidenceScoreColor = "info";
  else if (confidenceScore < 90) confidenceScoreColor = "success";

  const getConfidenceScore = async (className: string, label: string) => {
    try {
      const query = new URLSearchParams({
        class: className,
        label,
      });
      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/calc_confidence_score?${query.toString()}`;

      const response = await axios.get(url);
      return response.data?.confidence_score ?? 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchSubjectConfidenceScore = async () => {
      if (!subjectLabelClassCombo) return;
      const { className, label } = subjectLabelClassCombo;
      const confidenceScore = await getConfidenceScore(className, label);
      setSubjectConfidence(confidenceScore);
    };

    fetchSubjectConfidenceScore();
  }, [subjectLabelClassCombo]);

  useEffect(() => {
    const fetchObjectConfidenceScore = async () => {
      if (!objectLabelClassCombo) return;
      const { className, label } = objectLabelClassCombo;
      const confidenceScore = await getConfidenceScore(className, label);
      setObjectConfidence(confidenceScore);
    };

    fetchObjectConfidenceScore();
  }, [objectLabelClassCombo]);

  useEffect(() => {
    let divider = 1;
    let sum = 0;
    if (subjectConfidence > 0) {
      divider++;
      sum += subjectConfidence;
    }
    if (objectConfidence > 0) {
      divider++;
      sum += objectConfidence;
    }
    const confidenceScore = sum / divider;
    const rounded = Math.round(confidenceScore * 100);
    setConfidenceScore(rounded);
    return () => {};
  }, [subjectConfidence, objectConfidence]);

  const cs = confidenceScore > 0 ? `${confidenceScore}%` : "N/A";

  return (
    <Tooltip
      title="Confidence Score represents only the semantic similarity of the label to the class."
      placement="top"
      arrow
    >
      <div
        style={{
          marginRight: "0.5rem",
          position: "relative",
          display: "inline-flex",
          backgroundColor: "white",
          borderRadius: "50%",
        }}
      >
        <CircularProgress
          color={confidenceScoreColor}
          size={40}
          variant="determinate"
          value={confidenceScore}
        />
        <div
          style={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {cs}
          </Typography>
        </div>
      </div>
    </Tooltip>
  );
}
