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
var origin = player.getPosition(); // read in the block the player is standing on 
//var origin = new Vector(0,0,0);
var size = 50;//Math.round(Math.sqrt(players))*70; //Sets the +/- of the border
var RaftorSize = 15; //Sets the width of the Raftors. 
//Ideal for clean Minecraft map. RaftorSize = 150
var floor = 40; // floor height

//Examples:
//Confirmed to work
//blocks.setBlock(Vector(0,65,0),BaseBlock(BlockID.BEDROCK));

//Functions
//Confirmed to work
function Wall(blocktype,StartX,StartZ,mySize,isInXdirection,Depth)
//if(isInXdirection==1), then builds in the +X direction (East)
//otherwise in the +Z direction (South)
{
    if(isInXdirection==1){
        var z=StartZ;
        for(var x = StartX;x<mySize+StartX;x++) {
            for (var y = Depth; y < 127; y++) {
                var vecE = new Vector(x, y, z);
                blocks.setBlock(vecE, blocktype);
            }
        }
    }else{
        var x=StartX;
        for(z = StartZ;z<mySize+StartZ;z++) {
            for (var y = Depth; y < 127; y++) {
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
function MakePavillion(x,z)
{
	y = FindElevation(x,z)
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
function VectorRotate(inVector,numberOfRotations)
//Returns a vector rotated 90 degrees from Minecraft's top view
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

// confirmed to work
function FindElevation(X,Z)
	//Function to search for the first non air block and returns y position
	// initializing variables
{
	var Y = 127;
	var PosVec = new Vector(X, Y, Z); 
	var AirCheck = true;
	var Block = blocks.getBlockType(PosVec);
	
	while (AirCheck==true){ // while the block in question is air, the loop continues down
		Y=Y-1;
		PosVec = Vector(X, Y, Z);
		Block = blocks.getBlockType(PosVec);
		
		if (Block != BlockID.AIR) {
			AirCheck = false;
		}
	}
	Y = Y + 1; // ensures that the returned values is the Y of the interface between air and ground
	return Y
}

//confirmed to work
function MakeSpawnRoom(x,z,direction){
    //0 = north, 1=east, 2=south, 3=west (in terms of what direction you look into the door)
    var dir = [[0,-1],[1,0],[0,1],[-1,0]];//Mappings for unit vectors for these directions
	
	//find where air meets ground
	if (x!=size){
		if (z==size){
			groundZ = z-1;
		}else{ 
			groundZ = z+1;
		}
	}else {groundZ = z;
	}
	
	if (z!=size){
		if (x==size){
			groundX = x-1;
		}else{
			groundX = x+1;
		}
	}else {groundX = x;
	}
	
	y = FindElevation(groundX,groundZ)
	
    var baseVec = new Vector(groundX,y-1,groundZ);
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
    
    //Relative vectors for the internal objects
    var torch1 = new VectorRotate(Vector( 1,2,-2),direction);
    var torch2 = new VectorRotate(Vector(-1,2,-2),direction);
    var chest  = new VectorRotate(Vector(-1,1,-2),direction);
	var sign1  = new VectorRotate(Vector(0,4,-2),direction);
	var sign2  = new VectorRotate(Vector(0,3,-2),direction);
	var sign3  = new VectorRotate(Vector(-1,3,-2),direction);
	var sign4  = new VectorRotate(Vector(-2,3,-2),direction);
	var sign5  = new VectorRotate(Vector(-2,3,-3),direction);
	var sign6  = new VectorRotate(Vector(-2,3,-4),direction);
	var sign7  = new VectorRotate(Vector(-2,3,-5),direction);
	var sign8  = new VectorRotate(Vector(-1,3,-5),direction);
	var sign9  = new VectorRotate(Vector(0,3,-5),direction);
	var sign10 = new VectorRotate(Vector(1,3,-5),direction);
	
	
    //Place 2 torches
    blocks.setBlock(torch1.add(baseVec),BaseBlock(BlockID.TORCH));
    blocks.setBlock(torch2.add(baseVec),BaseBlock(BlockID.TORCH));
    //Place the chest with a map in it
    var Map0 = new BaseItemStack(358, 1);
    SpawnChest(chest.add(baseVec),Map0);
	//Place a sign above the door
	if (direction == 2){
		signDirection = 3;
	}else
		if (direction ==1){
			signDirection = 5;
		}else
			if (direction == 3){
				signDirection = 4;
			}else{
				signDirection = 2;
			}
	SpawnSign(68,signDirection,sign1.add(baseVec),["Battle","Royale!"," "," "]);
	SpawnSign(68,signDirection,sign2.add(baseVec),["When the door","opens, you","must Minecraft","until only one"]);
	SpawnSign(68,signDirection,sign3.add(baseVec),["person is left","alive.","The map has","been boxed in"]);
	SpawnSign(68,signDirection,sign4.add(baseVec),["on five sides","with bedrock,","with a floor at","y = 40."]);
	
	signDirection = RotateSign(signDirection); // Rotates sign to align with next wall
	
	SpawnSign(68,signDirection,sign5.add(baseVec),["This prevents","mining of rarer","resources.","The only way"]);
	SpawnSign(68,signDirection,sign6.add(baseVec),["to obtain these","resources, such","as diamond and","redstone, is"]);
	SpawnSign(68,signDirection,sign7.add(baseVec),["to visit a","Resource","Spawner,","marked in red"]);
	
	signDirection = RotateSign(signDirection);
	
	SpawnSign(68,signDirection,sign8.add(baseVec),["on the map","found in the","chest next","to you."]);
	SpawnSign(68,signDirection,sign9.add(baseVec),["The center","spawner is much","more likely","to spawn"]);
	SpawnSign(68,signDirection,sign10.add(baseVec),["high quality","resource."," ","GL HF!"]);
	
}

//confirmed to work
function RotateSign(originalDirection){
	//Rotates sign direction clockwise once
	if (originalDirection == 2) {return 5}
	else if (originalDirection == 3) {return 4}
	else if (originalDirection == 4) {return 2}
	else {return 3}
}

//confirmed to work
function Floor(blocktype, StartX, StartZ)
// Creates a floor of bedrock, three blocks of air, and then a glowstone floor.
{
	var b = blocktype;
	for(var x = origin.getX()-StartX; x<=origin.getX()+StartX; x++){
		for(var z = origin.getZ()-StartZ; z<=origin.getZ()+StartZ; z++){
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

//confirmed to work
function SpawnSign(type, orient, signVec, signText)
//Spawns a sign. Sign type 63 is a standing sign, 68 is a wall sign.
//Orientation is an int.
//for type 63, will rotate among 12 options.
//for type 68, will orient on specified wall:
//2 = +z wall, 3 = -z wall, 4 = +x wall, 5 = -x wall
{
	var vec = signVec;
	var text = signText; //4 part array, one for each line of the sign.
	//Requires " " for a blank line, otherwise will put a strange addresss.
	var b = BaseBlock(SignBlock(type,orient,text));
	
	blocks.setBlock(vec,b);
}

//Function execution

//Notes:
//+X == East
//+Y == Up
//+Z == South

//Wall(blocktype,StartX,StartZ,mySize,isInXdirection);
Wall(blocktype,origin.getX()-size,origin.getZ()-size,size+size+1,1,floor); // North
Wall(blocktype,origin.getX()-size,origin.getZ()+size,size+size+1,1,floor); // South
Wall(blocktype,origin.getX()+size,origin.getZ()-size,size+size+1,0,floor); // East
Wall(blocktype,origin.getX()-size,origin.getZ()-size,size+size+1,0,floor); // West

//Raftor(blocktype,StartZ,StartX,mySize,isInXdirection);
Raftor(blocktype,origin.getZ()-size-RaftorSize ,origin.getX()-size-RaftorSize ,size,0); // SW
Raftor(blocktype,origin.getZ()+size            ,origin.getX()-size            ,size,0); // NE
Raftor(blocktype,origin.getZ()-size-RaftorSize ,origin.getX()+size            ,size,1); // NW
Raftor(blocktype,origin.getZ()-size            ,origin.getX()-size-RaftorSize ,size,1); // SE

Floor(blocktype, size, size);

	MakeSpawnRoom(origin.getX()-(size/3),origin.getZ()+size-2,2); // S
	MakePavillion(origin.getX(),origin.getZ());
	//player.print ("SpawnRoom 1 and Pavillion 1");
	
if (players > 1){
	MakeSpawnRoom(origin.getX()+size/3,	origin.getZ()-size,0); // N
	//player.print ("SpawnRoom 2");
}
if (players > 2){
	MakeSpawnRoom(origin.getX()-size,	origin.getZ()-size/3,3); // W
	MakePavillion(origin.getX()-size/2,	origin.getZ()+size/2);
	//player.print ("SpawnRoom 3 and Pavillion 2");
}
if (players > 3){
	MakeSpawnRoom(origin.getX()+size-2,	origin.getZ()+size/3,1); // E
	//player.print ("SpawnRoom 4");
}
if (players > 4){
	MakeSpawnRoom(origin.getX()+size/3,	origin.getZ()+size-2,2); // S
	MakePavillion(origin.getX()+size/2,	origin.getZ()-size/2);
	//player.print ("SpawnRoom 5 and Pavillion 3");
}
if (players > 5){
	MakeSpawnRoom(origin.getX()-size/3,	origin.getZ()-size,0); // N
	//player.print ("SpawnRoom 6");
}
if (players > 6){
	MakeSpawnRoom(origin.getX()-size,	origin.getZ()+size/3,3); // W
	MakePavillion(origin.getX()+size/2, origin.getZ()+size/2);
	MakePavillion(origin.getX()-size/2,	origin.getZ()-size/2);
	//player.print ("SpawnRoom 7 and Pavillion 4 and 5");
}
if (players > 7){
	MakeSpawnRoom(origin.getX()+size-2, 	origin.getZ()-size/3,1); // E
	//player.print ("SpawnRoom 8");
}
if (players > 8){
	MakeSpawnRoom(origin.getX()-size+1, origin.getZ()+size-2, 2); // SW Corner
	//player.print ("SpawnRoom 9");
}
if (players > 9){
	MakeSpawnRoom(origin.getX()+size-3, origin.getZ()-size, 0); // NE Corner
	//player.print ("SpawnRoom 10");
}
if (players > 10){
	MakeSpawnRoom(origin.getX()-size, 	origin.getZ()-size+1, 3); // NW Corner
	//player.print ("SpawnRoom 11");
}
if (players > 11){
	MakeSpawnRoom(origin.getX()+size-2, 	origin.getZ()+size-3, 1); // SE Corner
	//player.print ("SpawnRoom 12");
}

player.print ("Done");

//for(var i=0;i<20;i++)
//{
//    blocks.setBlock(VectorRotate(Vector(0.5,85+i,0.5),i),BaseBlock(BlockID.LIGHTSTONE));
//}//Makes a spiral staircase of lightstone around the origin
