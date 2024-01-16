export enum MenuOptions {
  HOME,
  FAVORTIES,
  PREFERENCES,
  OTHER,
}

export enum QuestionTypes {
  OPEN,
  SINGLE,
  MULTIPLE,
}

interface Question {
  type: QuestionTypes
  question: string // Shown to user
  promptQuestion: string // Shown to AI
  options: string[]
  answer: string
  placeHolder?: string
  customMapping?: { [key: string]: number } // can be used to redirect to another question depending on the selected answer
}

export const questionSet: Question[] = [
  {
    type: QuestionTypes.SINGLE,
    question: "What type of climate are you looking for?",
    options: ["Tropical and warm", "Mild and temperate", "Cold and snowy", "Dry and Arid", "No preference"],
    promptQuestion: "Climate: ",
    answer: "",
  },
  {
    type: QuestionTypes.SINGLE,
    question: "What environment are you looking for?",
    options: ["Bustling urban cities", "Coastal beaches", "Historical architecture", "Scenic nature"],
    promptQuestion: "Environment: ",
    answer: "",
  },
  {
    type: QuestionTypes.SINGLE,
    question: "What is your budget range?",
    options: ["Budget-friendly", "Moderate spending", "Luxury experience", "No preference"],
    promptQuestion: "Budget: ",
    answer: "",
  },
  {
    type: QuestionTypes.SINGLE,
    question: "How far are you looking to travel?",
    options: ["Driving distance from my city", "Within my country", "Anywhere around the world"],
    customMapping: { "Anywhere around the world": 5 }, // skip next question if this is selected
    promptQuestion: "Area: ",
    answer: "",
  },
  {
    type: QuestionTypes.OPEN,
    question: "Please enter your nearest city and state/province.",
    options: [""],
    placeHolder: "Seattle, Washington",
    promptQuestion: "My location: ",
    answer: "",
  },
  {
    type: QuestionTypes.OPEN,
    question: "Are there any dietary or accessiblity considerations?",
    options: [""],
    placeHolder: "Vegetarian, Public Transportation",
    promptQuestion: "Other considerations: ",
    answer: "",
  },
]
