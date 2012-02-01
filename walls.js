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
 * 
 * Command in Minecraft to use:
 * 
 * /cs walls [players] <type>
 * [players] = number of players in the game
 * <type> = material type for the wall
 * 
 */

importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);
importPackage(Packages.com.sk89q.worldedit.regions);

// API list for these packages can be found at
// http://www.sk89q.com/docs/worldedit/api/

var blocks = context.remember();

context.checkArgs(2, 2, "[players] <type>"); 

/*
 * checkArgs checks to make sure that there are enough but not too many
 * arguments provided by the player.
 * 
 * checkArgs(min,max,usage string)
 * 
 * Here we expect two inputs exactly in the format of the usage string
 */

var players = parseInt(argv[1]); 			// Parses the player number
var blocktype = context.getBlock(argv[2]); 	// Parses the block type
//var origin = player.getPosition(); // read in the block the player is standing on 
var origin = new Vector(0,0,0);
var size = players * 10; //Sets the +/- of the border
var RaftorSize = 15; //Sets the width of the Raftors. 
//Ideal for clean Minecraft map. RaftorSize = 150
var floor = 90; // floor height

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

//Confirmed to work
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
            blocks.setBlock(Vector(x+5*p[i],y+1,z+5*p[j]),glass);
            blocks.setBlock(Vector(x+5*p[i],y+2,z+5*p[j]),glass);
        }
    }
}

//Confirmed to work
//Returns a vector rotated 90 degrees from Minecraft's top view
function VectorRotate(inVector,numberOfRotations)
{
    var newx;
    var newz;
    if(numberOfRotations%2==0){
        newx = inVector.getX();
        newz = inVector.getZ();
    }else{
        newx = -inVector.getZ();
        newz = inVector.getX();
    }
    if(numberOfRotations%4>=2){
        newx = -newx;
        newz = -newz;
    }    
    return Vector(newx, inVector.getY(),newz);
}

//confirmed to work
function SpawnChest(Location, Items)
//Places a chest and populates it with items
/* Example Usage
 * var Map0 = new BaseItemStack(358, 1);
 * var ChestPos = new Vector(121,65,117)
 * SpanChest(ChestPos,Map0);

 */
{
	var items = [Items]
	var block = BaseBlock(ChestBlock(1,items));
	blocks.setBlock(Location,block);

}

//confirmed to work
function MakeSpawnRoom(x,y,z,direction){
    //0 = north, 1=east, 2=south, 3=west (in terms of what direction you look into the door)
    var dir = [[0,-1],[1,0],[0,1],[-1,0]];//Mappings for unit vectors for these directions
    var baseVec = new Vector(x,y,z);
    blocks.setBlock(baseVec,BaseBlock(BlockID.BEDROCK));
    //Set the two relative vectors for a north room's cuboid
    var vecMod1 = new Vector(-3,0,-1);
    var vecMod2 = new Vector(3,6,-6);
    
    //Define a cuboid region that is the spawn point
    var cuboid = new CuboidRegion(baseVec.add(VectorRotate(vecMod1,direction)),
                                  baseVec.add(VectorRotate(vecMod2,direction)));
    //Clear the entire thing with air
    blocks.setBlocks(cuboid,BaseBlock(BlockID.AIR));
    //Make every face bedrock
    blocks.makeCuboidFaces(cuboid,BaseBlock(BlockID.BEDROCK));
    
    //Relative vectors for the 3 internal objects
    var torch1 = new VectorRotate(Vector( 1,2,-2),direction);
    var torch2 = new VectorRotate(Vector(-1,2,-2),direction);
    var chest  = new VectorRotate(Vector(-1,1,-2),direction);

    //Place 2 torches
    blocks.setBlock(torch1.add(baseVec),BaseBlock(BlockID.TORCH));
    blocks.setBlock(torch2.add(baseVec),BaseBlock(BlockID.TORCH));
    //Place the chest with a map in it
    var Map0 = new BaseItemStack(358, 1);
    SpawnChest(chest.add(baseVec),Map0);
}

//confirmed to work
function Spawner(StartX, StartZ)
// For now, creates a block one above the first non-air block it encounters
// of type "blocktype"

// Example: Spawner(0,0);
// Spanws a block on the ground at 0,0
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

//confirmed to work
function Floor(blocktype, StartX, StartZ)
// Creates a floor of bedrock, three blocks of air, and then a glowstone floor.
{
	var b = blocktype;
	for(var x = -StartX; x<=StartX; x++){
		for(var z = -StartZ; z<=StartZ; z++){
			for(var y = floor; y>=floor-4; y--){
				
				if (y == floor){ //Adds bedrock floor
					b = BaseBlock(BlockID.BEDROCK);
				}else
					if (y == floor-1 || y == floor-2 || y == floor-3){ //Adds three layers of air
						b = BaseBlock(BlockID.AIR);
					}else{
						
						b = BaseBlock(BlockID.LIGHTSTONE); //Adds layer of glowstone below the air
					}				
				var vec = new Vector(x, y, z);
				blocks.setBlock(vec, b);
			}
		}
	}
}

//Function execution

//Notes:
//+X == East
//+Y == Up
//+Z == South

//Wall(blocktype,StartX,StartZ,mySize,isInXdirection);
Wall(blocktype,origin.getX()-size,origin.getZ()-size,size+size+1,1); // North
Wall(blocktype,origin.getX()-size,origin.getZ()+size,size+size+1,1); // South
Wall(blocktype,origin.getX()+size,origin.getZ()-size,size+size+1,0); // East
Wall(blocktype,origin.getX()-size,origin.getZ()-size,size+size+1,0); // West

//Raftor(blocktype,StartZ,StartX,mySize,isInXdirection);
Raftor(blocktype,origin.getZ()-size-RaftorSize ,origin.getX()-size-RaftorSize ,size,0); // SW
Raftor(blocktype,origin.getZ()+size            ,origin.getX()-size            ,size,0); // NE
Raftor(blocktype,origin.getZ()-size-RaftorSize ,origin.getX()+size            ,size,1); // NW
Raftor(blocktype,origin.getZ()-size            ,origin.getX()-size-RaftorSize ,size,1); // SE

Floor(blocktype, size, size);

player.print ("Done");

//for(var i=0;i<20;i++)
//{
//    blocks.setBlock(VectorRotate(Vector(0.5,85+i,0.5),i),BaseBlock(BlockID.LIGHTSTONE));
//}//Makes a spiral staircase of lightstone around the origin
