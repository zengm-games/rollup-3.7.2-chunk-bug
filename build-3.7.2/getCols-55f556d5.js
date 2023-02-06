const bySport = object => {
  const sport = process.env.SPORT;
  if (Object.hasOwn(object, sport)) {
    // https://github.com/microsoft/TypeScript/issues/21732
    // @ts-expect-error
    return object[sport];
  }
  if (Object.hasOwn(object, "default")) {
    // https://github.com/microsoft/TypeScript/issues/21732
    // @ts-expect-error
    return object.default;
  }
  throw new Error("No value for sport and no default");
};

const COMPOSITE_WEIGHTS$3 = {
  powerPitcher: {
    ratings: ["ppw"],
    weights: [1],
    skill: {
      label: "Pp",
      cutoff: 0.73
    }
  },
  finessePitcher: {
    ratings: ["ctl", "mov"],
    weights: [1, 1],
    skill: {
      label: "Pf",
      cutoff: 0.6
    }
  },
  controlPitcher: {
    ratings: ["ctl"],
    weights: [1]
  },
  pitcher: {
    ratings: ["ppw", "mov", "ctl"],
    weights: [1, 1, 0.5] // ctl is weighted less because it counts for strikes/balls too
  },

  workhorsePitcher: {
    ratings: ["endu"],
    weights: [1],
    skill: {
      label: "Pw",
      cutoff: 0.66
    }
  },
  outfieldRange: {
    ratings: ["spd", "fly", "hgt"],
    weights: [1, 0.2, 0.1],
    skill: {
      label: "Ro",
      cutoff: 0.6
    }
  },
  infieldRange: {
    ratings: ["spd", "gnd", "hgt"],
    weights: [1, 0.2, 0.2],
    skill: {
      label: "Ri",
      cutoff: 0.6
    }
  },
  firstBaseDefense: {
    ratings: ["hgt", "gnd"],
    weights: [2, 1],
    skill: {
      label: "D1",
      cutoff: 0.64
    }
  },
  catcherDefense: {
    ratings: ["cat"],
    weights: [1],
    skill: {
      label: "Dc",
      cutoff: 0.66
    }
  },
  groundBallDefense: {
    ratings: ["gnd", "spd"],
    weights: [1, 0.2],
    skill: {
      label: "Dg",
      cutoff: 0.67
    }
  },
  flyBallDefense: {
    ratings: ["fly", "spd"],
    weights: [1, 0.2],
    skill: {
      label: "Df",
      cutoff: 0.67
    }
  },
  arm: {
    ratings: ["thr"],
    weights: [1],
    skill: {
      label: "A",
      cutoff: 0.65
    }
  },
  powerHitter: {
    ratings: ["hpw"],
    weights: [1],
    skill: {
      label: "Hp",
      cutoff: 0.67
    }
  },
  contactHitter: {
    ratings: ["con", "hpw"],
    weights: [1, 0.2],
    skill: {
      label: "Hc",
      cutoff: 0.6
    }
  },
  eye: {
    ratings: ["eye"],
    weights: [1],
    skill: {
      label: "E",
      cutoff: 0.55
    }
  },
  speed: {
    ratings: ["spd"],
    weights: [1],
    skill: {
      label: "S",
      cutoff: 0.63
    }
  }
};
const PLAYER_GAME_STATS$3 = {
  batting: {
    name: "Batting",
    stats: ["ab", "r", "h", "rbi", "hr", "sb", "bb", "so", "pa"],
    seasonStats: ["ba", "obp", "slg", "ops"],
    sortBy: ["pa"]
  },
  pitching: {
    name: "Pitching",
    stats: ["ip", "hPit", "rPit", "er", "bbPit", "soPit", "hrPit", "pc"],
    seasonStats: ["era"],
    sortBy: ["min"]
  }
};
const PLAYER_SUMMARY$3 = {
  summaryBatter: {
    name: "SummaryBatter",
    onlyShowIf: ["C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"],
    stats: ["war", "ab", "h", "hr", "ba", "r", "rbi", "sb", "obp", "slg", "ops"]
  },
  summaryPitcher: {
    name: "SummaryPitcher",
    onlyShowIf: ["SP", "RP"],
    stats: ["war", "w", "l", "era", "gpPit", "gsPit", "sv", "ip", "soPit", "whip"]
  }
};
const PLAYER_STATS_TABLES$4 = {
  batting: {
    name: "Batting",
    stats: ["gp", "gs", "pa", "ab", "r", "h", "2b", "3b", "hr", "rbi", "sb", "cs", "bb", "so", "ba", "obp", "slg", "ops", "tb", "gdp", "hbp", "sh", "sf", "ibb"],
    onlyShowIf: ["pa", "r", "sb", "cs"]
  },
  pitching: {
    name: "Pitching",
    stats: ["w", "l", "winp", "era", "gpPit", "gsPit", "gf", "cg", "sho", "sv", "ip", "rPit", "er", "hPit", "2bPit", "3bPit", "hrPit", "bbPit", "soPit", "pc", "ibbPit", "hbpPit", "shPit", "sfPit", "bk", "wp", "bf", "fip", "whip", "h9", "hr9", "bb9", "so9", "pc9", "sow"],
    onlyShowIf: ["gpPit"]
  },
  fielding: {
    name: "Fielding",
    stats: ["pos", "gpF", "gsF", "cgF", "inn", "ch", "po", "a", "e", "dp", "fldp", "rfld", "rf9", "rfg", "pb", "sbF", "csF", "csp"],
    onlyShowIf: ["gpF"]
  },
  advanced: {
    name: "Advanced",
    stats: ["pa", "babip", "iso", "rbat", "rbr", "rfldTot", "rpos", "rpit", "raa", "waa", "rrep", "rar", "war"]
  },
  gameHighs: {
    name: "Game Highs",
    stats: ["gp",
    // Batting
    "paMax", "abMax", "rMax", "hMax", "2bMax", "3bMax", "hrMax", "rbiMax", "sbMax", "csMax", "bbMax", "soMax", "gdpMax", "tbMax", "hbpMax", "shMax", "sfMax", "ibbMax",
    // Pitching
    "ipMax", "rPitMax", "erMax", "hPitMax", "2bPitMax", "3bPitMax", "hrPitMax", "bbPitMax", "soPitMax", "ibbPitMax", "hbpPitMax", "shPitMax", "sfPitMax", "bkMax", "wpMax", "bfMax"]
  }
};
const TEAM_STATS_TABLES$4 = {
  batting: {
    name: "Batting",
    stats: ["pa", "ab", "pts", "h", "2b", "3b", "hr", "rbi", "sb", "cs", "bb", "so", "ba", "obp", "slg", "ops", "tb", "gdp", "hbp", "sh", "sf", "ibb", "mov"]
  },
  pitching: {
    name: "Pitching",
    stats: ["era", "cg", "sho", "sv", "ip", "rPit", "er", "hPit", "2bPit", "3bPit", "hrPit", "bbPit", "soPit", "pc", "ibbPit", "hbpPit", "shPit", "sfPit", "bk", "wp", "bf", "fip", "whip", "h9", "hr9", "bb9", "so9", "pc9", "sow"]
  },
  fielding: {
    name: "Fielding",
    stats: ["pos", "inn", "ch", "po", "a", "e", "dp", "fldp", "rf9", "rfg", "pb", "sbF", "csF", "csp"]
  },
  oppBatting: {
    name: "Opponent Batting",
    stats: ["oppPa", "oppAb", "oppR", "oppH", "opp2b", "opp3b", "oppHr", "oppRbi", "oppSb", "oppCs", "oppBb", "oppSo", "oppBa", "oppObp", "oppSlg", "oppOps", "oppTb", "oppGdp", "oppHbp", "oppSh", "oppSf", "oppIbb", "oppMov"]
  },
  oppPitching: {
    name: "Opponent Pitching",
    stats: ["oppEra", "oppCg", "oppSho", "oppSv", "oppIp", "oppRPit", "oppEr", "oppHPit", "opp2bPit", "opp3bPit", "oppHrPit", "oppBbPit", "oppSoPit", "oppPc", "oppIbbPit", "oppHbpPit", "oppShPit", "oppSfPit", "oppBk", "oppWp", "oppBf", "oppFip", "oppWhip", "oppH9", "oppHr9", "oppBb9", "oppSo9", "oppPc9", "oppSow"]
  },
  oppFielding: {
    name: "Opponent Fielding",
    stats: ["pos", "oppInn", "oppCh", "oppPo", "oppA", "oppE", "oppDp", "oppFldp", "oppRf9", "oppRfg", "oppPb", "oppSbF", "oppCsF", "oppCsp"]
  }
};
const POSITIONS$4 = ["SP", "RP", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"];
const POS_NUMBERS_INVERSE = {
  1: "P",
  2: "C",
  3: "1B",
  4: "2B",
  5: "3B",
  6: "SS",
  7: "LF",
  8: "CF",
  9: "RF",
  10: "DH"
};
const POSITION_COUNTS$4 = {
  SP: 5,
  RP: 10,
  C: 2,
  "1B": 1.25,
  "2B": 1.25,
  "3B": 1.25,
  SS: 1.25,
  LF: 5 / 3,
  CF: 5 / 3,
  RF: 5 / 3,
  DH: 0
};
const RATINGS$4 = ["hgt", "spd", "hpw", "con", "eye", "gnd", "fly", "thr", "cat", "ppw", "ctl", "mov", "endu"];
const SIMPLE_AWARDS$4 = ["mvp", "roy", "poy", "rpoy", "finalsMvp"];
const AWARD_NAMES$4 = {
  mvp: "Most Valuable Player",
  roy: "Rookie of the Year",
  poy: "Pitcher of the Year",
  rpoy: "Relief Pitcher of the Year",
  finalsMvp: "Finals MVP",
  allOffense: "All-Offensive Team",
  allDefense: "All-Defensive Team",
  allRookie: "All-Rookie Team"
};
const DEFAULT_CONFS$4 = [{
  cid: 0,
  name: "American Conference"
}, {
  cid: 1,
  name: "National Conference"
}];
const DEFAULT_DIVS$4 = [{
  did: 0,
  cid: 0,
  name: "East"
}, {
  did: 1,
  cid: 0,
  name: "Central"
}, {
  did: 2,
  cid: 0,
  name: "West"
}, {
  did: 3,
  cid: 1,
  name: "East"
}, {
  did: 4,
  cid: 1,
  name: "Central"
}, {
  did: 5,
  cid: 1,
  name: "West"
}];
const DEFAULT_STADIUM_CAPACITY$4 = 50000;
const NUM_STARTING_PITCHERS = 5;
const NUM_ACTIVE_PITCHERS = 15;
const NUM_ACTIVE_BATTERS = 14;
const NUM_OUTS_PER_INNING = 3;

const COMPOSITE_WEIGHTS$2 = {
  pace: {
    ratings: ["spd", "jmp", "dnk", "tp", "drb", "pss"]
  },
  usage: {
    ratings: ["ins", "dnk", "fg", "tp", "spd", "hgt", "drb", "oiq"],
    weights: [1.5, 1, 1, 1, 0.5, 0.5, 0.5, 0.5],
    skill: {
      label: "V",
      cutoff: 0.61
    }
  },
  dribbling: {
    ratings: ["drb", "spd"],
    weights: [1, 1],
    skill: {
      label: "B",
      cutoff: 0.68
    }
  },
  passing: {
    ratings: ["drb", "pss", "oiq"],
    weights: [0.4, 1, 0.5],
    skill: {
      label: "Ps",
      cutoff: 0.63
    }
  },
  turnovers: {
    ratings: [50, "ins", "pss", "oiq"],
    weights: [0.5, 1, 1, -1]
  },
  shootingAtRim: {
    ratings: ["hgt", "stre", "dnk", "oiq"],
    weights: [2, 0.3, 0.3, 0.2]
  },
  shootingLowPost: {
    ratings: ["hgt", "stre", "spd", "ins", "oiq"],
    weights: [1, 0.6, 0.2, 1, 0.4],
    skill: {
      label: "Po",
      cutoff: 0.61
    }
  },
  shootingMidRange: {
    ratings: ["oiq", "fg", "stre"],
    weights: [-0.5, 1, 0.2]
  },
  shootingThreePointer: {
    ratings: ["oiq", "tp"],
    weights: [0.1, 1],
    skill: {
      label: "3",
      cutoff: 0.59
    }
  },
  shootingFT: {
    ratings: ["ft"]
  },
  rebounding: {
    ratings: ["hgt", "stre", "jmp", "reb", "oiq", "diq"],
    weights: [2, 0.1, 0.1, 2, 0.5, 0.5],
    skill: {
      label: "R",
      cutoff: 0.61
    }
  },
  stealing: {
    ratings: [50, "spd", "diq"],
    weights: [1, 1, 2]
  },
  blocking: {
    ratings: ["hgt", "jmp", "diq"],
    weights: [2.5, 1.5, 0.5]
  },
  fouling: {
    ratings: [50, "hgt", "diq", "spd"],
    weights: [3, 1, -1, -1]
  },
  drawingFouls: {
    ratings: ["hgt", "spd", "drb", "dnk", "oiq"],
    weights: [1, 1, 1, 1, 1]
  },
  defense: {
    ratings: ["hgt", "stre", "spd", "jmp", "diq"],
    weights: [1, 1, 1, 0.5, 2]
  },
  defenseInterior: {
    ratings: ["hgt", "stre", "spd", "jmp", "diq"],
    weights: [2.5, 1, 0.5, 0.5, 2],
    skill: {
      label: "Di",
      cutoff: 0.57
    }
  },
  defensePerimeter: {
    ratings: ["hgt", "stre", "spd", "jmp", "diq"],
    weights: [0.5, 0.5, 2, 0.5, 1],
    skill: {
      label: "Dp",
      cutoff: 0.61
    }
  },
  endurance: {
    ratings: [50, "endu"],
    weights: [1, 1]
  },
  athleticism: {
    ratings: ["stre", "spd", "jmp", "hgt"],
    weights: [1, 1, 1, 0.75],
    skill: {
      label: "A",
      cutoff: 0.63
    }
  },
  jumpBall: {
    ratings: ["hgt", "jmp"],
    weights: [1, 0.25]
  }
};
const PLAYER_GAME_STATS$2 = {
  all: {
    name: "All",
    stats: ["gs", "min", "fg", "fga", "fgp", "tp", "tpa", "tpp", "ft", "fta", "ftp", "orb", "drb", "trb", "ast", "tov", "stl", "blk", "ba", "pf", "pts", "pm", "gmsc"],
    sortBy: ["min"]
  }
};
const PLAYER_SUMMARY$2 = {
  summary: {
    name: "Summary",
    stats: ["gp", "pts", "trb", "ast", "fgp", "tpp", "ftp", "tsp", "per", "ws"]
  }
};
const PLAYER_STATS_TABLES$3 = {
  regular: {
    name: "Per Game",
    stats: ["gp", "gs", "min", "fg", "fga", "fgp", "tp", "tpa", "tpp", "2p", "2pa", "2pp", "efg", "ft", "fta", "ftp", "orb", "drb", "trb", "ast", "tov", "stl", "blk", "ba", "pf", "pts"]
  },
  shotLocations: {
    name: "Shot Locations and Feats",
    stats: ["gp", "gs", "min", "fgAtRim", "fgaAtRim", "fgpAtRim", "fgLowPost", "fgaLowPost", "fgpLowPost", "fgMidRange", "fgaMidRange", "fgpMidRange", "tp", "tpa", "tpp", "dd", "td", "qd", "fxf"],
    superCols: [{
      title: "",
      colspan: 7
    }, {
      title: "At Rim",
      colspan: 3
    }, {
      title: "Low Post",
      colspan: 3
    }, {
      title: "Mid-Range",
      colspan: 3
    }, {
      title: "3PT",
      desc: "Three-Pointers",
      colspan: 3
    }, {
      title: "Feats",
      desc: "Statistical Feats",
      colspan: 4
    }]
  },
  advanced: {
    name: "Advanced",
    stats: ["gp", "gs", "min", "per", "ewa", "tsp", "tpar", "ftr", "orbp", "drbp", "trbp", "astp", "stlp", "blkp", "tovp", "usgp",
    //"pm",
    "pm100", "onOff100", "ortg", "drtg", "ows", "dws", "ws", "ws48", "obpm", "dbpm", "bpm", "vorp"]
  },
  gameHighs: {
    name: "Game Highs",
    stats: ["gp", "minMax", "fgMax", "fgaMax", "tpMax", "tpaMax", "2pMax", "2paMax", "ftMax", "ftaMax", "orbMax", "drbMax", "trbMax", "astMax", "tovMax", "stlMax", "blkMax", "baMax", "pfMax", "ptsMax", "pmMax", "gmscMax"]
  }
};
const TEAM_STATS_TABLES$3 = {
  team: {
    name: "Team",
    stats: ["fg", "fga", "fgp", "tp", "tpa", "tpp", "2p", "2pa", "2pp", "ft", "fta", "ftp", "orb", "drb", "trb", "ast", "tov", "stl", "blk", "pf", "pts", "mov"]
  },
  opponent: {
    name: "Opponent",
    stats: ["oppFg", "oppFga", "oppFgp", "oppTp", "oppTpa", "oppTpp", "opp2p", "opp2pa", "opp2pp", "oppFt", "oppFta", "oppFtp", "oppOrb", "oppDrb", "oppTrb", "oppAst", "oppTov", "oppStl", "oppBlk", "oppPf", "oppPts", "oppMov"]
  },
  teamShotLocations: {
    name: "Shot Locations and Feats",
    stats: ["fgAtRim", "fgaAtRim", "fgpAtRim", "fgLowPost", "fgaLowPost", "fgpLowPost", "fgMidRange", "fgaMidRange", "fgpMidRange", "tp", "tpa", "tpp", "dd", "td", "qd", "fxf"],
    superCols: [{
      title: "",
      colspan: 4
    }, {
      title: "At Rim",
      colspan: 3
    }, {
      title: "Low Post",
      colspan: 3
    }, {
      title: "Mid-Range",
      colspan: 3
    }, {
      title: "3PT",
      desc: "Three-Pointers",
      colspan: 3
    }, {
      title: "Feats",
      desc: "Statistical Feats",
      colspan: 4
    }]
  },
  opponentShotLocations: {
    name: "Opponent Shot Locations and Feats",
    stats: ["oppFgAtRim", "oppFgaAtRim", "oppFgpAtRim", "oppFgLowPost", "oppFgaLowPost", "oppFgpLowPost", "oppFgMidRange", "oppFgaMidRange", "oppFgpMidRange", "oppTp", "oppTpa", "oppTpp", "oppDd", "oppTd", "oppQd", "oppFxf"],
    superCols: [{
      title: "",
      colspan: 4
    }, {
      title: "At Rim",
      colspan: 3
    }, {
      title: "Low Post",
      colspan: 3
    }, {
      title: "Mid-Range",
      colspan: 3
    }, {
      title: "3PT",
      desc: "Three-Pointers",
      colspan: 3
    }, {
      title: "Feats",
      desc: "Statistical Feats",
      colspan: 4
    }]
  },
  advanced: {
    name: "Advanced",
    stats: ["pw", "pl", "ortg", "drtg", "nrtg", "pace", "tpar", "ftr", "tsp", "efg", "tovp", "orbp", "ftpFga"]
  }
};
const POSITIONS$3 = ["PG", "G", "SG", "GF", "SF", "F", "PF", "FC", "C"];
const POSITION_COUNTS$3 = {};
const RATINGS$3 = ["hgt", "stre", "spd", "jmp", "endu", "ins", "dnk", "ft", "fg", "tp", "oiq", "diq", "drb", "pss", "reb"];
const SIMPLE_AWARDS$3 = ["mvp", "roy", "smoy", "dpoy", "mip", "finalsMvp"];
const AWARD_NAMES$3 = {
  mvp: "Most Valuable Player",
  roy: "Rookie of the Year",
  smoy: "Sixth Man of the Year",
  dpoy: "Defensive Player of the Year",
  mip: "Most Improved Player",
  finalsMvp: "Finals MVP",
  sfmvp: "Semifinals MVP",
  allLeague: "All-League",
  allDefensive: "All-Defensive",
  allRookie: "All-Rookie Team"
};
const DEFAULT_CONFS$3 = [{
  cid: 0,
  name: "Eastern Conference"
}, {
  cid: 1,
  name: "Western Conference"
}];
const DEFAULT_DIVS$3 = [{
  did: 0,
  cid: 0,
  name: "Atlantic"
}, {
  did: 1,
  cid: 0,
  name: "Central"
}, {
  did: 2,
  cid: 0,
  name: "Southeast"
}, {
  did: 3,
  cid: 1,
  name: "Southwest"
}, {
  did: 4,
  cid: 1,
  name: "Northwest"
}, {
  did: 5,
  cid: 1,
  name: "Pacific"
}];
const DEFAULT_STADIUM_CAPACITY$3 = 25000;

const COMPOSITE_WEIGHTS$1 = {
  passingAccuracy: {
    ratings: ["tha", "hgt"],
    weights: [1, 0.2],
    skill: {
      label: "Pa",
      cutoff: 0.71
    }
  },
  passingDeep: {
    ratings: ["thp", "tha", "hgt"],
    weights: [1, 0.1, 0.2],
    skill: {
      label: "Pd",
      cutoff: 0.71
    }
  },
  passingVision: {
    ratings: ["thv", "hgt"],
    weights: [1, 0.5],
    skill: {
      label: "Ps"
    }
  },
  athleticism: {
    ratings: ["stre", "spd", "hgt"],
    weights: [1, 1, 0.2],
    skill: {
      label: "A"
    }
  },
  rushing: {
    ratings: ["stre", "spd", "elu"],
    weights: [0.5, 1, 1],
    skill: {
      label: "X",
      cutoff: 0.55
    }
  },
  catching: {
    ratings: ["hgt", "hnd"],
    weights: [0.2, 1],
    skill: {
      label: "H",
      cutoff: 0.73
    }
  },
  gettingOpen: {
    ratings: ["hgt", "spd", "rtr", "hnd"],
    weights: [1, 0.25, 2, 1]
  },
  speed: {
    ratings: ["spd"],
    weights: [1]
  },
  passBlocking: {
    ratings: ["hgt", "stre", "spd", "pbk"],
    weights: [0.5, 1, 0.2, 1],
    skill: {
      label: "Bp",
      cutoff: 0.63
    }
  },
  runBlocking: {
    ratings: ["hgt", "stre", "spd", "rbk"],
    weights: [0.5, 1, 0.4, 1],
    skill: {
      label: "Br"
    }
  },
  passRushing: {
    ratings: ["hgt", "stre", "spd", "prs", "tck"],
    weights: [1, 1, 0.5, 1, 0.1],
    skill: {
      label: "PR",
      cutoff: 0.63
    }
  },
  runStopping: {
    ratings: ["hgt", "stre", "spd", "rns", "tck"],
    weights: [0.5, 1, 0.5, 1, 0.25],
    skill: {
      label: "RS"
    }
  },
  passCoverage: {
    ratings: ["hgt", "spd", "pcv"],
    weights: [0.1, 1, 1],
    skill: {
      label: "L",
      cutoff: 0.72
    }
  },
  tackling: {
    ratings: ["spd", "stre", "tck"],
    weights: [1, 1, 2.5]
  },
  avoidingSacks: {
    ratings: ["thv", "elu", "stre"],
    weights: [1, 1, 0.25]
  },
  ballSecurity: {
    ratings: ["bsc", "stre"],
    weights: [1, 0.2]
  },
  endurance: {
    ratings: [50, "endu"],
    weights: [1, 1]
  },
  kickingPower: {
    ratings: ["kpw"],
    weights: [1]
  },
  kickingAccuracy: {
    ratings: ["kac"],
    weights: [1]
  },
  punting: {
    ratings: ["ppw", "pac"],
    weights: [1, 1]
  }
};
const PLAYER_GAME_STATS$1 = {
  passing: {
    name: "Passing",
    stats: ["pssCmp", "pss", "cmpPct", "pssYds", "pssTD", "pssInt", "pssSk", "pssSkYds", "qbRat", "fmbLost", "fp"],
    sortBy: ["pssYds"]
  },
  rushing: {
    name: "Rushing",
    stats: ["rus", "rusYds", "rusYdsPerAtt", "rusLng", "rusTD", "fmbLost", "fp"],
    sortBy: ["rusYds"]
  },
  receiving: {
    name: "Receiving",
    stats: ["tgt", "rec", "recYds", "recYdsPerAtt", "recLng", "recTD", "fp"],
    sortBy: ["recYds"]
  },
  kicking: {
    name: "Kicking",
    stats: ["fg", "fga", "fgPct", "fgLng", "xp", "xpa", "xpPct", "kickingPts", "fp"],
    sortBy: ["kickingPts"]
  },
  punting: {
    name: "Punting",
    stats: ["pnt", "pntYdsPerAtt", "pntIn20", "pntTB", "pntLng", "pntBlk"],
    sortBy: ["pnt"]
  },
  returns: {
    name: "Returns",
    stats: ["kr", "krYds", "krYdsPerAtt", "krLng", "krTD", "pr", "prYds", "prYdsPerAtt", "prLng", "prTD"],
    sortBy: ["krYds", "prYds"]
  },
  defense: {
    name: "Defense",
    stats: ["defTckSolo", "defTckAst", "defTck", "defTckLoss", "defSk", "defSft", "defPssDef", "defInt", "defIntYds", "defIntTD", "defIntLng", "defFmbFrc", "defFmbRec", "defFmbYds", "defFmbTD", "defFmbLng"],
    sortBy: ["defTck"]
  }
};
const PLAYER_SUMMARY$1 = {
  summaryPss: {
    name: "SummaryQB",
    onlyShowIf: ["QB"],
    stats: ["gp", "av", "qbRec", "cmpPct", "pssYds", "pssYdsPerAtt", "pssTD", "pssInt"]
  },
  summaryRus: {
    name: "SummaryRus",
    onlyShowIf: ["RB"],
    stats: ["gp", "av", "rus", "rusYds", "rusYdsPerAtt", "rusTD"]
  },
  summaryRec: {
    name: "SummaryRec",
    onlyShowIf: ["WR", "TE"],
    stats: ["gp", "av", "rec", "recYds", "recYdsPerRec", "recTD"]
  },
  summaryOL: {
    name: "SummaryOL",
    onlyShowIf: ["OL"],
    stats: ["gp", "av"]
  },
  summaryKic: {
    name: "SummaryKic",
    onlyShowIf: ["K"],
    stats: ["gp", "av", "fg", "fga", "xp", "xpa"]
  },
  summaryPunt: {
    name: "SummaryPunt",
    onlyShowIf: ["P"],
    stats: ["gp", "av", "pnt", "pntYds", "pntYdsPerAtt"]
  },
  summaryDef: {
    name: "SummaryDef",
    onlyShowIf: ["DL", "LB", "CB", "S"],
    stats: ["gp", "av", "defTck", "defSk", "defFmbRec", "defInt"]
  }
};
const PLAYER_STATS_TABLES$2 = {
  passing: {
    name: "Passing",
    onlyShowIf: ["pss"],
    stats: ["gp", "gs", "qbRec", "pssCmp", "pss", "cmpPct", "pssYds", "pssTD", "pssTDPct", "pssInt", "pssIntPct", "pssLng", "pssYdsPerAtt", "pssAdjYdsPerAtt", "pssYdsPerCmp", "pssYdsPerGame", "qbRat", "pssSk", "pssSkYds", "pssNetYdsPerAtt", "pssAdjNetYdsPerAtt", "pssSkPct", "fp", "av"]
  },
  rushing: {
    name: "Rushing and Receiving",
    onlyShowIf: ["rus", "rec"],
    stats: ["gp", "gs", "rus", "rusYds", "rusTD", "rusLng", "rusYdsPerAtt", "rusYdsPerGame", "rusPerGame", "tgt", "rec", "recYds", "recTD", "recLng", "recYdsPerRec", "recPerGame", "recYdsPerGame", "recCatchPct", "touches", "ydsPerTouch", "ydsFromScrimmage", "rusRecTD", "fmb", "fp", "av"]
  },
  defense: {
    name: "Defense, Fumbles, and Penalties",
    onlyShowIf: ["gp"],
    stats: ["gp", "gs", "defInt", "defIntYds", "defIntTD", "defIntLng", "defPssDef", "defFmbFrc", "defFmbRec", "defFmbYds", "defFmbTD", "defFmbLng", "defSk", "defTck", "defTckSolo", "defTckAst", "defTckLoss", "defSft", "fmb", "fmbLost", "pen", "penYds", "av"]
  },
  kicking: {
    name: "Kicking and Punting",
    onlyShowIf: ["fga", "xpa", "pnt"],
    stats: ["gp", "gs", "fg0", "fga0", "fg20", "fga20", "fg30", "fga30", "fg40", "fga40", "fg50", "fga50", "fgLng", "fg", "fga", "fgPct", "xp", "xpa", "xpPct", "pnt", "pntYds", "pntLng", "pntBlk", "pntYdsPerAtt", "fp", "av"]
  },
  returns: {
    name: "Kick and Punt Returns",
    onlyShowIf: ["pr", "kr"],
    stats: ["gp", "gs", "pr", "prYds", "prTD", "prLng", "prYdsPerAtt", "kr", "krYds", "krTD", "krLng", "krYdsPerAtt", "allPurposeYds", "av"]
  }
};
const TEAM_STATS_TABLES$2 = {
  team: {
    name: "Team",
    stats: ["pts", "yds", "ply", "ydsPerPlay", "tov", "fmbLost", "pssCmp", "pss", "pssYds", "pssTD", "pssInt", "pssNetYdsPerAtt", "rus", "rusYds", "rusTD", "rusYdsPerAtt", "pen", "penYds", "drives", "drivesScoringPct", "drivesTurnoverPct", "avgFieldPosition", "timePerDrive", "playsPerDrive", "ydsPerDrive", "ptsPerDrive"]
  },
  opponent: {
    name: "Opponent",
    stats: ["oppPts", "oppYds", "oppPly", "oppYdsPerPlay", "oppTov", "oppFmbLost", "oppPssCmp", "oppPss", "oppPssYds", "oppPssTD", "oppPssInt", "oppPssNetYdsPerAtt", "oppRus", "oppRusYds", "oppRusTD", "oppRusYdsPerAtt", "oppPen", "oppPenYds", "oppDrives", "oppDrivesScoringPct", "oppDrivesTurnoverPct", "oppAvgFieldPosition", "oppTimePerDrive", "oppPlaysPerDrive", "oppYdsPerDrive", "oppPtsPerDrive"]
  }
};
const POSITIONS$2 = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K", "P", "KR", "PR"];
const POSITION_COUNTS$2 = {
  QB: 3,
  RB: 4,
  WR: 6,
  TE: 3,
  OL: 9,
  DL: 9,
  LB: 7,
  CB: 5,
  S: 5,
  K: 1,
  P: 1
};
const RATINGS$2 = ["hgt", "stre", "spd", "endu", "thv", "thp", "tha", "bsc", "elu", "rtr", "hnd", "rbk", "pbk", "pcv", "tck", "prs", "rns", "kpw", "kac", "ppw", "pac"];
const SIMPLE_AWARDS$2 = ["mvp", "dpoy", "oroy", "droy", "finalsMvp"];
const AWARD_NAMES$2 = {
  mvp: "Most Valuable Player",
  dpoy: "Defensive Player of the Year",
  oroy: "Offensive Rookie of the Year",
  droy: "Defensive Rookie of the Year",
  finalsMvp: "Finals MVP",
  allLeague: "All-League",
  allRookie: "All-Rookie Team"
};
const DEFAULT_CONFS$2 = [{
  cid: 0,
  name: "American Conference"
}, {
  cid: 1,
  name: "National Conference"
}];
const DEFAULT_DIVS$2 = [{
  did: 0,
  cid: 0,
  name: "East"
}, {
  did: 1,
  cid: 0,
  name: "North"
}, {
  did: 2,
  cid: 0,
  name: "South"
}, {
  did: 3,
  cid: 0,
  name: "West"
}, {
  did: 4,
  cid: 1,
  name: "East"
}, {
  did: 5,
  cid: 1,
  name: "North"
}, {
  did: 6,
  cid: 1,
  name: "South"
}, {
  did: 7,
  cid: 1,
  name: "West"
}];
const DEFAULT_STADIUM_CAPACITY$2 = 70000;

const COMPOSITE_WEIGHTS = {
  playmaker: {
    ratings: ["stk", "pss", "oiq", "spd", "hgt", "stre"],
    weights: [1, 1, 1, 1, 0.25, 0.1],
    skill: {
      label: "Pm",
      cutoff: 0.57
    }
  },
  power: {
    ratings: ["stk", "stre", "chk", "hgt", "spd"],
    weights: [1, 1, 1, 0.25, 0.1],
    skill: {
      label: "Pw",
      cutoff: 0.47
    }
  },
  grinder: {
    ratings: ["blk", "chk", "diq", "hgt", "stre", "spd"],
    weights: [1, 1, 1, 0.25, 0.25, 0.1],
    skill: {
      label: "G",
      cutoff: 0.65
    }
  },
  enforcer: {
    ratings: ["stre", "chk", "hgt", "spd"],
    weights: [1, 1, 0.25, 0.1],
    skill: {
      label: "E",
      cutoff: 0.61
    }
  },
  sniper: {
    ratings: ["sst", "wst", "oiq"],
    weights: [1, 1, 0.25],
    skill: {
      label: "S",
      cutoff: 0.68
    }
  },
  faceoffs: {
    ratings: ["fcf"]
  },
  goalkeeping: {
    ratings: ["glk"]
  },
  blocking: {
    ratings: ["blk", "diq", "stre", "spd"],
    weights: [1, 1, 0.1, 0.1]
  },
  scoring: {
    ratings: ["sst", "wst", "stk", "oiq", "spd", "hgt", "stre"],
    weights: [1, 1, 0.5, 1, 1, 0.25, 0.1]
  },
  penalties: {
    ratings: [50, "chk", "diq"],
    weights: [1, 1, -0.5]
  },
  endurance: {
    ratings: [50, "endu"],
    weights: [1, 1]
  }
};
const PLAYER_GAME_STATS = {
  skaters: {
    name: "Skater",
    stats: ["g", "a", "pts", "pm", "pim", "s", "sPct", "hit", "blk", "gv", "tk", "fow", "fol", "foPct", "min", "ppMin", "shMin"],
    sortBy: ["min"]
  },
  goalies: {
    name: "Goalie",
    stats: ["ga", "sa", "sv", "svPct", "pim", "min", "ppMin", "shMin"],
    sortBy: ["min"]
  }
};
const PLAYER_SUMMARY = {
  summarySkater: {
    name: "SummarySkater",
    onlyShowIf: ["C", "W", "D"],
    stats: ["gpSkater", "g", "a", "pts", "pm", "ops", "dps", "ps"]
  },
  summaryGoalie: {
    name: "SummaryGoalie",
    onlyShowIf: ["G"],
    stats: ["gpGoalie", "gRec", "so", "gaa", "svPct", "gps"]
  }
};
const PLAYER_STATS_TABLES$1 = {
  goalie: {
    name: "Goalie",
    stats: ["gpGoalie", "gRec", "ga", "sa", "sv", "svPct", "gaa", "so", "min", "ppMin", "shMin", "pim"],
    onlyShowIf: ["sv"]
  },
  skater: {
    name: "Skater",
    stats: ["gpSkater", "g", "a", "pts", "pm", "pim", "evG", "ppG", "shG", "gwG", "evA", "ppA", "shA", "gwA", "s", "sPct", "tsa", "min", "ppMin", "shMin", "amin", "fow", "fol", "foPct", "blk", "hit", "tk", "gv"],
    onlyShowIf: ["pts", "tsa", "fow", "fol", "blk", "hit", "tk", "gv"]
  },
  advanced: {
    name: "Advanced",
    stats: ["gp", "gc", "ops", "dps", "gps", "ps"]
  },
  gameHighs: {
    name: "Game Highs",
    stats: ["gp", "gMax", "aMax", "pmMax", "pimMax", "evGMax", "ppGMax", "shGMax", "evAMax", "ppAMax", "shAMax", "sMax", "tsaMax", "minMax", "ppMinMax", "shMinMax", "fowMax", "folMax", "blkMax", "hitMax", "tkMax", "gvMax", "gaMax", "svMax"]
  }
};
const TEAM_STATS_TABLES$1 = {
  team: {
    name: "Team",
    stats: ["g", "a", "pim", "evG", "ppG", "shG", "evA", "ppA", "shA", "s", "sPct", "tsa", "ppo", "ppPct", "fow", "fol", "foPct", "blk", "hit", "tk", "gv", "sv", "svPct", "gaa", "so", "mov"]
  },
  opponent: {
    name: "Opponent",
    stats: ["oppG", "oppA", "oppPim", "oppEvG", "oppPpG", "oppShG", "oppEvA", "oppPpA", "oppShA", "oppS", "oppSPct", "oppTsa", "oppPpo", "oppPpPct", "oppFow", "oppFol", "oppFoPct", "oppBlk", "oppHit", "oppTk", "oppGv", "oppSv", "oppSvPct", "oppGaa", "oppSo", "oppMov"]
  }
};
const POSITIONS$1 = ["C", "W", "D", "G"];
const POSITION_COUNTS$1 = {
  C: 5,
  W: 10,
  D: 7,
  G: 3
};
const RATINGS$1 = ["hgt", "stre", "spd", "endu", "pss", "wst", "sst", "stk", "oiq", "chk", "blk", "fcf", "diq", "glk"];
const SIMPLE_AWARDS$1 = ["mvp", "dpoy", "dfoy", "goy", "roy", "finalsMvp"];
const AWARD_NAMES$1 = {
  mvp: "Most Valuable Player",
  roy: "Rookie of the Year",
  dpoy: "Defensive Player of the Year",
  dfoy: "Defensive Forward of the Year",
  goy: "Goalie of the Year",
  finalsMvp: "Playoffs MVP",
  allLeague: "All-League",
  allRookie: "All-Rookie Team"
};
const DEFAULT_CONFS$1 = [{
  cid: 0,
  name: "Eastern Conference"
}, {
  cid: 1,
  name: "Western Conference"
}];
const DEFAULT_DIVS$1 = [{
  did: 0,
  cid: 0,
  name: "Atlantic"
}, {
  did: 1,
  cid: 0,
  name: "Metropolitan"
}, {
  did: 2,
  cid: 1,
  name: "Central"
}, {
  did: 3,
  cid: 1,
  name: "Pacific"
}];
const DEFAULT_STADIUM_CAPACITY$1 = 17500;
const NUM_LINES = {
  F: 4,
  D: 3,
  G: 1
};

const ACCOUNT_API_URL = process.env.NODE_ENV === "development" ? "http://account.basketball-gm.test" : bySport({
  basketball: "https://account.basketball-gm.com",
  football: "https://account.football-gm.com",
  default: "https://account.zengm.com"
});
const DIFFICULTY = {
  Easy: -0.25,
  Normal: 0,
  Hard: 0.25,
  Insane: 1
};
bySport({
  baseball: true,
  basketball: false,
  football: true,
  hockey: true
});
const MAX_SUPPORTED_LEAGUE_VERSION = 52;
const NO_LOTTERY_DRAFT_TYPES = ["freeAgents", "noLottery", "noLotteryReverse", "random"];
const PHASE = {
  EXPANSION_DRAFT: -2,
  FANTASY_DRAFT: -1,
  PRESEASON: 0,
  REGULAR_SEASON: 1,
  AFTER_TRADE_DEADLINE: 2,
  PLAYOFFS: 3,
  DRAFT_LOTTERY: 4,
  DRAFT: 5,
  AFTER_DRAFT: 6,
  RESIGN_PLAYERS: 7,
  FREE_AGENCY: 8
};
const PLAYER = {
  FREE_AGENT: -1,
  UNDRAFTED: -2,
  RETIRED: -3,
  // Store current draft class here during fantasy draft
  UNDRAFTED_FANTASY_TEMP: -6,
  // Used for realStats when a team has been contracted
  DOES_NOT_EXIST: -7,
  // Used for summed up season stats for multiple teams
  TOT: -8,
  // THESE ARE OBSOLETE!
  UNDRAFTED_2: -4,
  // Next year's draft class
  UNDRAFTED_3: -5 // Next next year's draft class
};

const PHASE_TEXT = {
  "-2": "expansion draft",
  "-1": "fantasy draft",
  "0": "preseason",
  "1": "regular season",
  "2": "regular season",
  "3": "playoffs",
  "4": bySport({
    // Would be better to read from g.get("draftType")
    football: "before draft",
    default: "draft lottery"
  }),
  "5": "draft",
  "6": "after draft",
  "7": "re-sign players",
  "8": "free agency"
};
const STRIPE_PUBLISHABLE_KEY = process.env.NODE_ENV === "development" ? "pk_test_Qbz0froGmHLp0dPCwHoYFY08" : "pk_live_Dmo7Vs6uSaoYHrFngr4lM0sa";
bySport({
  baseball: COMPOSITE_WEIGHTS$3,
  basketball: COMPOSITE_WEIGHTS$2,
  football: COMPOSITE_WEIGHTS$1,
  hockey: COMPOSITE_WEIGHTS
});
bySport({
  baseball: PLAYER_GAME_STATS$3,
  basketball: PLAYER_GAME_STATS$2,
  football: PLAYER_GAME_STATS$1,
  hockey: PLAYER_GAME_STATS
});
bySport({
  baseball: PLAYER_SUMMARY$3,
  basketball: PLAYER_SUMMARY$2,
  football: PLAYER_SUMMARY$1,
  hockey: PLAYER_SUMMARY
});
const PLAYER_STATS_TABLES = bySport({
  baseball: PLAYER_STATS_TABLES$4,
  basketball: PLAYER_STATS_TABLES$3,
  football: PLAYER_STATS_TABLES$2,
  hockey: PLAYER_STATS_TABLES$1
});
const RATINGS = bySport({
  baseball: RATINGS$4,
  basketball: RATINGS$3,
  football: RATINGS$2,
  hockey: RATINGS$1
});
const POSITION_COUNTS = bySport({
  baseball: POSITION_COUNTS$4,
  basketball: POSITION_COUNTS$3,
  football: POSITION_COUNTS$2,
  hockey: POSITION_COUNTS$1
});
const POSITIONS = bySport({
  baseball: POSITIONS$4,
  basketball: POSITIONS$3,
  football: POSITIONS$2,
  hockey: POSITIONS$1
});
const TEAM_STATS_TABLES = bySport({
  baseball: TEAM_STATS_TABLES$4,
  basketball: TEAM_STATS_TABLES$3,
  football: TEAM_STATS_TABLES$2,
  hockey: TEAM_STATS_TABLES$1
});
const TIME_BETWEEN_GAMES = bySport({
  football: "week",
  default: "day"
});
const MOOD_TRAITS = {
  F: "Fame",
  L: "Loyalty",
  $: "Money",
  W: "Winning"
};
const SIMPLE_AWARDS = bySport({
  baseball: SIMPLE_AWARDS$4,
  basketball: SIMPLE_AWARDS$3,
  football: SIMPLE_AWARDS$2,
  hockey: SIMPLE_AWARDS$1
});
const AWARD_NAMES = bySport({
  baseball: AWARD_NAMES$4,
  basketball: AWARD_NAMES$3,
  football: AWARD_NAMES$2,
  hockey: AWARD_NAMES$1
});
const DEFAULT_CONFS = bySport({
  baseball: DEFAULT_CONFS$4,
  basketball: DEFAULT_CONFS$3,
  football: DEFAULT_CONFS$2,
  hockey: DEFAULT_CONFS$1
});
const DEFAULT_DIVS = bySport({
  baseball: DEFAULT_DIVS$4,
  basketball: DEFAULT_DIVS$3,
  football: DEFAULT_DIVS$2,
  hockey: DEFAULT_DIVS$1
});
const DEFAULT_STADIUM_CAPACITY = bySport({
  baseball: DEFAULT_STADIUM_CAPACITY$4,
  basketball: DEFAULT_STADIUM_CAPACITY$3,
  football: DEFAULT_STADIUM_CAPACITY$2,
  hockey: DEFAULT_STADIUM_CAPACITY$1
});
const COURT = bySport({
  baseball: "field",
  basketball: "court",
  football: "field",
  hockey: "ice"
});
const EMAIL_ADDRESS = "jeremy@zengm.com";
const GAME_ACRONYM = bySport({
  baseball: "ZGMB",
  basketball: "BBGM",
  football: "FBGM",
  hockey: "ZGMH"
});
const GAME_NAME = bySport({
  baseball: "ZenGM Baseball",
  basketball: "Basketball GM",
  football: "Football GM",
  hockey: "ZenGM Hockey"
});
const SUBREDDIT_NAME = bySport({
  baseball: "ZenGMBaseball",
  basketball: "BasketballGM",
  football: "Football_GM",
  hockey: "ZenGMHockey"
});
const TWITTER_HANDLE = bySport({
  basketball: "basketball_gm",
  football: "FootballGM_Game",
  default: "ZenGMGames"
});
bySport({
  basketball: "basketball.general.manager",
  football: "football.general.manager",
  default: "ZenGMGames"
});
const SPORT_HAS_REAL_PLAYERS = bySport({
  baseball: false,
  basketball: true,
  football: false,
  hockey: false
});
const SPORT_HAS_LEGENDS = bySport({
  baseball: false,
  basketball: true,
  football: false,
  hockey: false
});
const WEBSITE_PLAY = bySport({
  baseball: "baseball.zengm.com",
  basketball: "play.basketball-gm.com",
  football: "play.football-gm.com",
  hockey: "hockey.zengm.com"
});
const WEBSITE_ROOT = bySport({
  baseball: "zengm.com/baseball",
  basketball: "basketball-gm.com",
  football: "football-gm.com",
  hockey: "zengm.com/hockey"
});

// For subscribers who have not renewed yet, give them a 3 day grace period before showing ads again, because sometimes it takes a little extra tim for the payment to process
const GRACE_PERIOD = 60 * 60 * 24 * 3;
const TIEBREAKERS = {
  commonOpponentsRecord: "Common opponents record",
  confRecordIfSame: "Conference record (same conf)",
  divRecordIfSame: "Division record (same div)",
  divWinner: "Division winner",
  headToHeadRecord: "Head-to-head record",
  marginOfVictory: "Margin of victory",
  strengthOfVictory: "Strength of victory",
  strengthOfSchedule: "Strength of schedule",
  coinFlip: "Coin flip"
};

// This is only applied by default in hockey, but it's still used in all sports if "pts" are explicitly requested and there is no formula set
const DEFAULT_POINTS_FORMULA = "2*W+OTL+T";
const AD_DIVS = bySport({
  basketball: {
    mobile: "basketball-gm_mobile_leaderboard",
    leaderboard: "basketball-gm_leaderboard_atf",
    rectangle1: "basketball-gm_mrec_btf_1",
    rectangle2: "basketball-gm_mrec_btf_2",
    rail: "basketball-gm_right_rail"
  },
  football: {
    mobile: "football-gm_mobile_leaderboard",
    leaderboard: "football-gm_leaderboard_atf",
    rectangle1: "football-gm_mrec_btf_1",
    rectangle2: "football-gm_mrec_btf_2",
    rail: "football-gm_right_rail"
  },
  default: {
    mobile: "zen-gm_mobile_leaderboard",
    leaderboard: "zen-gm_leaderboard_atf",
    rectangle1: "zen-gm_mrec_btf_1",
    rectangle2: "zen-gm_mrec_btf_2",
    rail: "zen-gm_right_rail"
  }
});
const DEFAULT_JERSEY = bySport({
  baseball: "baseball2:hat2",
  basketball: "jersey3",
  football: "football",
  hockey: "hockey"
});
const JERSEYS = bySport({
  baseball: {
    "baseball:hat": "Solid jersey, solid hat",
    "baseball:hat2": "Solid jersey, brim hat",
    "baseball:hat3": "Solid jersey, multi hat",
    "baseball2:hat": "Accent jersey, solid hat",
    "baseball2:hat2": "Accent jersey, brim hat",
    "baseball2:hat3": "Accent jersey, multi hat",
    "baseball3:hat": "Pinstripe jersey, solid hat",
    "baseball3:hat2": "Pinstripe jersey, brim hat",
    "baseball3:hat3": "Pinstripe jersey, multi hat",
    "baseball4:hat": "Secondary jersey, solid hat",
    "baseball4:hat2": "Secondary jersey, brim hat",
    "baseball4:hat3": "Secondary jersey, multi hat"
  },
  basketball: {
    jersey: "Plain",
    jersey2: "Bordered",
    jersey4: "Bordered 2",
    jersey3: "Solid horizontal",
    jersey5: "Pinstripes"
  },
  football: {
    football: "Default",
    football2: "Shoulder flair",
    football5: "Shoulder flair 2",
    football3: "Shoulder stripes",
    football4: "Low flair"
  },
  hockey: {
    hockey: "Stripe",
    hockey3: "Stripe 2",
    hockey4: "Stripe 3",
    hockey2: "Plain"
  }
});

// Target: 90% in playThroughInjuriesFactor
bySport({
  baseball: [0, 4],
  basketball: [0, 4],
  football: [0, 2],
  hockey: [0, 4]
});
const DAILY_SCHEDULE = `${TIME_BETWEEN_GAMES === "week" ? "Weekly" : "Daily"} Schedule`;

// Basketball has other events, but other sports are just a game
bySport({
  baseball: true,
  basketball: false,
  football: true,
  hockey: true
});
const DEFAULT_PHASE_CHANGE_REDIRECTS = [1, 3, 4, 5, 7, 8];
const EXHIBITION_GAME_SETTINGS = ["ties", "dh", "numPlayersOnCourt", "foulsNeededToFoulOut", "numPlayersOnCourt", "quarterLength", "numPeriods", "pace", "homeCourtAdvantage", "elam", "elamMinutes", "elamOvertime", "elamPoints", "foulsUntilBonus", "turnoverFactor", "stealFactor", "threePointTendencyFactor", "threePointAccuracyFactor", "twoPointAccuracyFactor", "foulRateFactor", "threePointers", "blockFactor", "threePointers", "orbFactor", "injuryRate", "assistFactor", "foulFactor", "groundFactor", "lineFactor", "flyFactor", "powerFactor", "stealFactor", "throwOutFactor", "strikeFactor", "balkFactor", "wildPitchFactor", "passedBallFactor", "hitByPitchFactor", "swingFactor", "contactFactor", "hitFactor", "fantasyPoints", "passFactor", "rushYdsFactor", "passYdsFactor", "completionFactor", "scrambleFactor", "sackFactor", "fumbleFactor", "intFactor", "fgAccuracyFactor", "fourthDownFactor", "onsideFactor", "onsideRecoveryFactor", "giveawayFactor", "takeawayFactor", "blockFactor", "deflectionFactor", "saveFactor"];

const isSport = sport => {
  return sport === process.env.SPORT;
};

const wrap = value => [{
  start: -Infinity,
  value
}];

// gameAttributes is mixed up between league settings, game state, teams, and cache
const gameAttributesKeysGameState = ["phase", "nextPhase", "gameOver", "godMode", "godModeInPast", "otherTeamsWantToHire", "lowestDifficulty", "difficulty", "gracePeriodEnd", "lid", "userTid", "userTids", "season", "startingSeason", "numDraftPicksCurrent"];
const gameAttributesKeysTeams = ["confs", "divs"];
const gameAttributesCache = ["numTeams", "numActiveTeams", "teamInfoCache"];
const gameAttributesKeysSportSpecific = {
  baseball: ["dh", "foulFactor", "groundFactor", "lineFactor", "flyFactor", "powerFactor", "stealFactor", "throwOutFactor", "strikeFactor", "balkFactor", "wildPitchFactor", "passedBallFactor", "hitByPitchFactor", "swingFactor", "contactFactor", "hitFactor"],
  basketball: ["threePointers", "threePointTendencyFactor", "threePointAccuracyFactor", "twoPointAccuracyFactor", "blockFactor", "stealFactor", "turnoverFactor", "orbFactor", "assistFactor", "realPlayerDeterminism", "foulRateFactor", "foulsNeededToFoulOut", "foulsUntilBonus", "elam", "elamASG", "elamMinutes", "elamOvertime", "elamPoints", "randomDebutsForever", "realDraftRatings", "numPlayersDunk", "numPlayersThree", "quarterLength", "ties", "numPlayersOnCourt", "pace"],
  football: ["fantasyPoints", "foulRateFactor", "quarterLength", "ties", "passFactor", "rushYdsFactor", "passYdsFactor", "completionFactor", "scrambleFactor", "sackFactor", "fumbleFactor", "intFactor", "fgAccuracyFactor", "fourthDownFactor", "onsideFactor", "onsideRecoveryFactor", "pace"],
  hockey: ["quarterLength", "ties", "hitFactor", "giveawayFactor", "takeawayFactor", "blockFactor", "deflectionFactor", "saveFactor", "assistFactor", "pace"]
};
const gameAttributesKeysOtherSports = new Set();
for (const [sport, keys] of Object.entries(gameAttributesKeysSportSpecific)) {
  if (sport !== process.env.SPORT) {
    for (const key of keys) {
      if (!gameAttributesKeysSportSpecific[process.env.SPORT].includes(key)) {
        gameAttributesKeysOtherSports.add(key);
      }
    }
  }
}
const defaultGameAttributes = {
  phase: 0,
  nextPhase: undefined,
  // Used only for fantasy draft
  playerBioInfo: undefined,
  injuries: undefined,
  tragicDeaths: undefined,
  daysLeft: 0,
  // Used only for free agency
  gameOver: false,
  godMode: false,
  godModeInPast: false,
  salaryCap: 125000,
  // [thousands of dollars]
  minPayroll: 80000,
  // [thousands of dollars]
  luxuryPayroll: 140000,
  // [thousands of dollars]
  luxuryTax: 1.5,
  minContract: 1000,
  // [thousands of dollars]
  maxContract: 42000,
  // [thousands of dollars]
  minContractLength: 1,
  maxContractLength: 5,
  minRosterSize: 10,
  maxRosterSize: 15,
  softCapTradeSalaryMatch: 125,
  numGames: 82,
  // per season
  numGamesDiv: 16,
  numGamesConf: 36,
  otherTeamsWantToHire: false,
  numPeriods: 4,
  // per game
  quarterLength: 12,
  // [minutes]
  confs: wrap(DEFAULT_CONFS),
  divs: wrap(DEFAULT_DIVS),
  numGamesPlayoffSeries: wrap([7, 7, 7, 7]),
  numPlayoffByes: wrap(0),
  aiTradesFactor: 1,
  autoDeleteOldBoxScores: true,
  stopOnInjury: false,
  stopOnInjuryGames: 20,
  // According to data/injuries.ods, 0.25 injuries occur every game. Divided over 10 players and ~200 possessions, that means each player on the court has P = 0.25 / 10 / 200 = 0.000125 probability of being injured this play.
  injuryRate: 0.25 / 10 / 200,
  homeCourtAdvantage: 1,
  // The tragic death rate is the probability that a player will die a tragic death on a given regular season day. Yes, this only happens in the regular season. With roughly 100 days in a season, the default is about one death every 50 years.
  tragicDeathRate: 1 / (100 * 50),
  // The probability that a new player will be the son or brother of an existing player. In practice, the observed number may be smaller than this because sometimes a valid match will not be found.
  sonRate: 0.02,
  brotherRate: 0.02,
  forceRetireAge: 0,
  salaryCapType: "soft",
  // This enables ties in the UI and game data saving, but GameSim still needs to actually return ties. In other words... you can't just enable this for basketball and have ties happen in basketball!
  ties: wrap(false),
  otl: wrap(false),
  draftType: "nba2019",
  draftLotteryCustomChances: [140, 140, 140, 125, 105, 90, 75, 60, 45, 30, 20, 15, 10, 5],
  draftLotteryCustomNumPicks: 4,
  numDraftRounds: 2,
  draftAges: [19, 22],
  defaultStadiumCapacity: DEFAULT_STADIUM_CAPACITY,
  playersRefuseToNegotiate: true,
  allStarGame: 0.7,
  allStarNum: 12,
  allStarType: "draft",
  budget: true,
  numSeasonsFutureDraftPicks: 4,
  foulRateFactor: 1,
  foulsNeededToFoulOut: 6,
  foulsUntilBonus: [5, 4, 2],
  rookieContractLengths: [3, 2],
  rookiesCanRefuse: true,
  pace: 100,
  threePointers: true,
  threePointTendencyFactor: 1,
  threePointAccuracyFactor: 1,
  twoPointAccuracyFactor: 1,
  blockFactor: 1,
  stealFactor: 1,
  turnoverFactor: 1,
  orbFactor: 1,
  expansionDraft: {
    phase: "setup"
  },
  challengeNoDraftPicks: false,
  challengeNoFreeAgents: false,
  challengeNoRatings: false,
  challengeNoTrades: false,
  challengeLoseBestPlayer: false,
  challengeFiredLuxuryTax: false,
  challengeFiredMissPlayoffs: false,
  challengeThanosMode: false,
  thanosCooldownEnd: undefined,
  repeatSeason: undefined,
  equalizeRegions: false,
  realPlayerDeterminism: 0,
  spectator: false,
  elam: false,
  elamASG: true,
  elamMinutes: 4,
  elamOvertime: false,
  elamPoints: 8,
  playerMoodTraits: true,
  numPlayersOnCourt: 5,
  aiJerseyRetirement: true,
  tiebreakers: wrap(["headToHeadRecord", "divWinner", "divRecordIfSame", "confRecordIfSame", "marginOfVictory", "coinFlip"]),
  hofFactor: 1,
  tradeDeadline: 0.6,
  pointsFormula: wrap(""),
  randomDebutsForever: undefined,
  realDraftRatings: undefined,
  hideDisabledTeams: false,
  goatFormula: undefined,
  inflationAvg: 0,
  inflationMax: 0,
  inflationMin: 0,
  inflationStd: 0,
  riggedLottery: undefined,
  numDraftPicksCurrent: undefined,
  playoffsByConf: true,
  playoffsNumTeamsDiv: wrap(0),
  playoffsReseed: false,
  playIn: true,
  numPlayersDunk: 4,
  numPlayersThree: 8,
  draftPickAutoContract: true,
  draftPickAutoContractPercent: 25,
  draftPickAutoContractRounds: 1,
  dh: "all",
  // These will always be overwritten when creating a league, just here for TypeScript
  lid: 0,
  userTid: [{
    start: -Infinity,
    value: 0
  }],
  userTids: [0],
  season: 0,
  startingSeason: 0,
  teamInfoCache: [],
  gracePeriodEnd: 0,
  numTeams: 0,
  numActiveTeams: 0,
  difficulty: 0,
  // See constants.DIFFICULTY for values
  lowestDifficulty: 0,
  fantasyPoints: undefined,
  // These are only for FBGM, but for TypeScript define them here
  passFactor: 1,
  rushYdsFactor: 1,
  passYdsFactor: 1,
  completionFactor: 1,
  scrambleFactor: 1,
  sackFactor: 1,
  fumbleFactor: 1,
  intFactor: 1,
  fgAccuracyFactor: 1,
  fourthDownFactor: 1,
  onsideFactor: 1,
  onsideRecoveryFactor: 1,
  // These are only for ZGMH, but for TypeScript define them here
  hitFactor: 1,
  giveawayFactor: 1,
  takeawayFactor: 1,
  deflectionFactor: 1,
  saveFactor: 1,
  assistFactor: 1,
  // These are only for ZGMB, but for TypeScript define them here
  foulFactor: 1,
  groundFactor: 1,
  lineFactor: 1,
  flyFactor: 1,
  powerFactor: 1,
  throwOutFactor: 1,
  strikeFactor: 1,
  balkFactor: 1,
  wildPitchFactor: 1,
  passedBallFactor: 1,
  hitByPitchFactor: 1,
  swingFactor: 1,
  contactFactor: 1
};

// Extra condition for NODE_ENV is because we use this export only in tests, so we don't want it in the basketball bundle!
const footballOverrides = process.env.NODE_ENV === "test" || isSport("football") ? {
  numGames: 17,
  numGamesDiv: 6,
  numGamesConf: 6,
  quarterLength: 15,
  numGamesPlayoffSeries: wrap([1, 1, 1, 1]),
  numPlayoffByes: wrap(2),
  stopOnInjuryGames: 1,
  salaryCapType: "hard",
  ties: wrap(true),
  draftType: "noLottery",
  numDraftRounds: 7,
  draftAges: [21, 22],
  salaryCap: 200000,
  minPayroll: 150000,
  luxuryPayroll: 250000,
  minContract: 500,
  maxContract: 30000,
  minRosterSize: 40,
  maxRosterSize: 55,
  // Arbitrary - 2 injuries per game. Divide over 1000 plays
  injuryRate: 2 / 1000,
  // The tragic death rate is the probability that a player will die a tragic death on a given regular season day. Yes, this only happens in the regular season. With roughly 20 days in a season, the default is about one death every 50 years.
  tragicDeathRate: 1 / (20 * 50),
  sonRate: 0.005,
  brotherRate: 0.005,
  allStarGame: -1,
  allStarNum: 44,
  allStarType: "byConf",
  numPlayersOnCourt: 11,
  tiebreakers: wrap(["headToHeadRecord", "divRecordIfSame", "commonOpponentsRecord", "confRecordIfSame", "strengthOfVictory", "strengthOfSchedule", "marginOfVictory", "coinFlip"]),
  playoffsReseed: true,
  playoffsNumTeamsDiv: wrap(1),
  playIn: false,
  fantasyPoints: "standard",
  draftPickAutoContract: false,
  pace: 1
} : {};
const hockeyOverrides = process.env.NODE_ENV === "test" || isSport("hockey") ? {
  numGamesDiv: 26,
  numGamesConf: 24,
  quarterLength: 20,
  numPeriods: 3,
  salaryCapType: "hard",
  salaryCap: 80000,
  minPayroll: 60000,
  luxuryPayroll: 90000,
  minContract: 500,
  maxContract: 13000,
  minRosterSize: 24,
  maxRosterSize: 26,
  // Injury rate per player per possession, basically. But it's a little more complicated than that.
  injuryRate: 1 / 10000,
  draftType: "nhl2021",
  numDraftRounds: 4,
  draftAges: [18, 21],
  allStarNum: 20,
  allStarType: "byConf",
  numPlayersOnCourt: 6,
  otl: wrap(true),
  pointsFormula: wrap(DEFAULT_POINTS_FORMULA),
  playoffsNumTeamsDiv: wrap(3),
  playIn: false,
  draftPickAutoContractPercent: 10,
  draftPickAutoContractRounds: 2,
  rookieContractLengths: [3],
  pace: 1
} : {};

// Extra condition for NODE_ENV is because we use this export only in tests, so we don't want it in the basketball bundle!
const baseballOverrides = process.env.NODE_ENV === "test" || isSport("baseball") ? {
  numGames: 162,
  numGamesDiv: 76,
  numGamesConf: null,
  numGamesPlayoffSeries: wrap([3, 5, 7, 7]),
  numPlayoffByes: wrap(4),
  numPeriods: 9,
  salaryCapType: "none",
  draftType: "mlb2022",
  numDraftRounds: 5,
  draftAges: [18, 22],
  salaryCap: 175000,
  minPayroll: 150000,
  luxuryPayroll: 200000,
  minContract: 500,
  maxContract: 30000,
  minRosterSize: 35,
  maxRosterSize: 40,
  // Arbitrary, spread over 40 plate appearances per game
  injuryRate: 0.018 / 40,
  // 200 days per season, 1 tragic death per 50 years
  tragicDeathRate: 1 / (200 * 50),
  allStarNum: 24,
  allStarType: "byConf",
  numPlayersOnCourt: 9,
  playoffsNumTeamsDiv: wrap(1),
  playIn: false,
  draftPickAutoContractPercent: 20,
  draftPickAutoContractRounds: 4,
  draftPickAutoContract: false
} : {};
if (isSport("football")) {
  Object.assign(defaultGameAttributes, footballOverrides);
} else if (isSport("hockey")) {
  Object.assign(defaultGameAttributes, hockeyOverrides);
} else if (isSport("baseball")) {
  Object.assign(defaultGameAttributes, baseballOverrides);
}

const teamInfos = {
  ABQ: {
    region: "Albuquerque",
    name: "Thunderbirds",
    pop: 0.9,
    colors: ["#ffd404", "#c80c2c", "#000000"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football2",
      hockey: "hockey3"
    })
  },
  ANC: {
    region: "Anchorage",
    name: "Glaciers",
    pop: 0.4,
    colors: ["#3bd0e8", "#f96b09", "#fabf09"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football4",
      hockey: "hockey"
    })
  },
  ATL: {
    region: "Atlanta",
    name: "Gold Club",
    pop: 5.3,
    colors: ["#5c4a99", "#f0e81c", "#211e1e"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football2",
      hockey: "hockey3"
    })
  },
  BAL: {
    region: "Baltimore",
    name: "Crabs",
    pop: 2.7,
    colors: ["#89bfd3", "#7a1319", "#07364f"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football3",
      hockey: "hockey"
    })
  },
  BOS: {
    region: "Boston",
    name: "Massacre",
    pop: 7.3,
    colors: ["#0d435e", "#f0494a", "#cccccc"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey5",
      football: "football3",
      hockey: "hockey3"
    })
  },
  BKN: {
    region: "Brooklyn",
    name: "Bagels",
    pop: 21.5,
    colors: ["#034757", "#67c7e9", "#b78254"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football5",
      hockey: "hockey3"
    })
  },
  CHA: {
    region: "Charlotte",
    name: "Queens",
    pop: 1.5,
    colors: ["#009e87", "#541f3e", "#ffffff"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey3",
      football: "football3",
      hockey: "hockey4"
    })
  },
  CIN: {
    region: "Cincinnati",
    name: "Riots",
    pop: 1.6,
    colors: ["#000000", "#c11616", "#2966ef"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football2",
      hockey: "hockey4"
    })
  },
  CLE: {
    region: "Cleveland",
    name: "Curses",
    pop: 1.7,
    colors: ["#211e1e", "#f8e3cc", "#3f1c59"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football3",
      hockey: "hockey4"
    })
  },
  DAL: {
    region: "Dallas",
    name: "Snipers",
    pop: 6.6,
    colors: ["#be2026", "#2b2e81", "#ffffff"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey3",
      football: "football3",
      hockey: "hockey3"
    })
  },
  DEN: {
    region: "Denver",
    name: "High",
    pop: 2.7,
    colors: ["#2b8643", "#163a1c", "#a1d297"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey3",
      football: "football",
      hockey: "hockey"
    })
  },
  DET: {
    region: "Detroit",
    name: "Muscle",
    pop: 4.0,
    colors: ["#3a61b6", "#9eb7e6", "#0a1130"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football3",
      hockey: "hockey3"
    })
  },
  HOU: {
    region: "Houston",
    name: "Apollos",
    pop: 6.2,
    colors: ["#4c91c2", "#c4c4c3", "#ffffff"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey3"
    })
  },
  IND: {
    region: "Indianapolis",
    name: "Crossroads",
    pop: 1.6,
    colors: ["#e79f02", "#00246d", "#ffffff"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football5",
      hockey: "hockey3"
    })
  },
  KC: {
    region: "Kansas City",
    name: "Sauce",
    pop: 1.6,
    colors: ["#8f2100", "#ffb500", "#d4731c"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey4"
    })
  },
  LA: {
    region: "Los Angeles",
    name: "Lowriders",
    pop: 15.6,
    colors: ["#00008b", "#ffaf28", "#ff24ee"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football2",
      hockey: "hockey4"
    })
  },
  LAE: {
    region: "Los Angeles",
    name: "Earthquakes",
    pop: 15.6,
    colors: ["#aeaeae", "#ea4b0f", "#dedddd"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey3",
      football: "football5",
      hockey: "hockey3"
    })
  },
  LV: {
    region: "Las Vegas",
    name: "Blue Chips",
    pop: 2.1,
    colors: ["#1c73bb", "#ffd600", "#0c5983"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football5",
      hockey: "hockey3"
    })
  },
  MEM: {
    region: "Memphis",
    name: "Blues",
    pop: 1.3,
    colors: ["#000000", "#ff6c49", "#00aedc"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football5",
      hockey: "hockey4"
    })
  },
  MIA: {
    region: "Miami",
    name: "Cyclones",
    pop: 6.1,
    colors: ["#4ac1c0", "#d8519d", "#f15949"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey4"
    })
  },
  MIL: {
    region: "Milwaukee",
    name: "Cheesemakers",
    pop: 1.5,
    colors: ["#003600", "#fdc05f", "#007800"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football5",
      hockey: "hockey4"
    })
  },
  MIN: {
    region: "Minneapolis",
    name: "Blizzard",
    pop: 2.8,
    colors: ["#8accdc", "#3d2971", "#ed9a22"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football4",
      hockey: "hockey"
    })
  },
  MXC: {
    region: "Mexico City",
    name: "Aztecs",
    pop: 20.5,
    colors: ["#1a9190", "#510f0f", "#eb5924"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football",
      hockey: "hockey3"
    })
  },
  NOL: {
    region: "New Orleans",
    name: "Bayou",
    pop: 1.1,
    colors: ["#195869", "#4edd61", "#0e3e33"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football4",
      hockey: "hockey4"
    })
  },
  NYC: {
    region: "New York",
    name: "Bankers",
    pop: 21.5,
    colors: ["#1e73ba", "#ff8500", "#ffffff"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey5",
      football: "football3",
      hockey: "hockey3"
    })
  },
  OAK: {
    region: "Oakland",
    name: "Blue Oaks",
    pop: 0.5,
    colors: ["#316bac", "#dddddd", "#111111"],
    jersey: bySport({
      baseball: "baseball:hat3",
      basketball: "jersey3",
      football: "football3",
      hockey: "hockey4"
    })
  },
  OKC: {
    region: "Oklahoma City",
    name: "66ers",
    pop: 1.4,
    colors: ["#610000", "#bbb29e", "#e4dfcf"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey3",
      football: "football4",
      hockey: "hockey"
    })
  },
  ORL: {
    region: "Orlando",
    name: "Juice",
    pop: 2.2,
    colors: ["#dc5000", "#ffffff", "#0b7648"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football3",
      hockey: "hockey4"
    })
  },
  PHI: {
    region: "Philadelphia",
    name: "Cheesesteaks",
    pop: 5.5,
    colors: ["#46bae6", "#ffdb33", "#d9771f"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football5",
      hockey: "hockey3"
    })
  },
  PHO: {
    region: "Phoenix",
    name: "Vultures",
    pop: 4.3,
    colors: ["#d17d2a", "#231f20", "#c09867"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey4"
    })
  },
  PIT: {
    region: "Pittsburgh",
    name: "Rivers",
    pop: 1.7,
    colors: ["#231f20", "#fbee28", "#fbee26"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey4"
    })
  },
  POR: {
    region: "Portland",
    name: "Roses",
    pop: 2.0,
    colors: ["#e41d34", "#1e1e1e", "#e7a9cc"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football5",
      hockey: "hockey3"
    })
  },
  SA: {
    region: "San Antonio",
    name: "Churros",
    pop: 2.0,
    colors: ["#4a2b14", "#30d9ff", "#704723"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey4"
    })
  },
  SAC: {
    region: "Sacramento",
    name: "Gold Rush",
    pop: 1.8,
    colors: ["#735823", "#e4c649", "#f8e19f"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football5",
      hockey: "hockey"
    })
  },
  SD: {
    region: "San Diego",
    name: "Pandas",
    pop: 4.7,
    colors: ["#231f20", "#ffffff", "#b2b3b3"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey5",
      football: "football4",
      hockey: "hockey4"
    })
  },
  TPA: {
    region: "Tampa",
    name: "Turtles",
    pop: 2.7,
    colors: ["#023a02", "#17cc21", "#eb851e"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey"
    })
  },
  UTA: {
    region: "Utah",
    name: "Missionaries",
    pop: 2.3,
    colors: ["#7c7c7c", "#000000", "#aea57a"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football3",
      hockey: "hockey3"
    })
  },
  VAN: {
    region: "Vancouver",
    name: "Whalers",
    pop: 2.3,
    colors: ["#213063", "#1ea194", "#117568"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey5",
      football: "football2",
      hockey: "hockey4"
    })
  },
  WAS: {
    region: "Washington",
    name: "Monuments",
    pop: 6.2,
    colors: ["#213063", "#c5ae6e", "#ffffff"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey3",
      football: "football3",
      hockey: "hockey3"
    })
  },
  // 2021-05-16 - new teams

  AUS: {
    region: "Austin",
    name: "Armadillos",
    pop: 1.7,
    colors: ["#270b51", "#dedfdf", "#ae5717"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey"
    })
  },
  BUF: {
    region: "Buffalo",
    name: "Wings",
    pop: 1.1,
    colors: ["#07295c", "#f16229", "#d13522"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football5",
      hockey: "hockey"
    })
  },
  HAW: {
    region: "Hawaii",
    name: "Honu",
    pop: 1,
    colors: ["#21655a", "#e5e1af", "#279c89"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football",
      hockey: "hockey3"
    })
  },
  JAX: {
    region: "Jacksonville",
    name: "Gators",
    pop: 1.5,
    colors: ["#24d021", "#3281cc", "#29354b"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football2",
      hockey: "hockey3"
    })
  },
  OTT: {
    region: "Ottawa",
    name: "Spiders",
    pop: 1.5,
    colors: ["#000000", "#ffffff", "#d10600"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football3",
      hockey: "hockey"
    })
  },
  QUE: {
    region: "Quebec",
    name: "Voyageurs",
    pop: 0.8,
    colors: ["#00529f", "#eeb210", "#7b2c18"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football2",
      hockey: "hockey3"
    })
  },
  SF: {
    region: "San Francisco",
    name: "Unicorns",
    pop: 6.5,
    colors: ["#676ee7", "#48edfe", "#fe696e"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey3",
      football: "football2",
      hockey: "hockey3"
    })
  },
  TOR: {
    region: "Toronto",
    name: "Raccoons",
    pop: 6.6,
    colors: ["#841222", "#ffffff", "#000000"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football2",
      hockey: "hockey4"
    })
  },
  VB: {
    region: "Virginia Beach",
    name: "Colonists",
    pop: 1.7,
    colors: ["#88bccd", "#c7741b", "#99442e"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey3",
      football: "football2",
      hockey: "hockey"
    })
  },
  // 2021-05-16 - relocated

  CGY: {
    region: "Calgary",
    name: "Mounties",
    pop: 1.4,
    colors: ["#ed1d3d", "#eac494", "#f2b316"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football2",
      hockey: "hockey4"
    })
  },
  MON: {
    region: "Montreal",
    name: "Beavers",
    pop: 4,
    colors: ["#5b352a", "#ffffff", "#967fc0"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey2",
      football: "football3",
      hockey: "hockey"
    })
  },
  SJ: {
    region: "San Jose",
    name: "Venture Capitalists",
    pop: 6.5,
    colors: ["#0e442e", "#d75f27", "#e7d3ae"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey3",
      football: "football3",
      hockey: "hockey3"
    })
  },
  // 2021-05-16 - rebranded

  CHI: {
    region: "Chicago",
    name: "Whirlwinds",
    pop: 9.1,
    colors: ["#272b2a", "#84d5f4", "#84d5f4"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey4"
    })
  },
  SEA: {
    region: "Seattle",
    name: "Symphony",
    pop: 3.8,
    colors: ["#47ff47", "#112e5b", "#8f8f8f"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey3"
    })
  },
  STL: {
    region: "St. Louis",
    name: "Spirits",
    pop: 2.2,
    colors: ["#5385ed", "#363736", "#fe18fd"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey"
    })
  },
  // 2022-09-16 - new teams

  BEI: {
    region: "Beijing",
    name: "Celestials",
    pop: 22.4,
    colors: ["#381968", "#ffffff", "#6da8b5"],
    jersey: bySport({
      baseball: "baseball4:hat",
      basketball: "jersey2",
      football: "football2",
      hockey: "hockey3"
    })
  },
  EDM: {
    region: "Edmonton",
    name: "River Rats",
    pop: 1.3,
    colors: ["#81cdea", "#1a66d6", "#efc997"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey5",
      football: "football3",
      hockey: "hockey4"
    })
  },
  LON: {
    region: "London",
    name: "Monarchs",
    pop: 14.3,
    colors: ["#10143d", "#ffffff", "#c9202a"],
    jersey: bySport({
      baseball: "baseball:hat3",
      basketball: "jersey2",
      football: "football4",
      hockey: "hockey"
    })
  },
  MLB: {
    region: "Melbourne",
    name: "Convicts",
    pop: 5,
    colors: ["#ffe468", "#1d2605", "#f65e00"],
    jersey: bySport({
      baseball: "baseball4:hat",
      basketball: "jersey3",
      football: "football5",
      hockey: "hockey4"
    })
  },
  MNL: {
    region: "Manila",
    name: "Monkey-Eating Eagles",
    pop: 13.5,
    colors: ["#351a06", "#ffb600", "#ddc194"],
    jersey: bySport({
      baseball: "baseball2:hat2",
      basketball: "jersey4",
      football: "football2",
      hockey: "hockey3"
    })
  },
  NJ: {
    region: "New Jersey",
    name: "Swamp Dragons",
    pop: 4.6,
    // Sum of counties around Newark
    colors: ["#23c3be", "#9436c6", "#ea4242"],
    jersey: bySport({
      baseball: "baseball3:hat3",
      basketball: "jersey5",
      football: "football3",
      hockey: "hockey2"
    })
  },
  PAR: {
    region: "Paris",
    name: "Pigeons",
    pop: 11.1,
    colors: ["#474754", "#4a997c", "#b18d7f"],
    jersey: bySport({
      baseball: "baseball4:hat",
      basketball: "jersey2",
      football: "football4",
      hockey: "hockey3"
    })
  },
  RIO: {
    region: "Rio de Janeiro",
    name: "Capybaras",
    pop: 12.3,
    colors: ["#f9c922", "#40b265", "#e28e13"],
    jersey: bySport({
      baseball: "baseball3:hat2",
      basketball: "jersey2",
      football: "football5",
      hockey: "hockey4"
    })
  },
  TOK: {
    region: "Tokyo",
    name: "Kaiju",
    pop: 37.3,
    colors: ["#ffffff", "#e23122", "#000000"],
    jersey: bySport({
      baseball: "baseball2:hat3",
      basketball: "jersey",
      football: "football2",
      hockey: "hockey2"
    })
  },
  WPG: {
    region: "Winnipeg",
    name: "Warhawks",
    pop: 0.8,
    colors: ["#122075", "#b3bfc8", "#475584"],
    jersey: bySport({
      baseball: "baseball:hat",
      basketball: "jersey5",
      football: "football3",
      hockey: "hockey"
    })
  }
};

