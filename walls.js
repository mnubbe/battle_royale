// $Id$
/*
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/*

Command in Minecraft to use:

/cs walls [players] <type>
[players] = number of players in the game
<type> = material type for the wall

*/

importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);

var blocks = context.remember();

context.checkArgs(1, 2, "[players] <type>"); // From observing other code, 1 starts this, 
              //and the 2 was necessary based on observing code with other argument numbers

var players = parseInt(argv[1]); //Parses the player number

var blocktype = context.getBlock(argv[2]); // Parses the block type

var size = players * 10; //Sets the +/- of the border


//Functions
function Wall(blocktype,StartZ,StartX,mySize,isInXdirection)
//if(isInXdirection==1), then builds in the +X direction (East)
//otherwise in the +Z direction (South)
{
    if(isInXdirection==1){
        var z=StartZ;
        for(var x = StartX;x<mySize;x++) {
            for (var y = 0; y < 127; y++) {
                var vecE = new Vector(x, y, z);
                blocks.setBlock(vecE, blocktype);
            }
        }
    }else{
        var x=StartX;
        for(z = StartZ;z<mySize;x++) {
            for (var y = 0; y < 127; y++) {
                var vecE = new Vector(x, y, z);
                blocks.setBlock(vecE, blocktype);
            }
        }
    }
}


//North Wall

var x = -size; //Begins wall construction at -x, goes up at Y from 0 to 126, moves to -x + 1,
               //repeats until hitting x

for (x; x < size; x++) {
   for (var y = 0; y < 127; y++) {
        var vecN = new Vector(
             x, y, size);
             
        blocks.setBlock(vecN, blocktype);
   }          
}   

//East Wall

var z = -size; //Begins wall construction at -z, goes up y from 0 to 126, moves to -z + 1, 
               //repeat until hitting z

for (z; z <= size; z++) {
     for (y = 0; y < 127; y++) {
        var vecE = new Vector(
             size, y, z);
             
        blocks.setBlock(vecE, blocktype);     
     }
}     

//South Wall

var x = -size; //Begins wall construction at -x, goes up at Y from 0 to 126, moves to -x + 1, 
               //repeats until hitting x

for (x; x < size; x++) {
   for (var y = 0; y < 127; y++) {
        var vecS = new Vector(
             x, y, -size);
             
        blocks.setBlock(vecS, blocktype);
   }          
}  

//West Wall

var z = -size; //Begins wall construction at -z, goes up y from 0 to 126, moves to -z + 1, 
               //repeat until hitting z

for (z; z < size; z++) {
     for (y = 0; y < 127; y++) {
        var vecW = new Vector(
             -size, y, z);
             
        blocks.setBlock(vecW, blocktype);     
     }
}
