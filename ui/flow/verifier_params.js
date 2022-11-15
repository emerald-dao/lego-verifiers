import { Types } from "./verifier_basic_types"

export const paramsAmount = {
  names: { placeholder: "AMOUNT", display: "Amount" },
  type: Types.PositiveInt()
}

export const paramsEvent = {
  names: { placeholder: "EVENT_ID", display: "Event ID" },
  type: Types.PositiveInt()
}

export const paramsNFLAllDayTier = {
  names: { placeholder: "TIER", display: "Tier" },
  type: Types.Enum(["COMMON", "RARE", "LEGENDARY", "ULTIMATE"])
}

export const paramsUFCStrikeTier = {
  names: { placeholder: "TIER", display: "Tier" },
  type: Types.Enum(["CHALLENGER", "CONTENDER", "CHAMPION", "FANDOM"])
}
