import { openDB, addRecords } from "./libraries/IndexedDB_Wrapper_Promises/database.js"
import { DATABASE_NAME, upgradeDB, SKILLS, HISCORE_PROFILE, BOSS_KILLS, ACTIVITIES } from "./utilities.js"

window.onload = async function () {
  let skillsTable = document.getElementById("skillTableBody");
  let otherTable = document.getElementById("otherTableBody");
  let profileForm = document.getElementById("profileForm");
  let gamemode_dropdown = document.getElementById("gamemodeSelect");

  profileForm.addEventListener("submit", parseData);

  var database = await openDB(DATABASE_NAME, 1, upgradeDB)
    .then((result) => { return result })
    .catch((result) => { throw result });

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
    skillsTable.querySelectorAll("tbody tr").forEach((row) => {
      row.remove();
    });
    otherTable.querySelectorAll("tbody tr").forEach((row) => {
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
          document.getElementById("usernameHeader").innerHTML = `<span><img class="img-fluid" src="src/icons/Ultimate_ironman.png">${username}</span>`
          addRecords(database, 'records', [results])
            .then((results) => { console.log(results) })
            .catch((results) => { throw results });
        } catch (e) {
          throw (e)
        } finally {
        }
      })
      .catch((error) => {
        throw (error)
      });
  }

  async function getData(url = "") {
    const response = fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "text/html",
      },
    }).then(response => {
      if (response.status !== 200) {
        throw `Status ${(response).status} returned`;
      }
      return response.text();

    }).catch(reason => { throw reason });

    return await response;
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
      activity: {},
    };

    HISCORE_PROFILE.forEach((row, index) => {
      if (SKILLS.includes(row)) {
        list.skill[row] = stats_list[index];
      } else if (BOSS_KILLS.includes(row)) {
        list.boss[row] = stats_list[index];
      } else if (ACTIVITIES.includes(row)) {
        list.activity[row] = stats_list[index];
      } else {
        throw `Row: ${row} is not apart of the object with the value of ${stats_list[index]}`;
      }
    });

    return list;
  }

  function buildTable(data) {
    //skill,boss,game
    Object.entries(data).forEach(([key, values]) => {
      //skill/activity
      Object.entries(values).forEach(([entry, values2]) => {
        let newRow;
        //determine which table it falls under
        Object.keys(values2).length == 3
          ? (newRow = skillsTable.insertRow(-1))
          : Object.keys(values2).length == 2
            ? (newRow = otherTable.insertRow(-1))
            : _throw(
              `Error: Unknown Data Structure In buildTable: \n Key: ${key} \n Value: ${values2}`
            );
        newRow.className = entry;
        newRow.insertCell(-1).outerHTML = `<th scope="row">${entry}</th>`;

        //newRow.insertCell(-1).appendChild(document.createTextNode(entry));
        //rank:x,level/participation/experience
        Object.entries(values2).forEach(([col, value]) => {
          newRow.insertCell(-1).appendChild(document.createTextNode(value));
        });
      });
    });
  }
};
