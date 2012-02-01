// $Id$
/*
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
var RaftorSize = 15; //Sets the width of the Raftors. 
//Ideal for clean Minecraft map. RaftorSize = 150

//Examples:
//Confirmed to work
//blocks.setBlock(Vector(0,65,0),BaseBlock(BlockID.BEDROCK));

//Functions
//Confirmed to work
function Wall(blocktype,StartX,StartZ,mySize,isInXdirection)
//if(isInXdirection==1), then builds in the +X direction (East)
//otherwise in the +Z direction (South)
{
    if(isInXdirection==1){
        var z=StartZ;
        for(var x = StartX;x<mySize+StartX;x++) {
            for (var y = 0; y < 127; y++) {
                var vecE = new Vector(x, y, z);
                blocks.setBlock(vecE, blocktype);
            }
        }
    }else{
        var x=StartX;
        for(z = StartZ;z<mySize+StartZ;z++) {
            for (var y = 0; y < 127; y++) {
                var vecE = new Vector(x, y, z);
                blocks.setBlock(vecE, blocktype);
            }
        }
    }
}

function Raftor(blocktype, StartZ, StartX, mySize, isInXdirection)
//if(isInXdirection==1), then builds in the +X direction (East)
//otherwise in the +Z direction (South)
{
    if(isInXdirection==1){
        for(var x = StartX;x<=StartX+RaftorSize;x++) {
            for(var z = StartZ;z<=StartZ+RaftorSize+(2*size);z++) {
                var vecE = new Vector(x, 126, z);
                blocks.setBlock(vecE, blocktype);
            }
        }
    }else{
        for(var z = StartZ;z<=StartZ+RaftorSize;z++) {
            for(var x = StartX;x<=StartX+RaftorSize+(2*size);x++) {
                var vecE = new Vector(x, 126, z);
                blocks.setBlock(vecE, blocktype);
            }
        }
    }
}

//Confirmed to work
function SquareXZ(blocktype,radius,x,y,z)
//Makes a (1+2*radius) sized square centered at x,y,z.  radius==0 means 1x1, r=1 means 3x3, so on...
{
    for(var i=x-radius;i<=x+radius;i++){
        for(var j=z-radius;j<=z+radius;j++){
            blocks.setBlock(Vector(i,y,j),blocktype);
        }
    }
}

//Confirmed to work
function MakePavillion(x,y,z){
    SquareXZ(BaseBlock(BlockID.MOSSY_COBBLESTONE),5,x,y,z);
    SquareXZ(BaseBlock(BlockID.BEDROCK),2,x,y,z);
    SquareXZ(BaseBlock(BlockID.AIR),5,x,y+1,z);
    SquareXZ(BaseBlock(BlockID.AIR),5,x,y+2,z);
    SquareXZ(BaseBlock(BlockID.BEDROCK),5,x,y+3,z);
    SquareXZ(BaseBlock(BlockID.BEDROCK),5,x,y+4,z);
    SquareXZ(BaseBlock(BlockID.BEDROCK),5,x,y+5,z);
    //SquareXZ(BaseBlock(BlockID.LAVA),4,x,y+4,z);
    SquareXZ(BaseBlock(BlockID.LAVA),4,x,y+5,z);
    var p = [-1,1];
    var torch = new BaseBlock(BlockID.TORCH);
    var glass = new BaseBlock(BlockID.GLASS);
    for(i in p){
        for(j in p){
            //add torches (1)
            blocks.setBlock(Vector(x+2*p[i],y+1,z+2*p[j]),torch);
            //add glass (2)
            blocks.setBlock(Vector(x+2*p[i],y+1,z+2*p[j]),glass);
            blocks.setBlock(Vector(x+5*p[i],y+2,z+5*p[j]),glass);
        }
    }
}

function Spawner(StartX, StartZ)
// For now, creates a block one above the first non-air block it encounters
// of type "blocktype"
{
	var vecC = new Vector(StartX, 126, StartZ); //initializing variables
	var y = 127;
	var airCheck = true;
	var block = blocks.getBlockType(vecC);
	while (airCheck==true){ //while the block in question is air, the loop continues down
		y=y-1;
		vecC = Vector(StartX, y, StartZ);
		block = blocks.getBlockType(vecC);
		
		if (block != BlockID.AIR) {
			airCheck = false;
		}
	 }
	y = y+1; // sets the block to be places above the not-air block encountered
	vecC = Vector(StartX, y, StartZ);
	blocks.setBlock(vecC, blocktype);
}
//Function execution

//Notes:
//+X == East
//+Y == Up
//+Z == South

//Wall(blocktype,StartX,StartZ,mySize,isInXdirection);
Wall(blocktype,-size,-size,size+size+1,1);//North
Wall(blocktype,-size,size,size+size+1,1);//South
Wall(blocktype,size,-size,size+size+1,0);//East
Wall(blocktype,-size,-size,size+size+1,0);//West

Raftor(blocktype, -size - RaftorSize, -size - RaftorSize, size, 0);
Raftor(blocktype, size, -size, size, 0);
Raftor(blocktype, -size - RaftorSize, size, size, 1);
Raftor(blocktype, -size, -size - RaftorSize, size, 1);

Spawner(0,0);

