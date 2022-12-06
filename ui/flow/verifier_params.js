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

export const paramsNFLAllDayTier = {
  names: { placeholder: "TIER", display: "Tier" },
  type: Types.Enum(["common", "rare", "legendary", "ultimate"])
}

export const paramsUFCStrikeTier = {
  names: { placeholder: "TIER", display: "Tier" },
  type: Types.Enum(["challenger", "contender", "champion", "fandom"])
}
