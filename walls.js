// $Id$
/*
 * Copyright (c) 2011 Bentech
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

importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);

var blocks = context.remember();
var session = context.getSession(); // Unsure if either of these lines are necessary

context.checkArgs(1, 2, "[players] <type>"); // From observing other code, 1 starts this, and the 2 was necessary based on observing code with other argument numbers

var players = parseInt(argv[1]); //Parses the player number

var blocktype = context.getBlock(argv[2]); // Parses the block type, will look to remove this soon

var size = players * 10; //Sets the +/- of the border

//North Wall

var x = -size; //Begins wall construction at -x, goes up at Y from 0 to 126, moves to -x + 1, repeats until hitting x

for (x; x < size; x++) {
   for (var y = 0; y < 127; y++) {
        var vec = new Vector(
             x, y, size);
             
        blocks.setBlock(vec, blocktype);
   }          
}   