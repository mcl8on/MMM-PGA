# MMM-PGA

This a module for MagicMirror <br>
https://magicmirror.builders <br>
https://github.com/MichMich/MagicMirror





A Magic Mirror Module to show Upcoming PGA Tournaments. Once the tournament starts a configurable Leader Board will be shown along with scores for your favorite golfers.


# Version 2.1 Release Notes

Whats New?

- Added the player score for the current round to the leaderboards
- Added an arrow indicator in the leaderboards if the player was invovled in a playoff
- When a tournamnet is not active show rotate between upcoming tournaments, FedEx Cup Standings and Official World Golf Rankings
- Added an option to read the favorite information from a remote location. The favorites file can be read from a web location or from a file stored in the MMM-PGA directory.
- Added ability to send a post via curl to MM to update the favorites. This option is only available if using a remote file to store favaorites. This allows you to change the favorites without restarting the Magic Mirror.
- Added an option to display larger fonts. The standard option is for fonts to be displayed using the standard MM style xsmall. If the larger font option is chosen the small MM style will be used.
- Created an option to hide the purse. If a larger font is chosen hiding the purse can lead to a cleaner display
- Added a more detail status to the leader board header
- Cleaned up Header to use standard MM header style. 
- Code refactoring


# Screen Shots

## Upcoming Tournament View

### With Location

