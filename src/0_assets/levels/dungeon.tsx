<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11.0" name="dungeon" tilewidth="16" tileheight="16" tilecount="100" columns="10">
 <image source="../image/castle.png" width="160" height="160"/>
 <tile id="1">
  <properties>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="14" type="mirror"/>
 <tile id="17">
  <properties>
   <property name="light" value="castle.lantern"/>
  </properties>
 </tile>
 <tile id="29">
  <properties>
   <property name="light" value="castle.candle"/>
  </properties>
 </tile>
 <tile id="70" probability="2"/>
 <tile id="81" probability="2"/>
 <tile id="86" type="door">
  <properties>
   <property name="door" value="y"/>
   <property name="door.closed" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="89">
  <properties>
   <property name="door" value="y"/>
   <property name="door.closed" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="90" probability="20"/>
 <tile id="91" probability="2"/>
 <tile id="96" type="postit"/>
</tileset>
