# AISuite Project WDR
Version 13, while getting ready for npm publishing, concentrate Angular common parts (typescript files) under this folder.
Any editing should occur in this folder.  It is automatically copied through [Properties/VS_prebuild.bat] to every other project.  

Each file concerned containes the comment following area : 

/*
//    ---------------------------------------------------------
//    ---     AISuite Project important Information         ---
//    ---     Edit this file only in WDR Angular Project    ---
//    ---------------------------------------------------------
//
// this is either re-used here or copied automatically everywhere else required
// needed thus enabling a single point for development.
*/

08/03/2021 : concentrated into AISuiteModule (aisuite.module.ts  and ged.module.ts)
10/08/2021 : linsce call to repo using API ; require Angular module call API on same url root, variable is set in Environment, NO CROSS SITE SCRIPTING ALLOWED

