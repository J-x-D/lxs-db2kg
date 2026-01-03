import React from "react";

interface TopicSuggestionsProps {
  text: string;
  disableAutoFetch?: boolean;
}

export default function TopicSuggestions({
  text,
  disableAutoFetch,
}: TopicSuggestionsProps) {
  return (
    <div>
      <p>Topic Suggestions component - to be implemented</p>
    </div>
  );
}