![image](https://user-images.githubusercontent.com/71428005/95587946-beb1a600-0a10-11eb-8b29-eab31d933889.png)

### No Locations

![image](https://user-images.githubusercontent.com/71428005/95589323-93c85180-0a12-11eb-9e4c-7490d6b66e82.png)

### Fedex Cup Standings
![image](https://user-images.githubusercontent.com/71428005/97656396-c37cdf00-1a3d-11eb-81e9-ed8a23b3af96.png)

### OWGR with Large Font

![image](https://user-images.githubusercontent.com/71428005/97656777-a85e9f00-1a3e-11eb-95e8-8b6e8a7d49dc.png)

## Leader Board View

### Color With Flags Large Font
![image](https://user-images.githubusercontent.com/71428005/97656946-0c816300-1a3f-11eb-9f81-fa0de18eb2bc.png)


### No Color With Flag

![image](https://user-images.githubusercontent.com/71428005/97657099-684bec00-1a3f-11eb-8fd3-3383f4c6567f.png)



## My Favorites View No Flags No Purse
![image](https://user-images.githubusercontent.com/71428005/97657300-e7412480-1a3f-11eb-98ed-8eab0902eea3.png)





# Installation

1. Navigate into the MagicMirror/modules and execute
1. Execute git clone https://github.com/mcl8on/MMM-PGA

# Configuration

Option|Description
------|-----------
`colored`| Whether to display colors. The fields  in the module that will display color are the Score and the Leader Board table headers <br> <br> _Type:_ `Boolean` <br> Defaults to true
`numTournaments` | Number of upcoming tournaments to show when there is not an active tournment in progress or  `showBoards` is set false. <br> <br> _Type:_`Number`<br>Defaults to 3
`showLocation`| Whether to show the location of the tournament in the tournament details header. If set to true the location will appear under the tournament name in a smaller lighter font.<br><br>_Type:_ `Boolean`<br>Defaults to true
`showPurse`| Whether to show the purse information in the tournament details header. If using a larger font hiding the purse leads to a cleaner format of the tournament details.<br><br>Type: `Boolean`<br>Defaults to true
`showRankings`| Whether to show FedEx Cup standings and Official World Go;g Rankings when a tournament is not active. If set to true the module will rotate between the upcoming tournaments, FedEx Cup, and OWGR. <br><br>Type: `Boolean`<br>Defaults to true
`numRankings`| The amount players to show in the Fedex Cup and OWGR rankings. The number should be set between 1 and 50.<br><br>Type: `Number`<br>Defaults to 5
`showBoards`| Whether to show the Leaderboard and favorites for and Active tournament. If set to false the module will just show the current tournament. See Upcoming tournament screen shot above. <br> <br> _Type:_ `Boolean`<br> Defaults to true
`numLeaderboard`| The amount of places to show on the leaderboard<br> <br> _Type:_ `Number` <br> Defaults to 5
`maxLeaderBoard`| The maximum number of players to show on the leaderboard. For example if `numLeaderboard` is set to 5 and `maxLeaderboard` is set to 10 <br> * If there are currently 9 players in the top 5 with ties then 9 players will be displayed <br> * If there are 12 players in the top 3 only 10 players will be shown and the last two players tied for 3rd will not be displayed. The order of the players is determined by the Data provider(ESPN) <br>  <br> _Type:_ `Number`<br> Defaults to 10
`includeTies`| Whether to include more than `numLeaderboard` players due to ties. If false only `numLeaderboard` players will be shown and `maxLeaderboard` will be irrelevant. <br> <br> _Type:_ `Boolean`<br> Defaults to true
`showLogo`| Shows the PGA logo in the header<br><br>_Type:_ `Boolean` <br>Defaults to false
`showFlags`| Shows the flag of the players country next to the player in the leaderboards<br><br>_Type:_ `Boolean` <br> Defaults to false
`largerFonts`| Whether to display larger fonts for the module. If set to false it will use the `xsmall` style define by Magic Mirror. If set to true it will use the `small` style defined by Magic Mirror. <br><br>Type: `Boolean`<br>Defaults to false
`favorites`| Array of favorite boards to show. Each favorite board has a headerName and a favoriteList an array of player ids(String). See sample configuration for details. All the players in the favorite board object will be displayed on the board if they are playing in the current tournament. See section below on how to find the playerid of your favorite players <br> <br> _Type:_ `Array` of favorite board `[ Object ]` <br> Defaults to an empty array.
`remoteFavoritesFile`| Location of a remote File to use for favorites. The format of the file is a json file with exactly what you would set in the favorites configuration. If this option is set the favorites defined in the config will be ignored. If you chose to read the file from the internet the format will be a url. <br><br>For example reading the file from dropbox would look something like this <br> `"https://dl.dropboxusercontent.com/s/7########favorites.json"` <br><br>If using a local file setting would look like this <br> `"utilities/favorites.json"` <br> where the favorites file is stored in a directory name utilities under the MMM-PGA folder<br><br>Type: String containing url to favorites file.<br> Defaults to null


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
				numRankings: 10,
				numTournaments: 3,
				numLeaderboard: 5,
				maxLeaderboard: 10,
				includeTies: true,
				showLogo: true,
				showFlags: true,
				remoteFavoritesFile: "https://dl.dropboxusercontent.com/s/7my######/favorites.json" //"utilities/favorites.json" 
			}
		},	
	
```


# Remote Favorites

I like to change my favorite boards every week depending on who is playing, fantasy lineups, betting etc... So I wanted a way where I could update my favorites without having to change my config om my Magic Mirror. I also wanted the favorites to automatically be updated without having to restart my Mirror every time. I decided to add the abilty to send a post request to the MMM-PGA module that will cause it to reload the favorites information. I could have configured the module to just relaod favorite information eveyr 10 minutes or so but that would have been uneeded traffic. So if you update your remote favorites file the following command will cause MMM-PGA to relaod the favorites

`curl -X POST  http://localhost:8080/MMM-PGA-UpdateFavs` 

you can use localhost if running the command from the host wher the magic mirror is installed or you can add the ip address/hostname to the url and run it from any machine on your network. Make sure to configure your Magic Mirror to allow calls from other nmachine if doing this.

Because i did not want to update my file and then remember to run a curl request every time. I wrote i python script to check if my favorites file had changed and if it did it will send the appropriate post. I run this script in cron and it will automatifcally update my mirror every time the file changes. I have included the python script in the utilities directory under the MMM-PGA module. There is also a sample favorites.json file stored there.


With all that being said this is probally overkill. You can always just restart the mirror and it will reload the favorites on startup.

# Note on Flags

Because the data fot OWGR and Fedex Cup comes from different sources than the rest of the data in the module I had to create some pretty hookie code in order to display flags in the rankings. If i am unable to locate a flag for a player it will just display a white flag (I surender lol). I did some pretty extensive testing on this and I dont think it will happen often but if it becaomes an issue I will address it with a future release.



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

* Working on creating a web page that will allow me to update the favorites
* Need to allow logic to handle multiple events occuring at the same time. This is somewhat difficult to do now since it doesn't happen that often and I'm not sure what the data will look like
* Need to add logic for when a Tournament is played across multiple courses. 