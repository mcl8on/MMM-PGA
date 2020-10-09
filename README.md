# MMM-PGA

This a module for MagicMirror <br>
https://magicmirror.builders <br>
https://github.com/MichMich/MagicMirror





A Magic Mirror Module to show Upcoming PGA Tournaments. Once the tournament starts a configurable Leader Board will be shown along with scores for your favorite golfers.


# Version 2 Release Notes

Whats New?

- Added the abilty to show a player country flag next to the name on the leaderbords. See Configuration on how to hide or show the flags.
- Added the ability to show multiple upcoming tournaments when there is not a Tournament in progress.
- Added the ability to have multiple favorite boards. Favorites configuration has changed instead of an array of player ids. It is now an array of objects. See configuration for details.
- Added players.md file that can be used to lookup players ids for the favorite boards. If the player is not in the file you can always look up the id on ESPN.
- Changed the tournament information layout. Added purse information and the ability to hide the location information.
- If colored is false and showLogo is true the PGA logo will appear in grayscale.
- Changed layout so module appears correctly on the right side of the Magic Mirror.
- Made all data retrievals to occur on the server side. Less traffic when running multiple magic mirror clients.
- Code refactoring 

# Screen Shots

## Upcoming Tournament View

### With Location

![image](https://user-images.githubusercontent.com/71428005/95587946-beb1a600-0a10-11eb-8b29-eab31d933889.png)

### No Locations

![image](https://user-images.githubusercontent.com/71428005/95589323-93c85180-0a12-11eb-9e4c-7490d6b66e82.png)

## Leader Board View

### Color With Flags
![image](https://user-images.githubusercontent.com/71428005/95588470-75ae2180-0a11-11eb-9be7-98adb26da4ee.png)


### No Color With Flag

![image](https://user-images.githubusercontent.com/71428005/95588647-ab530a80-0a11-11eb-8db8-7fca1df502d0.png)



## MY Favorites View No Flags
![image](https://user-images.githubusercontent.com/71428005/95589119-4fd54c80-0a12-11eb-9c99-b4f65b736bad.png)




# Installation

1. Navigate into the MagicMirror/modules and execute
1. Execute git clone https://github.com/mcl8on/MMM-PGA

# Configuration

Option|Description
------|-----------
`colored`| Whether to display colors. The fields  in the module that will display color are the Score and the Leader Board table headers <br> <br> _Type:_ `Boolean` <br> Defaults to true
`numTournaments` | Number of upcoming tournaments to show when there is not an active tournment in progress or  `showBoards` is set false. <br> <br> _Type:_`Number`<br>Defaults to 3
`showLocation`| Whether to show the location of the tournament in the tournament details header. If set to true the location will appear under the tournament name.<br><br>_Type:_ `Boolean`<br>Defaults to true
`showBoards`| Whether to show the Leaderboard and favorites for and Active tournament. If set to false the module will just show the current tournament. See Upcoming tournament screen shot above. <br> <br> _Type:_ `Boolean`<br> Defaults to true
`numLeaderboard`| The amount of places to show on the leaderboard<br> <br> _Type:_ `Number` <br> Defaults to 5
`maxLeaderBoard`| The maximum number of players to show on the leaderboard. For example if `numLeaderboard` is set to 5 and `maxLeaderboard` is set to 10 <br> * If there are currently 9 players in the top 5 with ties then 9 players will be displayed <br> * If there are 12 players in the top 3 only 10 players will be shown and the last two players tied for 3rd will not be displayed. The order of the players is determined by the Data provider(ESPN) <br>  <br> _Type:_ `Number`<br> Defaults to 10
`includeTies`| Whether to include more than `numLeaderboard` players due to ties. If false only `numLeaderboard` players will be shown and `maxLeaderboard` will be irrelevant. <br> <br> _Type:_ `Boolean`<br> Defaults to true
`showLogo`| Shows the PGA logo in the header<br><br>_Type:_ `Boolean` <br>Defaults to false
`showFlags`| Shows the flag of the players country next to the player in the leaderboards<br><br>_Type:_ `Boolean` <br> Defaults to false
`favorites`| Array of favorite boards to show. Each favorite board has a headerName and a favoriteList an array of player ids(String). See sample configuration for details. All the players in the favorite board object will be displayed on the board if they are playing in the current tournament. See section below on how to find the playerid of your favorite players <br> <br> _Type:_ `Array` of favorite board `[ Object ]` <br> Defaults to an empty array.


# Example Configuration

```
{
	module: 'MMM-PGA',
	position: "top_left",
	maxWidth: "100%",
	config: {
		colored: true,
		showBoards: true,
		showLocation: true,
		numTournaments: 3,
		numLeaderboard: 5,
		maxLeaderboard: 10,
		includeTies: true,
		showLogo: true,
		showFlags: true,
		favorites: 	[	
			{ headerName: "My Favorites",
			  favoriteList: ["462", "1059", "9002", "11456", "9478"]},
			{ headerName: "Some Other Guys",
			  favoriteList: ["462","110","4780" ]},
		],
	}
},	
	
```


# Getting the Player ID of your favorite players

## Option 1

A file is included (players.md) with a list of players along with their associated id.

## Option 2

if you cannot find the id in the file you can always look up a player online.

1. Goto to http://www.espn.com/golf/players
1. Find the player you want to add to your favorites
1. Click on the player name
1. The id will show up in the url. For example the url for Tiger Woodsis http://www.espn.com/golf/player/_/id/462/tiger-woods His player ID would be 462

# Planned Enhancements

* When there is not an active tournament have the abilty to show World Golf raking and Fedex Cup Standings along with the upcoming tournaments (rotating).
* Dynamically update the Favorite boards without having to change values in config, Possibly read favorites fron a file instead of config and allow update via curl. Investigating the best way to do this.
