#!/usr/bin/python


#Sample python script that will read your remote favorites file.
#It will see if the favorites file has changed (via a checksum) and if so it will send a
#post request to the MMM-PGA module to update the favorites. It give the ability to dynamically
#update your favorite list without having to restart the mirror. I placed the job in cron so
#that i can change my favorites on drop box share and not have to either restart the mirror or
#send an post via curl

import os
import hashlib
import time
import requests
import time


remotefile = "YOUR FILE HERE OR URL"
#File to store the previous checksum get update everytime a change is detected
oldchksumfile = "YOURPATH/oldchecksum.txt"  
url = "http://YOURHOST:8080/MMM-PGA-UpdateFavs"



## IF Using Local File Replace the two lines below with
# with open (remotefile,'r') as file:
#      data =file.read()
# curchksum = hashlib.md5(data).hexdigest()


#Generate chksum of the current fav file
curfile = requests.get(remotefile)
curchksum = hashlib.md5(curfile.content).hexdigest()

#Gets the previous checksum from the file
with open(oldchksumfile,'r') as file:
    oldchksum = file.read().replace('\n','')



#if chksum do not match
#   Update the checksum file
#   Send post to update mirror
t = time.localtime()
current_time = time.strftime("%H:%M:%S", t)
if oldchksum != curchksum:   
   
    print (current_time + " Update the Mirror")
    with open(oldchksumfile,"w") as file:
        file.write(curchksum)
    res = requests.post(url,"")
    t = time.localtime()
    current_time = time.strftime("%H:%M:%S", t)
    print (current_time + " Request Sent to Update Favorites res:" + res.text)
else:
    print (current_time + " No update needed")

