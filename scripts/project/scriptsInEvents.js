import {colors} from './Settings.js';

export let boundBoxes = [];

export function rand(start,end)
{
	return Math.floor(Math.random()*(end-start)) + start;
}

export function lerp(x,y,val)
{
	const v = val>1?1:val<0?0:val;
	
	return x + (y-x)*v;
	
}

export function postText(value){
	let postMsg = '';
	console.log('iFrame sender: ' + value) 
	parent.postMessage(value, "*")
}


const scriptsInEvents = {

	async Egame_Event2_Act1(runtime, localVars)
	{
		//Get All Obstacles and Bound Boxes to Spwan Randomly later
		const obstacles = Array.from(runtime.objects.Obstacles.instances());
		const bounds = Array.from(runtime.objects.BoundBox.instances());
		const stars = Array.from(runtime.objects.star.instances());
		
		boundBoxes = bounds.map(b=> {
			return {
				height:b.height,
				obstacles: obstacles.filter(obs=> obs.x<=b.width/2 + b.x && obs.x>= b.x-b.width/2 && obs.y<=b.height/2 + b.y && obs.y>= b.y-b.height/2).map(obs=>{
				return {
					relX: obs.x - b.x,
					relY:obs.y - b.y,
					obstacle :obs
				};
				
				}
				),
				stars:stars.filter(obs=> obs.x<=b.width/2 + b.x && obs.x>= b.x-b.width/2 && obs.y<=b.height/2 + b.y && obs.y>= b.y-b.height/2).map(s=>{
				return {relX:s.x - b.x,relY:s.y - b.y};
				})
			};
		});
		
		
		
	},

	async Egame_Event3_Act1(runtime, localVars)
	{
		//Create Random Obstacles and Destroy Earlier as Camera Move
		
		const cam = runtime.objects.Camera.getFirstInstance()
		
		if(cam.y+runtime.layout.height>runtime.globalVars.LastObstacleY)
		{
			runtime.callFunction("CreateObstacles");
		}
		runtime.callFunction("CleanUpObstaclesIfCan");
		
	},

	async Egame_Event4_Act1(runtime, localVars)
	{
		//Camera Follow The Player
		
		const camera = runtime.objects.Camera.getFirstInstance();
		const player = runtime.objects.Player.getFirstInstance();
		
		if(!player)
		return;
		
		if(player.y>camera.y)
		{
			camera.y = lerp(camera.y,player.y,4*runtime.dt);
		}
		
		
	},

	async Egame_Event5_Act1(runtime, localVars)
	{
		//add new obstacles
		
		const count = rand(3,5);
		
		
		const switcher = runtime.objects.color_switcher.createInstance(1,runtime.layout.width/2,runtime.globalVars.LastObstacleY - 80);
		
		runtime.globalVars.LastObstacleY = 
		runtime.globalVars.LastObstacleY + 3*switcher.height;
		
		const color = rand(0,4);
		console.log(color);
		switcher.instVars.color = color;
		
		for(let i=0;i<count;i++)
		{
			const box = boundBoxes[rand(0,boundBoxes.length)];
			const y = runtime.globalVars.LastObstacleY + box.height/2;
			const x = runtime.layout.width/2;
			box.obstacles.forEach(obs=>{
			const ist = obs.obstacle.objectType.createInstance(1,x + obs.relX,y+obs.relY);
			ist.angle = obs.obstacle.angle;
			ist.width = obs.obstacle.width;
			ist.height = obs.obstacle.height;
			ist.instVars.angSpeed = obs.obstacle.instVars.angSpeed;
			ist.setAnimation(color+"");
		});
			
			box.stars.forEach(b=>{ 
			runtime.objects.star.createInstance(1,b.relX+x,b.relY+y);
			console.log(b.relX+x,b.relY+y);
			});
		// 	const bTest = runtime.objects.BoundBox.createInstance(0,x,y);
		// 	bTest.width = box.width;
		// 	bTest.height = box.height;
		// 	bTest.opacity = 0.1;
			runtime.globalVars.LastObstacleY =runtime.globalVars.LastObstacleY+box.height; 
		}	
	},

	async Egame_Event6_Act1(runtime, localVars)
	{
		//destroy earlier objects
		const cam = runtime.objects.Camera.getFirstInstance();
		
		Array.from(runtime.objects.Obstacles.instances()).filter(item=>
		item.layer == 1 &&
		item.y<cam.y-runtime.layout.height).forEach(item=>item.destroy());
		
		Array.from(runtime.objects.star.instances()).filter(item=>
		item.layer == 1 &&
		item.y<cam.y-runtime.layout.height).forEach(item=>item.destroy());
	},

	async Egame_Event26_Act2(runtime, localVars)
	{
		//Spawn Jump Particle Effect
		const player = runtime.objects.Player.getFirstInstance();
		runtime.objects.JumpEffect.createInstance(1,player.x,player.y).colorRgb = colors[player.instVars.color];
	},

	async Egame_Event28_Act2(runtime, localVars)
	{
		//spawn Color change Particles
		const player = runtime.objects.Player.getFirstInstance();
		runtime.objects.ColorChange.createInstance(1,player.x,player.y).colorRgb = colors[player.instVars.color];
		runtime.objects.ColorChange.createInstance(1,player.x,player.y).colorRgb = colors[+runtime.globalVars.Temp];
	},

	async Egame_Event33_Act1(runtime, localVars)
	{
		//Update the player Color
		const player = runtime.objects.Player.getFirstInstance();
		player.colorRgb = colors[player.instVars.color];
	},

	async Egame_Event34_Act1(runtime, localVars)
	{
		//spawn die particle effect all color
		const player = runtime.objects.Player.getFirstInstance();
		runtime.objects.DieParticle.createInstance(1,player.x,player.y).colorRgb = colors[0];
		runtime.objects.DieParticle.createInstance(1,player.x,player.y).colorRgb = colors[1];
		runtime.objects.DieParticle.createInstance(1,player.x,player.y).colorRgb = colors[2];
		runtime.objects.DieParticle.createInstance(1,player.x,player.y).colorRgb = colors[3];
	},

	async Egame_Event35_Act2(runtime, localVars)
	{
		postText(runtime.globalVars.finalScore)
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

