# MMM-PGA

This a module for MagicMirror <br>
https://magicmirror.builders <br>
https://github.com/MichMich/MagicMirror



A Magic Mirror Module to show Upcoming PGA Tournament. Once the tournament starts a configurable Leader Board will be shown along with scores from your favorite golfers.

This module is in the initial phase of development and this is the initial release. Please let me know of any issues that you find.


## Upcoming Tournament View

![image](https://user-images.githubusercontent.com/71428005/94088698-247e1b00-fddf-11ea-9232-2c555c945dc1.png)


## Leader Board View
![image](https://user-images.githubusercontent.com/71428005/94298939-ef83dc80-ff34-11ea-9f0b-428a918f580d.png)




## MY Favorites View

![image](https://user-images.githubusercontent.com/71428005/94299058-1e01b780-ff35-11ea-951d-2ed47e4cc2e5.png)



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
`favorites`| Array of playerids to show on the My Favorites Board. All the players in the Favorites array will be displayed on the board. See section below on how to find the playerid of your favorite players <br> <br> _Type:_ `Array` of playerids `String` <br> Defaults to an empty array.


# Example Configuration

```
{
	module: 'MMM-PGA',
	position: 'top_left',
	maxWidth: "100%",
	config: {
		colored: true,
		showBoards: true,
		numLeaderboard: 5,
		maxLeaderboard: 8,
		includeTies: true,
		showLogo: true,
		favorites: [ "462", "1059", "9002", "11456"]
	}
},	
```


# Getting the Player ID of your favorite players

1. Goto to http://www.espn.com/golf/players
1. Find the player you want to add to your favorites
1. Click on the player name
1. The id will show up in the url. For example the url for Tiger Woodsis http://www.espn.com/golf/player/_/id/462/tiger-woods His player ID would be 462

# Planned Enhancements

* Multiple Favorite Boards. This would support the following scenarios
  * You have a lot of favorite players and dont want the module taking up a lot or real estate on your Magic Mirror
  * You could have a list of favorite players and a list of your Fantasy Golf team for the week
* When a tournament is not Active have the ability to show more than just the next tournament. It would display the next N tournaments
* Have abilty to show more tournament details i.e. Defending Champ Purse etc.
* When there is not an active tournament show World Golf raking and maybe Fedex Cup Standings (need to find a data provider)
