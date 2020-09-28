
const HISCORE_PROFILE = [
    'Overall',
    'Attack',
    'Defence',
    'Strength',
    'Hitpoints',
    'Ranged',
    'Prayer',
    'Magic',
    'Cooking',
    'Woodcutting',
    'Fletching',
    'Fishing',
    'Firemaking',
    'Crafting',
    'Smithing',
    'Mining',
    'Herblore',
    'Agility',
    'Thieving',
    'Slayer',
    'Farming',
    'Runecrafting',
    'Hunter',
    'Construction',
    'League Points',
    'Bounty Hunter - Hunter',
    'Bounty Hunter - Rogue',
    'Clue Scrolls (all)',
    'Clue Scrolls (beginner)',
    'Clue Scrolls (easy)',
    'Clue Scrolls (medium)',
    'Clue Scrolls (hard)',
    'Clue Scrolls (elite)',
    'Clue Scrolls (master)',
    'LMS - Rank',
    'Abyssal Sire',
    'Alchemical Hydra',
    'Barrows Chests',
    'Bryophyta',
    'Callisto',
    'Cerberus',
    'Chambers of Xeric',
    'Chambers of Xeric: Challenge Mode',
    'Chaos Elemental',
    'Chaos Fanatic',
    'Commander Zilyana',
    'Corporeal Beast',
    'Crazy Archaeologist',
    'Dagannoth Prime',
    'Dagannoth Rex',
    'Dagannoth Supreme',
    'Deranged Archaeologist',
    'General Graardor',
    'Giant Mole',
    'Grotesque Guardians',
    'Hespori',
    'Kalphite Queen',
    'King Black Dragon',
    'Kraken',
    "Kree'Arra",
    "K'ril Tsutsaroth",
    'Mimic',
    'Nightmare',
    'Obor',
    'Sarachnis',
    'Scorpia',
    'Skotizo',
    'The Gauntlet',
    'The Corrupted Gauntlet',
    'Theatre of Blood',
    'Thermonuclear Smoke Devil',
    'TzKal-Zuk',
    'TzTok-Jad',
    'Venenatis',
    "Vet'ion",
    'Vorkath',
    'Wintertodt',
    'Zalcano',
    'Zulrah'
]

let skillsTable = document.getElementById('skillTableBody')
let otherTable = document.getElementById('otherTableBody')

async function getData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'text/html'
        },
    });

    if(response.status !== 200){
        throw `Status ${(await response).status} returned`
    }

    return response.text();
}

//Used to override ternary expression requirement for throw
function _throw(error) {throw error}

function parseStats(data){
    let stats_list = [];
    data.split('\n').filter(line => line !== '').forEach(element =>{
        let stats = element.split(',')
        let entry = []
        stats.length == 3 
            ? entry = ['Rank','Level','Experience'] 
            : stats.length == 2
                ? entry = ['Rank','Level']
                : _throw(`Improper data structure in parseData, length: ${stats.length} \n stats: ${stats}`)
        stats_list.push(Object.fromEntries(entry.map((_, i) => [entry[i], stats[i]])))
    });
    return stats_list
}

function buildTable(data){
    Object.entries(data).forEach(([key, value]) => {
        Object.keys(value).length == 3
            ? newRow = skillsTable.insertRow(-1)
            : Object.keys(value).length == 2
                ? newRow = otherTable.insertRow(-1)
                : _throw(`Error: Unknown Data Structure In buildTable: \n Key: ${key} \n Value: ${value}`)
        newRow.insertCell(-1).appendChild(document.createTextNode(key))
        Object.entries(value).forEach(([key, value]) => {
            newRow.insertCell(-1).appendChild(document.createTextNode(value));
        })
    })
}

function getProfile(username){
    getData(`https://cors-anywhere.herokuapp.com/secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${username}`)
    .then(data => {
        let results = Object.fromEntries(HISCORE_PROFILE.map((_, i) => [HISCORE_PROFILE[i], parseStats(data)[i]]))
        buildTable(results)
    })
    .catch(error => console.log(error))
}
