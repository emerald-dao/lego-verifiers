export const PresetVerifiersList = (network) => {
  if (network === "mainnet") {
    return mainnetPresetVerifiersList
  }
  return testnetPresetVerifiersList
}

export const testnetPresetVerifiersList = [
  {
    id: 0,
    name: "Owns FLOAT",
    description: "Checks to see if a user owns a FLOAT from a specific event.",
    logo: "/float.png",
    cadence: "owns_float.cdc",
    parameterNames: [
      {placeholder: "EVENT_ID", display: "Event ID"}
    ],
    validateParameters: () => {
      return false
    },
    imports: [
      "import FLOAT from 0xFLOAT"
    ]
  },
  {
    id: 1,
    name: "Owns X Flovatars",
    description: "Checks to see if a user owns AMOUNT Flovatars",
    logo: "/flovatar.jpeg",
    cadence: "owns_x_flovatars.cdc",
    parameterNames: [
      {placeholder: "AMOUNT", display: "Amount"}
    ],
    validateParameters: () => {
      return false
    },
    imports: [
      "import Flovatar from 0x921ea449dffec68a"
    ]
  },
  {
    id: 2,
    name: "Owns Flovatar",
    description: "Checks to see if a user owns at least 1 Flovatar",
    logo: "/flovatar.jpeg",
    cadence: "owns_flovatar.cdc",
    parameterNames: [],
    validateParameters: () => {
      return true
    },
    imports: [
      "import Flovatar from 0x921ea449dffec68a"
    ]
  }
]

export const mainnetPresetVerifiersList = [
  {
    id: 0,
    name: "Owns FLOAT",
    description: "Checks to see if a user owns a FLOAT from a specific event.",
    logo: "/float.png",
    cadence: "owns_float.cdc",
    parameterNames: [
      {placeholder: "EVENT_ID", display: "Event ID"}
    ],
    validateParameters: () => {
      return false
    },
    imports: [
      "import FLOAT from 0xFLOAT"
    ]
  },
  {
    id: 1,
    name: "Owns X Flovatars",
    description: "Checks to see if a user owns AMOUNT Flovatars",
    logo: "/flovatar.jpeg",
    cadence: "owns_x_flovatars.cdc",
    parameterNames: [
      {placeholder: "AMOUNT", display: "Amount"}
    ],
    validateParameters: () => {
      return false
    },
    imports: [
      "import Flovatar from 0x921ea449dffec68a"
    ]
  },
  {
    id: 2,
    name: "Owns Flovatar",
    description: "Checks to see if a user owns at least 1 Flovatar",
    logo: "/flovatar.jpeg",
    cadence: "owns_flovatar.cdc",
    parameterNames: [],
    validateParameters: () => {
      return true
    },
    imports: [
      "import Flovatar from 0x921ea449dffec68a"
    ]
  }
]