const gp = isSport("hockey") ? "GP" : "G";
const sportSpecificCols = bySport({
  baseball: {
    "pos:SP": {
      desc: "Starting Pitcher",
      sortType: "number",
      title: "SP"
    },
    "pos:RP": {
      desc: "Relief Pitcher",
      sortType: "number",
      title: "RP"
    },
    "pos:C": {
      desc: "Catcher",
      sortType: "number",
      title: "C"
    },
    "pos:1B": {
      desc: "First Baseman",
      sortType: "number",
      title: "1B"
    },
    "pos:2B": {
      desc: "Second Baseman",
      sortType: "number",
      title: "2B"
    },
    "pos:3B": {
      desc: "Third Baseman",
      sortType: "number",
      title: "3B"
    },
    "pos:SS": {
      desc: "Shortstop",
      sortType: "number",
      title: "SS"
    },
    "pos:LF": {
      desc: "Left Fielder",
      sortType: "number",
      title: "LF"
    },
    "pos:CF": {
      desc: "Center Fielder",
      sortType: "number",
      title: "CF"
    },
    "pos:RF": {
      desc: "Right Fielder",
      sortType: "number",
      title: "RF"
    },
    "rating:hpw": {
      desc: "Hitting Power",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Hpw"
    },
    "rating:con": {
      desc: "Contact",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Con"
    },
    "rating:eye": {
      desc: "Eye",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Eye"
    },
    "rating:gnd": {
      desc: "Ground Ball Fielding",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Gnd"
    },
    "rating:fly": {
      desc: "Fly Ball Fielding",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Fly"
    },
    "rating:thr": {
      desc: "Throwing",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Thr"
    },
    "rating:cat": {
      desc: "Catcher Defense",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Cat"
    },
    "rating:ppw": {
      desc: "Pitching Power",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ppw"
    },
    "rating:ctl": {
      desc: "Control",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ctl"
    },
    "rating:mov": {
      desc: "Movement",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Mov"
    },
    "rating:ovrSP": {
      desc: "Overall Rating (SP)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrSP"
    },
    "rating:ovrRP": {
      desc: "Overall Rating (RP)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrRP"
    },
    "rating:ovrC": {
      desc: "Overall Rating (C)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrC"
    },
    "rating:ovr1B": {
      desc: "Overall Rating (1B)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ovr1B"
    },
    "rating:ovr2B": {
      desc: "Overall Rating (2B)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ovr2B"
    },
    "rating:ovr3B": {
      desc: "Overall Rating (3B)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ovr3B"
    },
    "rating:ovrSS": {
      desc: "Overall Rating (SS)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrSS"
    },
    "rating:ovrLF": {
      desc: "Overall Rating (LF)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrLF"
    },
    "rating:ovrCF": {
      desc: "Overall Rating (CF)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrCF"
    },
    "rating:ovrRF": {
      desc: "Overall Rating (RF)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrRF"
    },
    "rating:ovrDH": {
      desc: "Overall Rating (DH)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrDH"
    },
    "rating:potSP": {
      desc: "Potential Rating (SP)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotSP"
    },
    "rating:potRP": {
      desc: "Potential Rating (RP)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotRP"
    },
    "rating:potC": {
      desc: "Potential Rating (C)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotC"
    },
    "rating:pot1B": {
      desc: "Potential Rating (1B)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pot1B"
    },
    "rating:pot2B": {
      desc: "Potential Rating (2B)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pot2B"
    },
    "rating:pot3B": {
      desc: "Potential Rating (3B)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pot3B"
    },
    "rating:potSS": {
      desc: "Potential Rating (SS)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotSS"
    },
    "rating:potLF": {
      desc: "Potential Rating (LF)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotLF"
    },
    "rating:potCF": {
      desc: "Potential Rating (CF)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotCF"
    },
    "rating:potRF": {
      desc: "Potential Rating (RF)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotRF"
    },
    "rating:potDH": {
      desc: "Potential Rating (DH)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotDH"
    },
    "stat:keyStats": {
      desc: "Key Stats",
      sortSequence: ["desc", "asc"],
      sortType: "string",
      title: "Stats"
    },
    "stat:pa": {
      desc: "Plate Appearances",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PA"
    },
    "stat:r": {
      desc: "Runs",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "R"
    },
    "stat:pts": {
      desc: "Runs",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "R"
    },
    "stat:h": {
      desc: "Hits",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "H"
    },
    "stat:2b": {
      desc: "Doubles",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "2B"
    },
    "stat:3b": {
      desc: "Triples",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "3B"
    },
    "stat:hr": {
      desc: "Home Runs",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "HR"
    },
    "stat:rbi": {
      desc: "Runs Batted In",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "RBI"
    },
    "stat:sb": {
      desc: "Stolen Bases",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SB"
    },
    "stat:cs": {
      desc: "Caught Stealing",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "CS"
    },
    "stat:bb": {
      desc: "Walks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BB"
    },
    "stat:so": {
      desc: "Strikeouts",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SO"
    },
    "stat:gdp": {
      desc: "Double Plays Grounded Into",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GDP"
    },
    "stat:hbp": {
      desc: "Times Hit by a Pitch",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "HBP"
    },
    "stat:sh": {
      desc: "Sacrifice Hits/Bunts",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SH"
    },
    "stat:sf": {
      desc: "Sacrifice Flies",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SF"
    },
    "stat:ibb": {
      desc: "Intentional Walks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "IBB"
    },
    "stat:w": {
      desc: "Wins",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "W"
    },
    "stat:l": {
      desc: "Losses",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "L"
    },
    "stat:gpPit": {
      desc: "Games Played",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GP"
    },
    "stat:gsPit": {
      desc: "Games Started",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GS"
    },
    "stat:gf": {
      desc: "Games Finished",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GF"
    },
    "stat:cg": {
      desc: "Complete Games",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "CG"
    },
    "stat:sho": {
      desc: "Shutouts",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SHO"
    },
    "stat:sv": {
      desc: "Saves",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SV"
    },
    "stat:ip": {
      desc: "Innings Pitched",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "IP"
    },
    "stat:outs": {
      desc: "Outs Pitched",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Outs"
    },
    "stat:rPit": {
      desc: "Runs Allowed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "R"
    },
    "stat:er": {
      desc: "Earned Runs Allowed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ER"
    },
    "stat:hPit": {
      desc: "Hits Allowed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "H"
    },
    "stat:2bPit": {
      desc: "Doubles Allowed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "2B"
    },
    "stat:3bPit": {
      desc: "Triples Allowed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "3B"
    },
    "stat:hrPit": {
      desc: "Home Runs Allowed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "HR"
    },
    "stat:bbPit": {
      desc: "Walks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BB"
    },
    "stat:soPit": {
      desc: "Strikeouts",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SO"
    },
    "stat:ibbPit": {
      desc: "Intentional Walks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "IBB"
    },
    "stat:hbpPit": {
      desc: "Times Hit by a Pitch",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "HBP"
    },
    "stat:shPit": {
      desc: "Sacrifice Hits/Bunts Allowed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SH"
    },
    "stat:sfPit": {
      desc: "Sacrifice Flies Allowed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SF"
    },
    "stat:bk": {
      desc: "Balks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BK"
    },
    "stat:wp": {
      desc: "Wild Pitches",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "WP"
    },
    "stat:bf": {
      desc: "Batters Faced",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BF"
    },
    "stat:pc": {
      desc: "Pitch Count",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PC"
    },
    "stat:ab": {
      desc: "At Bats",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "AB"
    },
    "stat:ba": {
      desc: "Batting Average",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BA"
    },
    "stat:obp": {
      desc: "On-Base Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OBP"
    },
    "stat:slg": {
      desc: "Slugging Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SLG"
    },
    "stat:ops": {
      desc: "On-Base + Slugging Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OPS"
    },
    "stat:tb": {
      desc: "Total Bases",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TB"
    },
    "stat:winp": {
      desc: "Win-Loss Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "W-L%"
    },
    "stat:era": {
      desc: "Earned Run Average",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ERA"
    },
    "stat:fip": {
      desc: "Fielding Independent Pitching",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FIP"
    },
    "stat:whip": {
      desc: "Walks And Hits Per Inning Pitched",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "WHIP"
    },
    "stat:h9": {
      desc: "Hits Per 9 Innings",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "H9"
    },
    "stat:hr9": {
      desc: "Home Runs Per 9 Innings",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "HR9"
    },
    "stat:bb9": {
      desc: "Walks Per 9 Innings",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BB9"
    },
    "stat:so9": {
      desc: "Strikeouts Per 9 Innings",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SO9"
    },
    "stat:pc9": {
      desc: "Pitches Per 9 Innings",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PC9"
    },
    "stat:sow": {
      desc: "Strikeouts Per Walk",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SO/W"
    },
    "stat:rbat": {
      desc: "Batting Runs",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Rbat"
    },
    "stat:rbr": {
      desc: "Baserunning Runs",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Rbr"
    },
    "stat:rfldTot": {
      desc: "Fielding Runs",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Rfld"
    },
    "stat:rpos": {
      desc: "Positional Adjustment Runs",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Rpos"
    },
    "stat:rpit": {
      desc: "Pitching Runs Saved",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Rpit"
    },
    "stat:raa": {
      desc: "Runs Above Average",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "RAA"
    },
    "stat:waa": {
      desc: "Wins Above Average",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "WAA"
    },
    "stat:rrep": {
      desc: "Runs From Replacement Level",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Rrep"
    },
    "stat:rar": {
      desc: "Runs Above Replacement",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "RAR"
    },
    "stat:war": {
      desc: "Wins Above Replacement",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "WAR"
    },
    "stat:warPerPlayer": {
      desc: "WAR Per Player",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "WAR/Player"
    },
    "stat:gpF": {
      desc: "Games Played",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "G"
    },
    "stat:gsF": {
      desc: "Games Started",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GS"
    },
    "stat:cgF": {
      desc: "Complete Games",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "CG"
    },
    "stat:inn": {
      desc: "Innings Played In Field",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Inn"
    },
    "stat:ch": {
      desc: "Defensive Chances",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ch"
    },
    "stat:po": {
      desc: "Putouts",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PO"
    },
    "stat:a": {
      desc: "Assists",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "A"
    },
    "stat:e": {
      desc: "Errors",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "E"
    },
    "stat:dp": {
      desc: "Double Plays Turned",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "DP"
    },
    "stat:fldp": {
      desc: "Fielding Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Fld%"
    },
    "stat:rfld": {
      desc: "Fielding Runs",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Rfld"
    },
    "stat:rf9": {
      desc: "Range Factor Per 9 Inn",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "RF/9"
    },
    "stat:rfg": {
      desc: "Range Factor Per Game",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "RF/G"
    },
    "stat:pb": {
      desc: "Passed Balls",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PB"
    },
    "stat:sbF": {
      desc: "Stolen Bases",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SB"
    },
    "stat:csF": {
      desc: "Caught Stealing",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "CS"
    },
    "stat:csp": {
      desc: "Caught Stealing Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "CS%"
    },
    "stat:babip": {
      desc: "Batting Average On Balls In Play",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BAbip"
    },
    "stat:iso": {
      desc: "Isolated Power",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ISO"
    }
  },
  basketball: {
    "rating:fg": {
      desc: "Mid Range",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "2Pt"
    },
    "rating:tp": {
      desc: "Three Pointers",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "3Pt"
    },
    "rating:oiq": {
      desc: "Offensive IQ",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "oIQ"
    },
    "rating:dnk": {
      desc: "Dunks/Layups",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Dnk"
    },
    "rating:drb": {
      desc: "Dribbling",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Drb"
    },
    "rating:ins": {
      desc: "Inside Scoring",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ins"
    },
    "rating:jmp": {
      desc: "Jumping",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Jmp"
    },
    "rating:ft": {
      desc: "Free Throws",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FT"
    },
    "rating:pss": {
      desc: "Passing",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pss"
    },
    "rating:reb": {
      desc: "Rebounding",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Reb"
    },
    "rating:diq": {
      desc: "Defensive IQ",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "dIQ"
    },
    "stat:2pp": {
      desc: "Two Point Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "2P%"
    },
    "stat:2p": {
      desc: "Two Pointers Made",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "2P"
    },
    "stat:2pa": {
      desc: "Two Pointers Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "2PA"
    },
    "stat:pm": {
      desc: "Plus/Minus",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "+/-"
    },
    "stat:pm100": {
      desc: "Plus/Minus Per 100 Possessions",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "+/-"
    },
    "stat:onOff100": {
      desc: "+/- Per 100 Possessions, On Minus Off",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "On-Off"
    },
    "stat:tpp": {
      desc: "Three Point Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "3P%"
    },
    "stat:tp": {
      desc: "Three Pointers Made",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "3P"
    },
    "stat:tpa": {
      desc: "Three Pointers Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "3PA"
    },
    "stat:tpar": {
      desc: "Three Point Attempt Rate (3PA / FGA)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "3PAr"
    },
    "stat:astp": {
      desc: "Percentage of teammate field goals a player assisted while on the floor",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "AST%"
    },
    "stat:ast": {
      desc: "Assists",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "AST"
    },
    "stat:ba": {
      desc: "Blocks Against",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BA"
    },
    "stat:blk": {
      desc: "Blocks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BLK"
    },
    "stat:blkp": {
      desc: "Percentage of opponent two-pointers blocked",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BLK%"
    },
    "stat:drb": {
      desc: "Defensive Rebounds",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "DRB"
    },
    "stat:drbp": {
      desc: "Percentage of available defensive rebounds grabbed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "DRB%"
    },
    "stat:drtg": {
      desc: "Defensive Rating (points allowed per 100 possessions)",
      sortSequence: ["asc", "desc"],
      sortType: "number",
      title: "DRtg"
    },
    "stat:dws": {
      desc: "Defensive Win Shares",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "DWS"
    },
    "stat:ewa": {
      desc: "Estimated Wins Added",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "EWA"
    },
    "stat:efg": {
      desc: "Effective Field Goal Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "eFG%"
    },
    "stat:fgp": {
      desc: "Field Goal Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FG%"
    },
    "stat:fg": {
      desc: "Field Goals Made",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FG"
    },
    "stat:fga": {
      desc: "Field Goals Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FGA"
    },
    "stat:ftp": {
      desc: "Free Throw Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FT%"
    },
    "stat:ft": {
      desc: "Free Throws Made",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FT"
    },
    "stat:fta": {
      desc: "Free Throws Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FTA"
    },
    "stat:ftpFga": {
      desc: "Free Throws per Field Goal Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FTr"
    },
    "stat:ftr": {
      desc: "Free Throw Attempt Rate (FTA / FGA)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FT/FGA"
    },
    "stat:gmsc": {
      desc: "Game Score",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GmSc"
    },
    "stat:nrtg": {
      desc: "Net Rating (point differential per 100 possessions)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "NRtg"
    },
    "stat:orb": {
      desc: "Offensive Rebounds",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ORB"
    },
    "stat:orbp": {
      desc: "Percentage of available offensive rebounds grabbed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ORB%"
    },
    "stat:ortg": {
      desc: "Offensive Rating (points produced/scored per 100 possessions)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ORtg"
    },
    "stat:ows": {
      desc: "Offensive Win Shares",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OWS"
    },
    "stat:pace": {
      desc: "Possessions Per Game",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pace"
    },
    "stat:per": {
      desc: "Player Efficiency Rating",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PER"
    },
    "stat:pf": {
      desc: "Personal Fouls",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PF"
    },
    "stat:pl": {
      desc: "Pythagorean Losses (expected losses based on points scored and allowed)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PL"
    },
    "stat:pts": {
      desc: "Points",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PTS"
    },
    "stat:pw": {
      desc: "Pythagorean Wins (expected wins based on points scored and allowed)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PW"
    },
    "stat:stl": {
      desc: "Steals",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "STL"
    },
    "stat:stlp": {
      desc: "Percentage of opponent possessions ending in steals",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "STL%"
    },
    "stat:tovp": {
      desc: "Turnovers per 100 plays",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TOV%"
    },
    "stat:trb": {
      desc: "Total Rebounds",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TRB"
    },
    "stat:trbp": {
      desc: "Percentage of available rebounds grabbed",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TRB%"
    },
    "stat:tsp": {
      desc: "True Shooting Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TS%"
    },
    "stat:tov": {
      desc: "Turnovers",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TOV"
    },
    "stat:usgp": {
      desc: "Percentage of team plays used",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "USG%"
    },
    "stat:ws": {
      desc: "Win Shares",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "WS"
    },
    "stat:wsPerPlayer": {
      desc: "Win Shares Per Player",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "WS/Player"
    },
    "stat:ws48": {
      desc: "Win Shares Per 48 Minutes",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "WS/48"
    },
    "stat:obpm": {
      desc: "Offensive Box Plus-Minus",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OBPM"
    },
    "stat:dbpm": {
      desc: "Defensive Box Plus-Minus",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "DBPM"
    },
    "stat:bpm": {
      desc: "Box Plus-Minus",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BPM"
    },
    "stat:vorp": {
      desc: "Value Over Replacement Player",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "VORP"
    },
    "stat:fgAtRim": {
      desc: "At Rim Made",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "M"
    },
    "stat:fgaAtRim": {
      desc: "At Rim Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "A"
    },
    "stat:fgpAtRim": {
      desc: "At Rim Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "%"
    },
    "stat:fgLowPost": {
      desc: "Low Post Made",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "M"
    },
    "stat:fgaLowPost": {
      desc: "Low Post Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "A"
    },
    "stat:fgpLowPost": {
      desc: "Low Post Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "%"
    },
    "stat:fgMidRange": {
      desc: "Mid Range Made",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "M"
    },
    "stat:fgaMidRange": {
      desc: "Mid Range Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "A"
    },
    "stat:fgpMidRange": {
      desc: "Mid Range Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "%"
    },
    "stat:dd": {
      desc: "Double Doubles",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "DD"
    },
    "stat:td": {
      desc: "Triple Doubles",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TD"
    },
    "stat:qd": {
      desc: "Quadruple Doubles",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "QD"
    },
    "stat:fxf": {
      desc: "Five by Fives",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "5x5"
    }
  },
  football: {
    "pos:QB": {
      desc: "Quarterback",
      sortType: "number",
      title: "QB"
    },
    "pos:RB": {
      desc: "Running Back",
      sortType: "number",
      title: "RB"
    },
    "pos:WR": {
      desc: "Wide Receiver",
      sortType: "number",
      title: "WR"
    },
    "pos:TE": {
      desc: "Tight End",
      sortType: "number",
      title: "TE"
    },
    "pos:OL": {
      desc: "Offensive Lineman",
      sortType: "number",
      title: "OL"
    },
    "pos:DL": {
      desc: "Defensive Lineman",
      sortType: "number",
      title: "DL"
    },
    "pos:LB": {
      desc: "Linebacker",
      sortType: "number",
      title: "LB"
    },
    "pos:CB": {
      desc: "Cornerback",
      sortType: "number",
      title: "CB"
    },
    "pos:S": {
      desc: "Safety",
      sortType: "number",
      title: "S"
    },
    "pos:K": {
      desc: "Kicker",
      sortType: "number",
      title: "K"
    },
    "pos:P": {
      desc: "Punter",
      sortType: "number",
      title: "P"
    },
    "rating:thv": {
      desc: "Throwing Vision",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ThV"
    },
    "rating:thp": {
      desc: "Throwing Power",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ThP"
    },
    "rating:tha": {
      desc: "Throwing Accuracy",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ThA"
    },
    "rating:bsc": {
      desc: "Ball Security",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BSc"
    },
    "rating:elu": {
      desc: "Elusiveness",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Elu"
    },
    "rating:rtr": {
      desc: "Route Running",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "RtR"
    },
    "rating:hnd": {
      desc: "Hands",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Hnd"
    },
    "rating:rbk": {
      desc: "Run Blocking",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "RBk"
    },
    "rating:pbk": {
      desc: "Pass Blocking",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PBk"
    },
    "rating:pcv": {
      desc: "Pass Coverage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PCv"
    },
    "rating:tck": {
      desc: "Tackling",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Tck"
    },
    "rating:prs": {
      desc: "Pass Rushing",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PRs"
    },
    "rating:rns": {
      desc: "Run Stopping",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "RnS"
    },
    "rating:kpw": {
      desc: "Kicking Power",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "KPw"
    },
    "rating:kac": {
      desc: "Kicking Accuracy",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "KAc"
    },
    "rating:ppw": {
      desc: "Punting Power",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PPw"
    },
    "rating:pac": {
      desc: "Punting Accuracy",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PAc"
    },
    "rating:ovrQB": {
      desc: "Overall Rating (QB)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrQB"
    },
    "rating:ovrRB": {
      desc: "Overall Rating (RB)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrRB"
    },
    "rating:ovrWR": {
      desc: "Overall Rating (WR)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrWR"
    },
    "rating:ovrTE": {
      desc: "Overall Rating (TE)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrTE"
    },
    "rating:ovrOL": {
      desc: "Overall Rating (OL)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrOL"
    },
    "rating:ovrDL": {
      desc: "Overall Rating (DL)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrDL"
    },
    "rating:ovrLB": {
      desc: "Overall Rating (LB)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrLB"
    },
    "rating:ovrCB": {
      desc: "Overall Rating (CB)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrCB"
    },
    "rating:ovrS": {
      desc: "Overall Rating (S)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrS"
    },
    "rating:ovrK": {
      desc: "Overall Rating (K)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrK"
    },
    "rating:ovrP": {
      desc: "Overall Rating (P)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrP"
    },
    "rating:ovrKR": {
      desc: "Overall Rating (KR)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrKR"
    },
    "rating:ovrPR": {
      desc: "Overall Rating (PR)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrPR"
    },
    "rating:potQB": {
      desc: "Potential Rating (QB)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotQB"
    },
    "rating:potRB": {
      desc: "Potential Rating (RB)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotRB"
    },
    "rating:potWR": {
      desc: "Potential Rating (WR)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotWR"
    },
    "rating:potTE": {
      desc: "Potential Rating (TE)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotTE"
    },
    "rating:potOL": {
      desc: "Potential Rating (OL)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotOL"
    },
    "rating:potDL": {
      desc: "Potential Rating (DL)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotDL"
    },
    "rating:potLB": {
      desc: "Potential Rating (LB)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotLB"
    },
    "rating:potCB": {
      desc: "Potential Rating (CB)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotCB"
    },
    "rating:potS": {
      desc: "Potential Rating (S)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotS"
    },
    "rating:potK": {
      desc: "Potential Rating (K)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotK"
    },
    "rating:potP": {
      desc: "Potential Rating (P)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotP"
    },
    "rating:potKR": {
      desc: "Potential Rating (KR)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotKR"
    },
    "rating:potPR": {
      desc: "Potential Rating (PR)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotPR"
    },
    "stat:fmb": {
      desc: "Fumbles",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Fmb"
    },
    "stat:fmbLost": {
      desc: "Fumbles Lost",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FL"
    },
    "stat:fp": {
      desc: "Fantasy Points",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FP"
    },
    "stat:pssCmp": {
      desc: "Completions",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Cmp"
    },
    "stat:pss": {
      desc: "Passing Attempts",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Att"
    },
    "stat:pssYds": {
      desc: "Passing Yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:pssTD": {
      desc: "Passing Touchdowns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TD"
    },
    "stat:pssInt": {
      desc: "Interceptions",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Int"
    },
    "stat:pssLng": {
      desc: "Longest Pass",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Lng"
    },
    "stat:pssSk": {
      desc: "Times Sacked",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Sk"
    },
    "stat:pssSkYds": {
      desc: "Yards lost due to sacks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:rus": {
      desc: "Rushing Attempts",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Rush"
    },
    "stat:rusYds": {
      desc: "Rushing Yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:rusTD": {
      desc: "Rushing Touchdowns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TD"
    },
    "stat:rusLng": {
      desc: "Longest Run",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Lng"
    },
    "stat:tgt": {
      desc: "Targets",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Tgt"
    },
    "stat:rec": {
      desc: "Receptions",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Rec"
    },
    "stat:recYds": {
      desc: "Receiving Yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:recTD": {
      desc: "Receiving Touchdowns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TD"
    },
    "stat:recLng": {
      desc: "Longest Reception",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Lng"
    },
    "stat:pr": {
      desc: "Punt Returns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PR"
    },
    "stat:prYds": {
      desc: "Punt Return Yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:prTD": {
      desc: "Punts returned for touchdowns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TD"
    },
    "stat:prLng": {
      desc: "Longest Punt Return",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Lng"
    },
    "stat:kr": {
      desc: "Kickoff Returns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "KR"
    },
    "stat:krYds": {
      desc: "Kickoff Return Yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:krTD": {
      desc: "Kickoffs returned for touchdowns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TD"
    },
    "stat:krLng": {
      desc: "Longest Kickoff Return",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Lng"
    },
    "stat:defInt": {
      desc: "Interceptions",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Int"
    },
    "stat:defIntYds": {
      desc: "Yards interceptions were returned for",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:defIntTD": {
      desc: "Interceptions returned for touchdowns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TD"
    },
    "stat:defIntLng": {
      desc: "Longest Interception Return",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Lng"
    },
    "stat:defPssDef": {
      desc: "Passes Defended",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PD"
    },
    "stat:defFmbFrc": {
      desc: "Forced Fumbles",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FF"
    },
    "stat:defFmbRec": {
      desc: "Fumbles Recovered",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FR"
    },
    "stat:defFmbYds": {
      desc: "Yards fumbles were returned for",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:defFmbTD": {
      desc: "Fumbles returned for touchdowns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TD"
    },
    "stat:defFmbLng": {
      desc: "Longest Fumble Return",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Lng"
    },
    "stat:defSk": {
      desc: "Sacks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Sk"
    },
    "stat:defTckSolo": {
      desc: "Solo Tackles",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Solo"
    },
    "stat:defTckAst": {
      desc: "Assists On Tackles",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ast"
    },
    "stat:defTckLoss": {
      desc: "Tackles For Loss",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TFL"
    },
    "stat:defSft": {
      desc: "Safeties Scored",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Sfty"
    },
    "stat:fg0": {
      desc: "Field Goals Made, 19 yards and under",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FG10"
    },
    "stat:fga0": {
      desc: "Field Goals Attempted, 19 yards and under",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FGA10"
    },
    "stat:fg20": {
      desc: "Field Goals Made, 20-29 yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FG20"
    },
    "stat:fga20": {
      desc: "Field Goals Attempted, 20-29 yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FGA20"
    },
    "stat:fg30": {
      desc: "Field Goals Made, 30-39 yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FG30"
    },
    "stat:fga30": {
      desc: "Field Goals Attempted, 30-39 yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FGA30"
    },
    "stat:fg40": {
      desc: "Field Goals Made, 40-49 yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FG40"
    },
    "stat:fga40": {
      desc: "Field Goals Attempted, 40-49 yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FGA40"
    },
    "stat:fg50": {
      desc: "Field Goals Made, 50+ yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FG50"
    },
    "stat:fga50": {
      desc: "Field Goals Attempted, 50+ yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FGA50"
    },
    "stat:fgLng": {
      desc: "Longest Field Goal",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Lng"
    },
    "stat:xp": {
      desc: "Extra Points Made",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "XPM"
    },
    "stat:xpa": {
      desc: "Extra Points Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "XPA"
    },
    "stat:pnt": {
      desc: "Times Punted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pnt"
    },
    "stat:pntYds": {
      desc: "Total Punt Yardage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:pntLng": {
      desc: "Longest Punt",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Lng"
    },
    "stat:pntBlk": {
      desc: "Times Punts Blocked",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Blk"
    },
    "stat:pen": {
      desc: "Penalties",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pen"
    },
    "stat:penYds": {
      desc: "Penalty Yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:cmpPct": {
      desc: "Completion Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pct"
    },
    "stat:qbRat": {
      desc: "Quarterback Rating",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "QBRat"
    },
    "stat:rusYdsPerAtt": {
      desc: "Rushing Yards Per Attempt",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/A"
    },
    "stat:recYdsPerAtt": {
      desc: "Yards Per Catch",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/A"
    },
    "stat:fg": {
      desc: "Field Goals Made",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FGM"
    },
    "stat:fga": {
      desc: "Field Goals Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FGA"
    },
    "stat:fgPct": {
      desc: "Field Goal Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pct"
    },
    "stat:xpPct": {
      desc: "Extra Point Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pct"
    },
    "stat:kickingPts": {
      desc: "Kicking Points",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pts"
    },
    "stat:pntYdsPerAtt": {
      desc: "Yards Per Punt",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/A"
    },
    "stat:pntTB": {
      desc: "Punt Touchbacks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TB"
    },
    "stat:pntIn20": {
      desc: "Punts Inside 20",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "In20"
    },
    "stat:krYdsPerAtt": {
      desc: "Yards Per Kick Return",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/A"
    },
    "stat:prYdsPerAtt": {
      desc: "Yards Per Punt Return",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/A"
    },
    "stat:defTck": {
      desc: "Total Tackles",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Tck"
    },
    "stat:keyStats": {
      desc: "Key Stats",
      sortSequence: ["desc", "asc"],
      sortType: "string",
      title: "Stats"
    },
    "stat:pts": {
      desc: "",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pts"
    },
    "stat:yds": {
      desc: "Offensive Yards",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Yds"
    },
    "stat:ply": {
      desc: "Plays",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ply"
    },
    "stat:ydsPerPlay": {
      desc: "Yards Per Play",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/P"
    },
    "stat:tov": {
      desc: "Turnovers",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TO"
    },
    "stat:drives": {
      desc: "Number of Drives",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "#Dr"
    },
    "stat:drivesScoringPct": {
      desc: "Percentage of drives ending in a score",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Sc%"
    },
    "stat:drivesTurnoverPct": {
      desc: "Percentage of drives ending in a turnover",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TO%"
    },
    "stat:avgFieldPosition": {
      desc: "Average Starting Field Position",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Start"
    },
    "stat:timePerDrive": {
      desc: "Time Per Drive (minutes)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Tm/D"
    },
    "stat:playsPerDrive": {
      desc: "Number of Plays Per Drive",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ply/D"
    },
    "stat:ydsPerDrive": {
      desc: "Yards Per Drive",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/D"
    },
    "stat:ptsPerDrive": {
      desc: "Points Per Drive",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pts/D"
    },
    "stat:qbRec": {
      desc: "Record as primary QB",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "QBRec"
    },
    "stat:qbW": {
      desc: "Wins as primary QB",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "QBW"
    },
    "stat:qbL": {
      desc: "Losses as primary QB",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "QBL"
    },
    "stat:qbT": {
      desc: "Ties as primary QB",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "QBT"
    },
    "stat:qbOTL": {
      desc: "Overtime losses as primary QB",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "QBOTL"
    },
    "stat:pssTDPct": {
      desc: "Percentage of passes that result in touchdowns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TD%"
    },
    "stat:pssIntPct": {
      desc: "Percentage of passes that result in interceptions",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Int%"
    },
    "stat:pssYdsPerAtt": {
      desc: "Pass Yards Per Attempt",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/A"
    },
    "stat:pssAdjYdsPerAtt": {
      desc: "Adjusted Pass Yards Per Attempt ((yds + 20 * TD - 45 * int) / att)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "AY/A"
    },
    "stat:pssYdsPerCmp": {
      desc: "Pass Yards Per Completion",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/C"
    },
    "stat:pssYdsPerGame": {
      desc: "Pass Yards Per Game",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/G"
    },
    "stat:pssNetYdsPerAtt": {
      desc: "Net Pass Yards Per Attempt (passes and sacks)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "NY/A"
    },
    "stat:pssAdjNetYdsPerAtt": {
      desc: "Adjusted Net Pass Yards Per Attempt ((yds + 20 * TD - 45 * int - skYds) / (att + sk))",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ANY/A"
    },
    "stat:pssSkPct": {
      desc: "Percentage of times sacked when attempting a pass",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Sk%"
    },
    "stat:rusYdsPerGame": {
      desc: "Rushing Yards Per Game",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/G"
    },
    "stat:rusPerGame": {
      desc: "Rushing Attempts Per Game",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "A/G"
    },
    "stat:recYdsPerRec": {
      desc: "Yards Per Reception",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/R"
    },
    "stat:recPerGame": {
      desc: "Receptions Per Game",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "R/G"
    },
    "stat:recYdsPerGame": {
      desc: "Receiving Yards Per Game",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/G"
    },
    "stat:recCatchPct": {
      desc: "Catch Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Ctch%"
    },
    "stat:touches": {
      desc: "Touches (Rushing Attempts And Receptions)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Tch"
    },
    "stat:ydsPerTouch": {
      desc: "Yards Per Touch",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Y/Tch"
    },
    "stat:ydsFromScrimmage": {
      desc: "Total Rushing and Receiving Yards From Scrimmage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "YScm"
    },
    "stat:rusRecTD": {
      desc: "Total Rushing and Receiving Touchdowns",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "RRTD"
    },
    "stat:allPurposeYds": {
      desc: "All Purpose Yards (Rushing, Receiving, and Kick/Punt/Fumble/Interception Returns)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "APY"
    },
    "stat:av": {
      desc: "Approximate Value",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "AV"
    },
    "stat:avPerPlayer": {
      desc: "Approximate Value Per Player",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "AV/Player"
    }
  },
  hockey: {
    "pos:C": {
      desc: "Center",
      sortType: "number",
      title: "C"
    },
    "pos:W": {
      desc: "Wing",
      sortType: "number",
      title: "W"
    },
    "pos:D": {
      desc: "Defenseman",
      sortType: "number",
      title: "D"
    },
    "pos:G": {
      desc: "Goalie",
      sortType: "number",
      title: "G"
    },
    "rating:pss": {
      desc: "Passing",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Pss"
    },
    "rating:wst": {
      desc: "Wristshot",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Wst"
    },
    "rating:sst": {
      desc: "Slapshot",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Sst"
    },
    "rating:stk": {
      desc: "Stickhandling",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Stk"
    },
    "rating:oiq": {
      desc: "Offensive IQ",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "oIQ"
    },
    "rating:chk": {
      desc: "Checking",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Chk"
    },
    "rating:blk": {
      desc: "Shot Blocking",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Blk"
    },
    "rating:fcf": {
      desc: "Faceoffs",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Fcf"
    },
    "rating:diq": {
      desc: "Defensive IQ",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "dIQ"
    },
    "rating:glk": {
      desc: "Goalkeeping",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "Glk"
    },
    "rating:ovrC": {
      desc: "Overall Rating (Center)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrC"
    },
    "rating:ovrW": {
      desc: "Overall Rating (Winger)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrW"
    },
    "rating:ovrD": {
      desc: "Overall Rating (Defenseman)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrD"
    },
    "rating:ovrG": {
      desc: "Overall Rating (Goalie)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OvrG"
    },
    "rating:potC": {
      desc: "Potential Rating (Center)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotC"
    },
    "rating:potW": {
      desc: "Potential Rating (Winger)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotW"
    },
    "rating:potD": {
      desc: "Potential Rating (Defenseman)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotD"
    },
    "rating:potG": {
      desc: "Potential Rating (Goalie)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PotG"
    },
    "stat:gpGoalie": {
      desc: "Games Played (Goalie)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: gp
    },
    "stat:gpSkater": {
      desc: "Games Played (Skater)",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: gp
    },
    "stat:pm": {
      desc: "Plus/Minus",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "+/-"
    },
    "stat:pim": {
      desc: "Penalty Minutes",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PIM"
    },
    "stat:evG": {
      desc: "Even Strength Goals",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "evG"
    },
    "stat:ppG": {
      desc: "Power Play Goals",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ppG"
    },
    "stat:shG": {
      desc: "Short-Handed Goals",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "shG"
    },
    "stat:gwG": {
      desc: "Game Winning Goals",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "gwG"
    },
    "stat:evA": {
      desc: "Even Strength Assists",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "evA"
    },
    "stat:ppA": {
      desc: "Power Play Assists",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ppA"
    },
    "stat:shA": {
      desc: "Short-Handed Assists",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "shA"
    },
    "stat:gwA": {
      desc: "Game Winning Assists",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "gwA"
    },
    "stat:s": {
      desc: "Shots on Goal",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "S"
    },
    "stat:tsa": {
      desc: "Total Shots Attempted",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TSA"
    },
    "stat:fow": {
      desc: "Faceoff Wins",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FOW"
    },
    "stat:fol": {
      desc: "Faceoff Losses",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FOL"
    },
    "stat:foPct": {
      desc: "Faceoff Win Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "FO%"
    },
    "stat:blk": {
      desc: "Blocks",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "BLK"
    },
    "stat:hit": {
      desc: "Hits",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "HIT"
    },
    "stat:tk": {
      desc: "Takeaways",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "TK"
    },
    "stat:gv": {
      desc: "Giveaways",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GV"
    },
    "stat:ga": {
      desc: "Goals Against",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GA"
    },
    "stat:sv": {
      desc: "Saves",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SV"
    },
    "stat:so": {
      desc: "Shutouts",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SO"
    },
    "stat:g": {
      desc: "Goals",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "G"
    },
    "stat:a": {
      desc: "Assists",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "A"
    },
    "stat:pts": {
      desc: "Points",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PTS"
    },
    "stat:sPct": {
      desc: "Shooting Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "S%"
    },
    "stat:svPct": {
      desc: "Save Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SV%"
    },
    "stat:sa": {
      desc: "Shots Against",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "SA"
    },
    "stat:gaa": {
      desc: "Goals Against Average",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GAA"
    },
    "stat:keyStats": {
      desc: "Key Stats",
      sortSequence: ["desc", "asc"],
      sortType: "string",
      title: "Stats"
    },
    "stat:ps": {
      desc: "Point Shares",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PS"
    },
    "stat:psPerPlayer": {
      desc: "Point Shares Per Player",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PS/Player"
    },
    "stat:ops": {
      desc: "Offensive Point Shares",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "OPS"
    },
    "stat:dps": {
      desc: "Defensive Point Shares",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "DPS"
    },
    "stat:gps": {
      desc: "Goalie Point Shares",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GPS"
    },
    "stat:gc": {
      desc: "Goals Created",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "GC"
    },
    "stat:amin": {
      desc: "Average Time On Ice",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ATOI"
    },
    "stat:ppMin": {
      desc: "Power Play Time On Ice",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "ppTOI"
    },
    "stat:shMin": {
      desc: "Short Handed Time On Ice",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "shTOI"
    },
    "stat:ppo": {
      desc: "Power Play Opportunities",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PPO"
    },
    "stat:ppPct": {
      desc: "Power Play Percentage",
      sortSequence: ["desc", "asc"],
      sortType: "number",
      title: "PP%"
    },
    "stat:gRec": {
      desc: "Record as primary G",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "Rec"
    },
    "stat:gW": {
      desc: "Wins as primary G",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "GW"
    },
    "stat:gL": {
      desc: "Losses as primary G",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "GL"
    },
    "stat:gT": {
      desc: "Ties as primary G",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "GT"
    },
    "stat:gOTL": {
      desc: "Overtime losses as primary G",
      sortSequence: ["desc", "asc"],
      sortType: "record",
      title: "GOTL"
    }
  }
});
const cols = {
  "": {
    sortSequence: ["desc", "asc"]
  },
  "#": {},
  "@": {
    desc: "Home or Away"
  },
  "#AS": {
    desc: "Number of All-Star Selections",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "%": {
    desc: "Percentage",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Active: {
    desc: "Number of Players Still Active",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "# Fathers": {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  HoF: {
    desc: "Number of Players in the Hall of Fame",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "# Brothers": {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "# Players": {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "# Seasons": {
    desc: "Number of Seasons",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "# Sons": {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "# Teams": {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "# Trades": {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  A: {
    desc: "Attempted",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Acquired: {
    desc: "How Player Was Acquired"
  },
  Actions: {},
  Age: {
    sortType: "number"
  },
  Amount: {
    sortSequence: ["desc", "asc"],
    sortType: "currency"
  },
  "Asking For": {
    sortSequence: ["desc", "asc"],
    sortType: "currency"
  },
  "Avg Attendance": {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  AvgAge: {
    desc: "Average age, weighted by minutes played",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "Age"
  },
  Born: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Cap: {
    desc: "Salary Cap Issue",
    sortSequence: ["asc", "desc"],
    sortType: "number",
    width: "1px"
  },
  "Cap Space": {
    sortSequence: ["desc", "asc"],
    sortType: "currency"
  },
  "Captain 1": {},
  "Captain 2": {},
  Cash: {
    sortSequence: ["desc", "asc"],
    sortType: "currency"
  },
  Change: {
    desc: "Difference between pre-lottery rank and draft lottery result",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  College: {},
  Conference: {},
  Contract: {
    sortSequence: ["desc", "asc"],
    sortType: "currency"
  },
  Count: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Country: {},
  Created: {
    desc: "Created Date",
    searchType: "string",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Current: {
    desc: "Current Team Rating (With Injuries)",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Current Contract": {
    desc: "Current Contract",
    sortSequence: ["desc", "asc"],
    sortType: "currency",
    title: "Current"
  },
  "Projected Contract": {
    desc: "Projected Contract",
    sortSequence: ["desc", "asc"],
    sortType: "currency",
    title: "Projected"
  },
  Details: {},
  Died: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Diff: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Difficulty: {
    sortSequence: ["desc", "asc"]
  },
  Division: {},
  Draft: {
    noSearch: true,
    sortSequence: []
  },
  "Draft Picks": {
    sortSequence: []
  },
  "Draft Year": {
    sortType: "number"
  },
  Drafted: {
    sortType: "number"
  },
  "Dunk Winner": {
    desc: "Slam Dunk Contest Winner"
  },
  End: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Exp: {
    desc: "Contract Expiration",
    sortSequence: ["asc", "desc"],
    sortType: "number"
  },
  Experience: {
    desc: "Number of Years in the League",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Finals: {
    desc: "Finals Appearances",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Finals Won": {
    desc: "Finals Won",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Finals Lost": {
    desc: "Finals Lost",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  From: {},
  GB: {
    desc: "Games Back",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Games: {
    desc: "Number of Games",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  GOAT: {
    desc: "GOAT Score",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Healthy: {
    desc: "Team Rating (When Healthy)",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Height: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  HOF: {
    sortSequence: ["desc", "asc"]
  },
  Injury: {},
  L: {
    desc: "Losses",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  L10: {
    desc: "Last Ten Games",
    sortSequence: ["desc", "asc"],
    sortType: "lastTen"
  },
  Last: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Last Played": {
    desc: "Last Played Date",
    sortSequence: ["desc", "asc"],
    searchType: "string",
    sortType: "number"
  },
  "Last Season": {
    desc: "Last Season with Team",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "League Champion": {},
  League: {
    desc: "League Name"
  },
  Links: {
    noSearch: true,
    sortSequence: []
  },
  M: {
    desc: "Made",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Mood: {
    width: "1px",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Name: {},
  Normal: {
    desc: "Normal Difficulty",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Hard: {
    desc: "Hard Difficulty",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Insane: {
    desc: "Insane Difficulty",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Negotiate: {
    sortSequence: [],
    width: "1px"
  },
  Note: {},
  Odds: {
    desc: "Pre-lottery odds of getting this pick",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Opp: {
    desc: "Opponent"
  },
  Ovr: {
    desc: "Overall Rating",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Ovr Drop": {
    desc: "Decrease in Overall Rating",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  PA: {
    desc: `${isSport("hockey") ? "Goals" : "Points"} Against`,
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: isSport("hockey") ? "GA" : undefined
  },
  PS: {
    desc: `${isSport("hockey") ? "Goals" : "Points"} Scored`,
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: isSport("hockey") ? "GF" : undefined
  },
  "PA/g": {
    desc: `${isSport("hockey") ? "Goals" : "Points"} Against Per Game`,
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: isSport("hockey") ? "GA" : undefined
  },
  "PS/g": {
    desc: `${isSport("hockey") ? "Goals" : "Points"} Scored Per Game`,
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: isSport("hockey") ? "GF" : undefined
  },
  Payroll: {
    sortSequence: ["desc", "asc"],
    sortType: "currency"
  },
  "Peak Ovr": {
    desc: "Peak Overall Rating",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Phase: {
    desc: "League Season and Phase",
    sortSequence: ["desc", "asc"]
  },
  Pick: {
    desc: "Draft Pick",
    sortType: "draftPick"
  },
  Players: {},
  Pop: {
    desc: "Region Population",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Playoffs: {
    desc: "Playoff Appearances",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Pos: {
    desc: "Position"
  },
  Pot: {
    desc: "Potential Rating",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Pot Drop": {
    desc: "Decrease in Potential Rating",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Pre-Lottery": {
    desc: "Pre-lottery rank",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Prog: {
    desc: "Progression From Previous Season",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Profit (YTD)": {
    sortSequence: ["desc", "asc"],
    sortType: "currency"
  },
  PTS: {
    desc: "Points",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "PTS%": {
    desc: "Points Divided By Maximum Points",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Received: {
    desc: "Assets Received in Trade"
  },
  Record: {
    desc: "Record",
    sortType: "record"
  },
  Relation: {},
  Result: {},
  Retired: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Revenue (YTD)": {
    sortSequence: ["desc", "asc"],
    sortType: "currency"
  },
  "Roster Spots": {
    desc: "Number of Open Roster Spots",
    sortSequence: ["desc", "asc"]
  },
  "Rounds Lost": {
    desc: "Playoff Rounds Lost",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Rounds Won": {
    desc: "Playoff Rounds Won",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Runner Up": {},
  Season: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Seed: {
    desc: "Playoff Seed",
    sortType: "number"
  },
  Skills: {},
  Start: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Strategy: {},
  T: {
    desc: "Ties",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  "Ticket Price": {
    sortSequence: ["desc", "asc"],
    sortType: "currency"
  },
  Trade: {
    desc: "Ties",
    noSearch: true
  },
  OTL: {
    desc: "Overtime Losses",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Team: {},
  "Three-Point Winner": {
    desc: "Three-Point Contest Winner"
  },
  Titles: {
    desc: "Championships Won",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Type: {
    desc: "Type of Game"
  },
  TypeInjury: {
    desc: "Type of Injury",
    title: "Type"
  },
  W: {
    desc: "Wins",
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  Weight: {
    sortSequence: ["desc", "asc"],
    sortType: "number"
  },
  X: {
    desc: "Exclude from counter offers",
    noSearch: true,
    sortSequence: []
  },
  Year: {
    sortType: "number"
  },
  Summary: {},
  "rating:endu": {
    desc: "Endurance",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "End"
  },
  "rating:hgt": {
    desc: "Height",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "Hgt"
  },
  "rating:spd": {
    desc: "Speed",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "Spd"
  },
  "rating:stre": {
    desc: "Strength",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "Str"
  },
  "stat:gp": {
    desc: "Games Played",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: gp
  },
  "stat:gpPerPlayer": {
    desc: "Games Played Per Player",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: `${gp}/Player`
  },
  "stat:gs": {
    desc: "Games Started",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "GS"
  },
  "stat:jerseyNumber": {
    desc: "Jersey Number",
    sortSequence: ["asc", "desc"],
    sortType: "number",
    title: "#"
  },
  "stat:min": {
    desc: isSport("hockey") ? "Time On Ice" : "Minutes",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: isSport("hockey") ? "TOI" : "MP"
  },
  "stat:mov": {
    desc: "Average Margin of Victory",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "MOV"
  },
  "stat:diff": {
    desc: "Point Differential",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "Diff"
  },
  "stat:yearsWithTeam": {
    desc: "Years With Team",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "YWT"
  },
  "count:allDefense": {
    desc: "All-Defensive Team",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "ADT"
  },
  "count:allLeague": {
    desc: "All-League Team",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "ALT"
  },
  "count:allRookie": {
    desc: "All-Rookie Team",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "ART"
  },
  "count:allStar": {
    desc: "All-Star",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "AS"
  },
  "count:allOffense": {
    desc: "All-Offensive Team",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "AOT"
  },
  "count:allStarMVP": {
    desc: "All-Star MVP",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "ASMVP"
  },
  "count:bestRecord": {
    desc: "Best Record",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "BR"
  },
  "count:bestRecordConf": {
    desc: "Best Conference Record",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "BRC"
  },
  "count:dpoy": {
    desc: "Defensive Player of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "DPOY"
  },
  "count:dfoy": {
    desc: "Defensive Forward of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "DFOY"
  },
  "count:goy": {
    desc: "Goalie of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "GOY"
  },
  "count:mip": {
    desc: "Most Improved Player",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "MIP"
  },
  "count:mvp": {
    desc: "Most Valuable Player",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "MVP"
  },
  "count:roy": {
    desc: "Rookie of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "ROY"
  },
  "count:smoy": {
    desc: "Sixth Man of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "SMOY"
  },
  "count:oroy": {
    desc: "Offensive Rookie of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "OROY"
  },
  "count:droy": {
    desc: "Defensive Rookie of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "DROY"
  },
  "count:poy": {
    desc: "Pitcher of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "POY"
  },
  "count:rpoy": {
    desc: "Relief Pitcher of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "RPOY"
  },
  "award:dpoy": {
    desc: "Defensive Player of the Year",
    title: "DPOY"
  },
  "award:dfoy": {
    desc: "Defensive Forward of the Year",
    title: "DFOY"
  },
  "award:goy": {
    desc: "Goalie of the Year",
    title: "GOY"
  },
  "award:finalsMvp": {
    desc: `${isSport("hockey") ? "Playoffs" : "Finals"} Most Valuable Player`,
    title: `${isSport("hockey") ? "Playoffs" : "Finals"} MVP`
  },
  "award:mip": {
    desc: "Most Improved Player",
    title: "MIP"
  },
  "award:mvp": {
    desc: "Most Valuable Player",
    title: "MVP"
  },
  "award:roy": {
    desc: "Rookie of the Year",
    title: "ROY"
  },
  "award:smoy": {
    desc: "Sixth Man of the Year",
    title: "SMOY"
  },
  "award:poy": {
    desc: "Pitcher of the Year",
    title: "POY"
  },
  "award:rpoy": {
    desc: "Relief Pitcher of the Year",
    title: "RPOY"
  },
  "award:oroy": {
    desc: "Offensive Rookie of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "OROY"
  },
  "award:droy": {
    desc: "Defensive Rookie of the Year",
    sortSequence: ["desc", "asc"],
    sortType: "number",
    title: "DROY"
  },
  ...sportSpecificCols
};
var getCols = ((titles, overrides = {}) => {
  return titles.map(title => {
    if (!Object.hasOwn(cols, title)) {
      throw new Error(`Unknown column: "${title}"`);
    }
    return {
      ...cols[title],
      title: cols[title].title ?? title,
      ...overrides[title]
    };
  });
});

export { DEFAULT_PHASE_CHANGE_REDIRECTS as $, AD_DIVS as A, DEFAULT_CONFS as B, TIEBREAKERS as C, DEFAULT_JERSEY as D, EMAIL_ADDRESS as E, COURT as F, GAME_ACRONYM as G, gameAttributesKeysOtherSports as H, NUM_LINES as I, NUM_ACTIVE_BATTERS as J, NUM_STARTING_PITCHERS as K, NUM_ACTIVE_PITCHERS as L, MAX_SUPPORTED_LEAGUE_VERSION as M, NO_LOTTERY_DRAFT_TYPES as N, SIMPLE_AWARDS as O, PHASE as P, AWARD_NAMES as Q, RATINGS as R, SPORT_HAS_REAL_PLAYERS as S, TIME_BETWEEN_GAMES as T, JERSEYS as U, DEFAULT_STADIUM_CAPACITY as V, WEBSITE_ROOT as W, DEFAULT_DIVS as X, EXHIBITION_GAME_SETTINGS as Y, gameAttributesKeysGameState as Z, gameAttributesKeysTeams as _, SPORT_HAS_LEGENDS as a, TWITTER_HANDLE as a0, gameAttributesCache as a1, SUBREDDIT_NAME as b, GAME_NAME as c, GRACE_PERIOD as d, defaultGameAttributes as e, bySport as f, PHASE_TEXT as g, PLAYER_STATS_TABLES as h, isSport as i, TEAM_STATS_TABLES as j, POSITIONS as k, DAILY_SCHEDULE as l, PLAYER_GAME_STATS$1 as m, getCols as n, PLAYER as o, PLAYER_GAME_STATS$3 as p, PLAYER_GAME_STATS as q, MOOD_TRAITS as r, POSITION_COUNTS as s, teamInfos as t, POS_NUMBERS_INVERSE as u, NUM_OUTS_PER_INNING as v, ACCOUNT_API_URL as w, STRIPE_PUBLISHABLE_KEY as x, WEBSITE_PLAY as y, DIFFICULTY as z };
