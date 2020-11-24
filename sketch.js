let agents;

function setup() {

    console.log("Setup");
    createCanvas(600, 400);

    environment = new Group();
    agents = new Group();
    agentBoxes = new Group();

    for (let i = 0; i < 3; i++) {
        createAgent(300 + (20 * i), 100);
    }
    for (let i = 0; i < 3; i++) {
        createAgent(300 + (20 * i), 120);
    }
    for (let i = 0; i < 3; i++) {
        createAgent(300 + (20 * i), 140);
    }

    agentBoxes[8].shapeColor = "green";

    for (let i = 0; i < allSprites.length; i++) {
        allSprites[i].neigbors = getNeighbors();
    }


    //Create immovable sprites to serve ad boundaries.
    staticEdgeBarriers(30);
}

function draw() {
    background(255, 255, 255);
    let random = getRndInt(0, 180);
    console.log("No Loop is On");
    noLoop();


    //Collision Management for agents that does not include HitBox
    agents.collide(agents);


    //Agent movement & behavior  **Add additional logic to test for type**
    for (let i = 0; i < agents.length; i++) {

        agentBoxes[i].position.x = agents[i].position.x;
        agentBoxes[i].position.y = agents[i].position.y;
        agents[i].neighborCount = agentBoxes[i].neighborCount


        //if(s.neighborCount < 2){ s.alone = true};
        agents[i].alone = undefined;

        if (frameCount % 60 == 0) {
            if (agents[i].alone == true) {    //Random Walk

                agents[i].setSpeed(2, random);
                agents[i].rotation = random;
            } else if (agents[i].alone == false) {
                agents[i].setSpeed(5, random);
            }
            else if (agents[i].alone == undefined) {
                agents[i].setSpeed(0);
            }
        }
    }

    //The Neighbor Problem: For generalized agents

    for (let i = 0; i < agentBoxes.length; i++) {
        for (let j = 0; j < agents.length; j++) {
            

            if (agentBoxes[i].overlap(agents[j]) && agentBoxes[i].neighbors[agents[j]].isNeighbor == false) {


                console.log(i + " is neighboring " + j)    //This logs correctly 


                agentBoxes[i].neighborCount++;


                //agentBoxes[i].neighbors[agents[j]].isNeighbor = true;  //This sets every isNeighbors in the object as true.
                

            }
            // else if ((agentBoxes[i].overlap(agents[j]) == false) && agentBoxes[i].neighbors[agents[j]].isNeighbor == true) {

            //     console.log(i + " is No Longer neighboring " + j)
            
            //     // agentBoxes[i].neighborCount--;

            //     //agentBoxes[i].neighbors[agents[j]].isNeighbor = false;
            
            // } else { };

        };
    }

    console.log("Agent Box 0:" + agentBoxes[0].neighborCount, "Agent Box 4:" + agentBoxes[4].neighborCount, "Agent Box 8:" + agentBoxes[8].neighborCount);

    //All sprites bounce on the edge of the canvas.
    canvasBounce();

    //Draw all the sprites added to the sketch so far
    //Positions are updated automatically at every cycle
    drawSprites();
}


//create agent
function createAgent(x, y, xWidth = 15, yWidth = 15, type) {

    //Create agent sprite
    let a = createSprite(x, y, xWidth, yWidth);
    a.setDefaultCollider();

    if (type = 'sheep') {
        a.shapeColor = "blue";
    } else {
        a.shapeColor = 'red'
    }

    a.maxSpeed = 4;
    a.friction = 0.05;
    a.mass = 1;
    a.type = type;
    a.alone = true;
    agents.add(a);

    //Create agent field of vision or Hitbox
    let b = createSprite(x, y, 3 * xWidth, 3 * yWidth);
    b.setCollider('rectangle');
    b.depth = 0;
    b.shapeColor = (255, 255, 255, 220);
    b.neighborCount = 0;

    //Initialize list of possible neighbors.
    a.neighbors = b.neighbors;
    b.neighbors = getNeighbors();
    a.neighborCount = b.neighborCount;
    b.type = type + "Box";
    agentBoxes.add(b)

}


function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function getNeighbors() {
    let neighbors = {}
    for (let i = 0; i < agents.length; i++) {

        neighbors[agents[i]] = {
            type: agents[i].type,
            isNeighbor: false
        }
    }
    return neighbors;
}


function canvasBounce() {
    //all sprites bounce at the screen edges
    for (var i = 0; i < allSprites.length; i++) {
        var s = allSprites[i];
        if (s.position.x < 0) {
            s.position.x = 1;
            s.velocity.x = abs(s.velocity.x);
        }

        if (s.position.x > width) {
            s.position.x = width - 1;
            s.velocity.x = -abs(s.velocity.x);
        }

        if (s.position.y < 0) {
            s.position.y = 1;
            s.velocity.y = abs(s.velocity.y);
        }

        if (s.position.y > height) {
            s.position.y = height - 1;
            s.velocity.y = -abs(s.velocity.y);
        }
    }
}

function staticEdgeBarriers(WALL_THICKNESS) {
    //Create Static Barriers
    wallTop = createSprite(width / 2, -WALL_THICKNESS / 2, width + WALL_THICKNESS * 2, WALL_THICKNESS);
    wallTop.immovable = true;
    wallTop.type = "environment"
    environment.add(wallTop);

    wallBottom = createSprite(width / 2, height + WALL_THICKNESS / 2, width + WALL_THICKNESS * 2, WALL_THICKNESS);
    wallBottom.immovable = true;
    wallBottom.type = "environment"
    environment.add(wallBottom);

    wallLeft = createSprite(-WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height);
    wallLeft.immovable = true;
    wallLeft.type = "environment"
    environment.add(wallLeft);

    wallRight = createSprite(width + WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height);
    wallRight.immovable = true;
    wallRight.type = "environment";
    environment.add(wallRight);

    wallLeft.shapeColor = wallRight.shapeColor = wallTop.shapeColor = wallBottom.shapeColor = color(100, 85, 240);
}
