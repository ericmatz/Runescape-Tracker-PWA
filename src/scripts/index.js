const HISCORE_PROFILE = [
  "Overall",
  "Attack",
  "Defence",
  "Strength",
  "Hitpoints",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecrafting",
  "Hunter",
  "Construction",
  "League Points",
  "Bounty Hunter - Hunter",
  "Bounty Hunter - Rogue",
  "Clue Scrolls (all)",
  "Clue Scrolls (beginner)",
  "Clue Scrolls (easy)",
  "Clue Scrolls (medium)",
  "Clue Scrolls (hard)",
  "Clue Scrolls (elite)",
  "Clue Scrolls (master)",
  "LMS - Rank",
  "Abyssal Sire",
  "Alchemical Hydra",
  "Barrows Chests",
  "Bryophyta",
  "Callisto",
  "Cerberus",
  "Chambers of Xeric",
  "Chambers of Xeric: Challenge Mode",
  "Chaos Elemental",
  "Chaos Fanatic",
  "Commander Zilyana",
  "Corporeal Beast",
  "Crazy Archaeologist",
  "Dagannoth Prime",
  "Dagannoth Rex",
  "Dagannoth Supreme",
  "Deranged Archaeologist",
  "General Graardor",
  "Giant Mole",
  "Grotesque Guardians",
  "Hespori",
  "Kalphite Queen",
  "King Black Dragon",
  "Kraken",
  "Kree'Arra",
  "K'ril Tsutsaroth",
  "Mimic",
  "Nightmare",
  "Obor",
  "Sarachnis",
  "Scorpia",
  "Skotizo",
  "The Gauntlet",
  "The Corrupted Gauntlet",
  "Theatre of Blood",
  "Thermonuclear Smoke Devil",
  "TzKal-Zuk",
  "TzTok-Jad",
  "Venenatis",
  "Vet'ion",
  "Vorkath",
  "Wintertodt",
  "Zalcano",
  "Zulrah",
];

const SKILLS = [
  "Overall",
  "Attack",
  "Defence",
  "Strength",
  "Hitpoints",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecrafting",
  "Hunter",
  "Construction",
];

const BOSS_KILLS = [
  "Abyssal Sire",
  "Alchemical Hydra",
  "Barrows Chests",
  "Bryophyta",
  "Callisto",
  "Cerberus",
  "Chambers of Xeric",
  "Chambers of Xeric: Challenge Mode",
  "Chaos Elemental",
  "Chaos Fanatic",
  "Commander Zilyana",
  "Corporeal Beast",
  "Crazy Archaeologist",
  "Dagannoth Prime",
  "Dagannoth Rex",
  "Dagannoth Supreme",
  "Deranged Archaeologist",
  "General Graardor",
  "Giant Mole",
  "Grotesque Guardians",
  "Hespori",
  "Kalphite Queen",
  "King Black Dragon",
  "Kraken",
  "Kree'Arra",
  "K'ril Tsutsaroth",
  "Mimic",
  "Nightmare",
  "Obor",
  "Sarachnis",
  "Scorpia",
  "Skotizo",
  "The Gauntlet",
  "The Corrupted Gauntlet",
  "Theatre of Blood",
  "Thermonuclear Smoke Devil",
  "TzKal-Zuk",
  "TzTok-Jad",
  "Venenatis",
  "Vet'ion",
  "Vorkath",
  "Wintertodt",
  "Zalcano",
  "Zulrah",
];

const MINIGAMES = [
  "League Points",
  "Bounty Hunter - Hunter",
  "Bounty Hunter - Rogue",
  "Clue Scrolls (all)",
  "Clue Scrolls (beginner)",
  "Clue Scrolls (easy)",
  "Clue Scrolls (medium)",
  "Clue Scrolls (hard)",
  "Clue Scrolls (elite)",
  "Clue Scrolls (master)",
  "LMS - Rank",
];

