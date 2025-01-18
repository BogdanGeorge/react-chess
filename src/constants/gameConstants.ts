export const PLAY_MODES = {
  WHITE_VS_COMPUTER: "white-vs-computer",
  BLACK_VS_COMPUTER: "black-vs-computer",
  HUMAN_VS_HUMAN: "human-vs-human",
} as const;

export type GameMode = (typeof PLAY_MODES)[keyof typeof PLAY_MODES] | null;
