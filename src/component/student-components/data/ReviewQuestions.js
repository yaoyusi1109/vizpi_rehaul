const ReviewQuestions = [
    {
      label: "Have you been regrouped?",
      description: "regrouped",
      inputType: "radio",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ],
    },
    {
      label: "Which group are you more satisfied with?",
      description: "more_satisfied_with",
      inputType: "radio",
      options: [
        { label: "First group", value: "firstGroup" },
        { label: "Second group", value: "secondGroup" },
        { label: "The same", value: "same" },
        { label: "Neither", value: "neither" }
      ],
    },
    {
      label: "Which group would you prefer to work with on future assignments?",
      description: "willing_to_work",
      inputType: "radio",
      options: [
        { label: "First group", value: "firstGroup" },
        { label: "Second group", value: "secondGroup" },
        { label: "The same", value: "same" },
        { label: "Neither", value: "neither" }
      ],
    },
    {
      label: "Tell us more (optional)",
      description: "additional_comment",
      inputType: "textfield",
      options: []
    },
  ];
  export default ReviewQuestions;
