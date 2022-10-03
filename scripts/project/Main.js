
// Put any global functions etc. here

var data = '';

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
	
	
	self.addEventListener("message", (event) => { 
		data = event.data;
		console.log("iFrame Received: " + data);
	}, false);
	});

function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	
	runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime)
{

}

function postText(value){
	console.log('iFrame sender: ' + value) 
	parent.postMessage(value, "*")
}
