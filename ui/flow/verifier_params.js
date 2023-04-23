import { Types } from "./verifier_basic_types"

export const paramsAmount = {
  names: { placeholder: "AMOUNT", display: "Amount" },
  type: Types.PositiveInt()
}

export const paramsEvent = {
  names: { placeholder: "EVENT_ID", display: "Event ID" },
  type: Types.PositiveInt()
}

export const paramsSeason = {
  names: { placeholder: "SEASON", display: "Season" },
  type: Types.PositiveInt()
}

export const paramsSetID = {
  names: { placeholder: "SET_ID", display: "Set ID" },
  type: Types.PositiveInt()
}

export const paramsSetName = {
  names: { placeholder: "SET_NAME", display: "Set Name" },
  type: Types.String()
}

export const paramsSeriesId = {
  names: { placeholder: "SERIES_ID", display: "Series ID" },
  type: Types.PositiveInt()
}

export const paramsPlayID = {
  names: { placeholder: "PLAY_ID", display: "Play ID" },
  type: Types.PositiveInt()
}

export const paramsNFLAllDayTier = {
  names: { placeholder: "TIER", display: "Tier" },
  type: Types.Enum(["common", "rare", "legendary", "ultimate"])
}

export const paramsUFCStrikeTier = {
  names: { placeholder: "TIER", display: "Tier" },
  type: Types.Enum(["challenger", "contender", "champion", "fandom"])
}
