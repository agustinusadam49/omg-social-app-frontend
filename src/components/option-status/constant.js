export const STATUS_OPTIONS_ENUM = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
  FOLLOWERS_ONLY: "FOLLOWERS_ONLY",
};

export const STATUS_OPTIONS_DESCRIPTION_ENUM = {
  PUBLIC: "Semua orang dapat melihat postingan mu.",
  PRIVATE: "Hanya kamu yang dapat melihat postingan ini.",
  FOLLOWERS_ONLY:
    "Hanya kamu dan followers mu yang dapat melihat postingan ini.",
};

export const REPOST_OPTIONS_ENUM = {
  REPOST: "REPOST",
  REPOST_QUOTE: "REPOST_QUOTE",
};

export const REPOST_OPTION_TYPES = [
  {
    name: "REPOST",
    description: "Direct Repost",
  },
  {
    name: "REPOST_QUOTE",
    description: "Require caption",
  },
];
