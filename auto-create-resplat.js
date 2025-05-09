function FindReact(dom, traverseUp = 0) { //https://stackoverflow.com/a/39165137
    const key = Object.keys(dom).find(key=>{
        return key.startsWith("__reactFiber$") // react 17+
            || key.startsWith("__reactInternalInstance$"); // react <17
    });
    const domFiber = dom[key];
    if (domFiber == null) return null;

    // react <16
    if (domFiber._currentElement) {
        let compFiber = domFiber._currentElement._owner;
        for (let i = 0; i < traverseUp; i++) {
            compFiber = compFiber._currentElement._owner;
        }
        return compFiber._instance;
    }

    // react 16+
    const GetCompFiber = fiber=>{
        //return fiber._debugOwner; // this also works, but is __DEV__ only
        let parentFiber = fiber.return;
        while (typeof parentFiber.type == "string") {
            parentFiber = parentFiber.return;
        }
        return parentFiber;
    };
    let compFiber = GetCompFiber(domFiber);
    for (let i = 0; i < traverseUp; i++) {
        compFiber = GetCompFiber(compFiber);
    }
    return compFiber.stateNode;
}


function waitForElm(selector) { // https://stackoverflow.com/a/61511955
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

fetch('https://momentjs.com/downloads/moment.min.js')
    .then(response => response.text())
    .then(text => eval(text))
    .then(() => { 


let d = new Date(); // https://stackoverflow.com/a/33078673
d.setDate(d.getDate() + (((0 + 7 - d.getDay()) % 7) || 7)); // get next Sunday. will return the following Sunday even if it's currently a Sunday
// d.setDate(d.getDate() + (((0 + 7 - d.getDay()) % 7))); // uncomment this if you want to return the current date if already a Sunday

var startAt = moment(d).set("hour", 12).set("minute", 0).set("second", 0); //12pm
var endAt = moment(d).set("hour", 19).set("minute", 0).set("second", 0); //7pm

var startofResplat = moment("18-07-2021", "DD-MM-YYYY");
var numOfResplat = Math.floor(moment.duration(startAt.diff(startofResplat)).asWeeks());
numOfResplat = Math.floor(numOfResplat / 2); // fortnightly
numOfResplat -= 9; //offset

FindReact(document.querySelectorAll('[name="name"]')[0].parentElement.parentElement.parentElement).changeValue("Respawn Platform " + numOfResplat + " - " + startAt.format("DD/MM/YYYY"));

inputFields = document.getElementsByClassName("mui-dzz0xc"); // this sucks

FindReact(inputFields[0].children[0]).changeValue("discord");
FindReact(inputFields[1].children[0]).changeValue("https://discord.gg/4sP2weDDHm");

FindReact(inputFields[2].children[0]).changeValue(startAt);
FindReact(inputFields[3].children[0]).changeValue(endAt);

document.getElementsByClassName("sgg1USfM")[0].children[0].children[0].click(); // this sucks

waitForElm('.Select--single:not(.is-loading)').then((elm) => {
	var prevTournaments = document.getElementsByClassName("Select--single")[0]; // this sucks
	var options = FindReact(prevTournaments).props.options;
	var prevEvent = options.find(o => o.label.match("Platform " + (numOfResplat - 1)));
	
	FindReact(prevTournaments).setValue(prevEvent);
	
	document.querySelectorAll('[name="startAt"]')[0].value = startAt.format("MM/DD/yyyy hh:mm a"); // this is because while setting it works, it doesn't seem to update the actual input field in the react component so this fixes that (at least until the react component refresh and then it will disappear again sadly)
	document.querySelectorAll('[name="startAt"]')[0].required = false; // even after its disappeared its technically still in the input and it will submit successfully. removing the 'required' flag allows us to submit the form without the browser stopping us
	document.querySelectorAll('[name="endAt"]')[0].value = endAt.format("MM/DD/yyyy hh:mm a");	
	document.querySelectorAll('[name="endAt"]')[0].required = false;
});

waitForElm('.tournamentAdminProfile').then((elm) => {
	fetch("https://www.start.gg/api/-/gql", {
		"headers": {
			"client-version": "20"
		},
		"body": `
		[
			{
				"operationName":"TournamentPageHead",
				"variables":{
					"slug":"${window.location.href.split("https://www.start.gg/admin/tournament/")[1].split("/")[0]}"
				},
				"query":"query TournamentPageHead($slug: String!) { tournament(slug: $slug) { ...tournamentPageHead } } fragment tournamentPageHead on Tournament { id }"
			}
		]`,
		"method": "POST",
		"mode": "cors"
	}).then(response => response.json()).then((json) => {
		fetch("https://www.start.gg/api/-/gql", {
			"headers": {
				"client-version": "20"
			},
			"body": `
			[
				{
					"operationName":"UpdateBasicDetailsTournament",
					"variables":{
						"tournamentId":${json[0].data.tournament.id},
						"fields":{
							"shortSlug":"resplat${numOfResplat}"
						},
						"validationKey":"updateTournament"
					},
					"query": "mutation UpdateBasicDetailsTournament($tournamentId: ID!, $fields: UpdateBasicFieldsTournament!) { updateBasicFieldsTournament(tournamentId: $tournamentId, fields: $fields) {id ...detailsSettings } } fragment detailsSettings on Tournament { shortSlug }"
				}
			]`,
			"method": "POST",
			"mode": "cors"
		});
	});
});

console.log(`

**__Respawn Platform ${numOfResplat} - ${startAt.format("DD/MM/YYYY")}__**

Where: 9 Manners Street, Te Aro, Wellington.

Schedule: 
12:00pm - Guilty Gear: Strive, Rivals of Aether
12:30pm -  Street Fighter 6, Project +
2:00pm - Super Smash Bros. Ultimate, Tekken 8
3:30pm - Rivals of Aether II

Respawn Platform is Wellington's Super Smash Bros. Ultimate biweekly tournament series, featuring a singles bracket, Rivals of Aether I & II singles and Project+ singles. 

We also have fighting game brackets for the three biggest traditional fighting games in Wellington, Guilty Gear Strive, Street FIghter 6 and Tekken 8.

$10 entry fee, pay on site.

Sign up here: https://start.gg/resplat${numOfResplat}
`);

		
})
