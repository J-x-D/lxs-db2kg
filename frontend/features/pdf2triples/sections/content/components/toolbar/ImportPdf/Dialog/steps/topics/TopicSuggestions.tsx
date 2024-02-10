import GuidanceInfoAlert from "components/Guidance/GuidanceInfoAlert/GuidanceInfoAlert";
import { useStore } from "store/store";
import { Add, Refresh, RemoveCircle } from "@mui/icons-material";
import {
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function TopicSuggestions({
  text,
  disableAutoFetch,
}: {
  text: string;
  disableAutoFetch?: boolean;
}) {
  const { topics, setTopics, category, setCategory, prompts } = useStore();
  const [newTopic, setNewTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [topicLoading, setTopicLoading] = useState<boolean>(false);

  const fetchTopics = async () => {
    setTopicLoading(true);

    const prompt = prompts
      .find((p) => p.label === "Extract Topics")
      ?.prompt.replace("<placeholder_category>", text);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/execute`,
        {
          prompt,
        },
      );
      console.log("new topics", response.data);
      setTopics(response.data);
    } catch (error) {
      console.log(
        "%cTopicSuggestions.tsx line:36 Object",
        "color: white; background-color: #007acc;",
        error,
      );
    }

    setTopicLoading(false);
  };

  const fetchCategory = async () => {
    setLoading(true);
    const prompt = JSON.stringify(
      prompts.find((p) => p.label === "Categorize Text")?.prompt,
    );

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/execute`,
      {
        prompt,
      },
    );
    setCategory(response.data);
    setLoading(false);
  };

  const fetchRelevantInformation = async () => {
    try {
      await fetchCategory();
      await fetchTopics();
    } catch (error) {
      console.log(
        "%cTopicSuggestions.tsx line:36 Object",
        "color: white; background-color: #007acc;",
        error,
      );
    }
  };

  useEffect(() => {
    if (!disableAutoFetch) fetchRelevantInformation();

    return () => {};
  }, []);

  return (
    <Stack>
      <Typography variant="h6" gutterBottom>
        Topics
      </Typography>
      <GuidanceInfoAlert
        text={`In order to generate the best fitting triples. We first need to know
        which topics are of interest for you. We will generate a list of topics
        based on your text. Review them carefully and add/remove topics
        carefully based on your whishes.`}
      />

      <Stack direction="row" gap={1} padding={"0 1rem"} marginTop={2}>
        <TextField
          disabled={topicLoading}
          size="small"
          fullWidth
          label="Topic"
          placeholder="Your new topic..."
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setTopics([...topics, newTopic]);
              setNewTopic("");
            }
          }}
        />
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setTopics([...topics, newTopic]);
            setNewTopic("");
          }}
        >
          <Add />
        </Button>
      </Stack>
      <Grid margin={2}>
        {topics.length > 0
          ? topics.map((topic) => (
              <Chip
                sx={{ margin: "0.15rem" }}
                key={topic}
                label={topic}
                onDelete={() => {
                  setTopics(topics.filter((t) => t !== topic));
                }}
                variant="outlined"
              />
            ))
          : !disableAutoFetch && <LoadingTopics />}
      </Grid>
      {topics.length > 0 && (
        <Divider
          sx={{
            marginInline: 2,
          }}
        />
      )}
      <Stack
        direction="row"
        gap={2}
        m={2}
        marginTop={2}
        justifyContent="center"
      >
        <Button
          fullWidth
          size="small"
          variant="outlined"
          onClick={() => setTopics([])}
          startIcon={<RemoveCircle />}
          color="error"
        >
          Remove all topics
        </Button>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          onClick={() => {
            fetchTopics();
            setNewTopic("");
          }}
          disabled={topicLoading}
          startIcon={
            <Refresh
              sx={{
                animation: topicLoading ? "spin 2s linear infinite" : "",
                "@keyframes spin": {
                  "0%": {
                    transform: "rotate(0)",
                  },
                  "100%": {
                    transform: "rotate(360deg)",
                  },
                },
              }}
            />
          }
        >
          Reload Topics
        </Button>
      </Stack>
    </Stack>
  );
}

function LoadingTopics() {
  return (
    <Stack gap={1} marginTop={2}>
      <Typography variant="body2">Loading topics...</Typography>
      <LinearProgress />
    </Stack>
  );
}
