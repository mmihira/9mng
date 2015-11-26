/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) 
	{
		var _papa = Papa.parse(fileLoadedEvent.target.result);
                console.log(_papa);
		ret_date(_papa.data[0][0]);
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
}



