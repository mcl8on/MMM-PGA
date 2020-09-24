# MMM-PGA

This a module for MagicMirror
https://magicmirror.builders/
https://github.com/MichMich/MagicMirror



Magic Mirror Module to show Upcoming PGA Tounament. Once the tounamnet starts a configurable Leader Board will be shown along with scores from your favorite golfers.

Upcoming Tounament View

![image](https://user-images.githubusercontent.com/71428005/94088698-247e1b00-fddf-11ea-9232-2c555c945dc1.png)


Leader Board View


Favorites View


# Installation

1. Navigate into the MagicMirror/modules and execute
1. Execute git clone https://github.com/mcl8on/MMM-PGA

# Configuration

Option|Description
------|-----------
`colored`| Whether to display colors. The fields  in the module that will display color are the Score and the Leader Board table headers <br> <br> _Type:_ `Boolean` <br> Defaults to true
`showBoards`| Whether to show the Leaderboard and favorites for and Active tounament. If set to false the module will just show the current tournament. See Upcoming tournamnet screen shot above. <br> <br> _Type:_ `Boolean`<br> Defaults to true
`numLeaderboard`| The amount of places to show on the leader board<br> <br> _Type:_ `Number` <br> Defaults to 5
`maxLeaderBoard`| The maximum nuber of players to show on the leaderboard. For example if `numLeaderboard` is set to 5 and `maxLeaderboard` is set to 10 <br> * If there are currently 9 players in the top 5 with ties then 9 players will be diplayed <br> * If there are 12 players in the top 3 only 10 players will be shown and the last two players tied for 3rd will not be displayed. The order of the players is determined by the Data provider(ESPN) <br>  <br> _Type:_ `Number`<br> Defaults to 10
`includeTies`| Whether to include more than `numLeaderboard` players due to ties. If false only `numLeaderboar` players will be shown and `maxLeaderboard will be irelevant. <br> <br> _Type:_ `Boolean`<br> Defaults to true
`favorites`| Array of playerids to show on the My Favorites Board. All the players in the Favorites array will be displayed on the board. See section below on how to find the playerid of your favorite players <br> <br> _Type:_ `Array` of playerids `String` <br> Defaults to an empy array.
`