window.onload = function () {
  let skillsTable = document.getElementById("skillTableBody");
  let otherTable = document.getElementById("otherTableBody");
  let profileForm = document.getElementById("profileForm");
  let usernameFormGroup = document.getElementById("usernameFormGroup");
  let userNameHelper = document.getElementById("usernameHelper");
  let gamemode_dropdown = document.getElementById("gamemodeSelect");

  profileForm.addEventListener("submit", parseData);

  /**
   * Determines the Hiscores API URL to use depending on selected gamemode
   * @param {string} gamemode
   * @param {string} username
   * @returns {string} Returns URL for related hiscore
   */
  function getAPIUrl(gamemode, username) {
    switch (gamemode) {
      case "Standard":
        return `https://cors-anywhere.herokuapp.com/secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${username}`;
      case "Ironman":
        return `https://cors-anywhere.herokuapp.com/secure.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player=${username}`;
      case "Hardcore Ironman":
        return `https://cors-anywhere.herokuapp.com/secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.ws?player=${username}`;
      case "Ultimate Ironman":
        return `https://cors-anywhere.herokuapp.com/secure.runescape.com/m=hiscore_oldschool_ultimate/index_lite.ws?player=${username}`;
      case "Deadman Mode":
        return `https://cors-anywhere.herokuapp.com/secure.runescape.com/m=hiscore_oldschool_deadman/index_lite.ws?player=${username}`;
      case "Seasonal":
        return `https://cors-anywhere.herokuapp.com/secure.runescape.com/m=hiscore_oldschool_seasonal/index_lite.ws?player=${username}`;
      case "Tournament":
        return `https://cors-anywhere.herokuapp.com/secure.runescape.com/m=hiscore_oldschool_tournament/index_lite.ws?player=${username}`;
      default:
        throw "Invalid gamemode provided";
    }
  }

  function parseData(event) {
    event.preventDefault();
    let username = profileForm.elements["username"].value;
    document.querySelectorAll("table tbody tr").forEach((row) => {
      row.remove();
    });
    getData(getAPIUrl(gamemode_dropdown.value, username))
      .then((data) => {
        let results = {};
        results["stats"] = parseStats(data);
        results["username"] = username;
        results["type"] = gamemode_dropdown.value;
        results["timestamp"] = Date.now();
        console.log(results);
        buildTable(results["stats"]);
        try {
          addRecord(results);
        } catch (e) {
          console.log(e);
        } finally {
        }
      })
      .catch((error) => {
        console.log(error);
        userNameHelper.classList.add("invalid");
        userNameHelper.innerHTML = "Invalid Username";
      });
  }

  async function getData(url = "") {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "text/html",
      },
    });

    if (response.status !== 200) {
      userNameHelper.classList.add("invalid");
      throw `Status ${(await response).status} returned`;
    }

    return response.text();
  }

  /**
   * Used to throw exceptions within ternary operators
   * @param {string} error
   */
  function _throw(error) {
    throw error;
  }

  function parseStats(data) {
    let stats_list = [];
    data
      .split("\n")
      .filter((line) => line !== "")
      .forEach((element) => {
        let stats = element.split(",");
        let entry = [];
        stats.length == 3
          ? (entry = ["Rank", "Level", "Experience"])
          : stats.length == 2
          ? (entry = ["Rank", "Participation"])
          : _throw(
              `Improper data structure in parseData, length: ${stats.length} \n stats: ${stats}`
            );
        stats = stats.map(function (stat) {
          return stat === "-1" ? 0 : parseInt(stat);
        });
        stats_list.push(
          Object.fromEntries(entry.map((_, i) => [entry[i], stats[i]]))
        );
      });

    let list = {
      skill: {},
      boss: {},
      game: {},
    };

    HISCORE_PROFILE.forEach((row, index) => {
      if (SKILLS.includes(row)) {
        list.skill[row] = stats_list[index];
      } else if (BOSS_KILLS.includes(row)) {
        list.boss[row] = stats_list[index];
      } else if (MINIGAMES.includes(row)) {
        list.game[row] = stats_list[index];
      } else {
        throw `Row: ${row} is not apart of the object`;
      }
    });

    return list;
  }

  function buildTable(data) {
    //skill,boss,game
    Object.entries(data).forEach(([key,values]) => {
      //skill/activity
      Object.entries(values).forEach(([entry,values2])=>{
        //determine which table it falls under
        Object.keys(values2).length == 3
        ? (newRow = skillsTable.insertRow(-1))
        : Object.keys(values2).length == 2
        ? (newRow = otherTable.insertRow(-1))
        : _throw(
            `Error: Unknown Data Structure In buildTable: \n Key: ${key} \n Value: ${values2}`
          );
        newRow.insertCell(-1).appendChild(document.createTextNode(entry));
        //rank:x,level/participation/experience
        Object.entries(values2).forEach(([col,value]) =>{
          newRow.insertCell(-1).appendChild(document.createTextNode(value));
        });
      });
    });

    // Object.entries(data).forEach(([key, value]) => {
    //   Object.keys(value).length == 3
    //     ? (newRow = skillsTable.insertRow(-1))
    //     : Object.keys(value).length == 2
    //     ? (newRow = otherTable.insertRow(-1))
    //     : _throw(
    //         `Error: Unknown Data Structure In buildTable: \n Key: ${key} \n Value: ${value}`
    //       );
    //   newRow.insertCell(-1).appendChild(document.createTextNode(key));
    //   //for each cell in row
    //   Object.entries(value).forEach(([key, value]) => {
    //     newRow.insertCell(-1).appendChild(document.createTextNode(value));
    //   });
    // });
  }
};
