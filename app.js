const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const pathfile = path.join(__dirname, "covid19India.db");
let db = null;
const initialdbserver = async () => {
  try {
    db = await open({
      filename: pathfile,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server start at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Error:e.message`);
    process.exit(1);
  }
};
initialdbserver();

//API 1

functioneachitem = (object) => {
  return {
    stateId: object.state_id,
    stateName: object.state_name,
    population: object.population,
  };
};

app.get("/states/", async (request, response) => {
  const getquery = `
     SELECT *
     FROM state`;

  const getallquery = await db.all(getquery);
  response.send(getallquery.map((eachitem) => functioneachitem(eachitem)));
});

// API 2

app.get("/states/:stateId/", async (request, respnose) => {
  const { stateId } = request.params;
  const getindivisiualquery = `
     SELECT * 
     FROM state 
     WHERE state_id=${stateId}`;

  const finalgetquery = await db.get(getindivisiualquery);
  respnose.send(functioneachitem(finalgetquery));
});

//API 4

functiondistrict = (object) => {
  return {
    districtId: object.district_id,
    districtName: object.district_name,
    stateId: object.state_id,
    cases: object.cases,
    cured: object.cured,
    active: object.active,

    deaths: object.deaths,
  };
};

app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getdistrictquery = `
    SELECT * 
    FROM district 
    WHERE district_id=${districtId}`;

  const finaldistrictlist = await db.get(getdistrictquery);
  response.send(functiondistrict(finaldistrictlist));
});

//API 3
app.post("/districts/", async (request, response) => {
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const postquery = `
  INSERT INTO 
  district(district_name,state_id,cases,cured,active,deaths)
  VALUES ("${districtName}",${stateId},${cases},${cured},${active},${deaths})`;

  const postvalue = await db.run(postquery);
  response.send("District Successfully Added");
});

//API 5
app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const deletequery = `
    DELETE FROM district
    WHERE district_id=${districtId}`;

  const deletevalue = await db.run(deletequery);
  response.send("District Removed");
});

//API 6
app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const putvalue = `
    UPDATE 
    district 
    SET district_name="${districtName}",
        state_id=${stateId},
        cases=${cases},

        cured=${cured},
        active=${active},
        deaths=${deaths}
        
        WHERE district_id=${districtId}`;

  const updatevalue = await db.run(putvalue);
  response.send("District Details Updated");
});

//API 7

functionitem2 = (object) => {
  return {
    totalCases: object.cases,
    totalCured: object.cured,
    totalActive: object.active,
    totalDeaths: object.deaths,
  };
};
app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const getstate = `
    SELECT * 
    FROM district
    WHERE  state_id=${stateId}`;
  const finalget = await db.get(getstate);
  response.send(functionitem2(finalget));
});

//API 8
functiondetails = (object) => {
  return {
    stateName: object.state_name,
  };
};
app.get("/districts/:districtId/details/", async (request, response) => {
  const { districtId } = request.params;
  const getquerydetails = `
    SELECT *
    FROM state
    WHERE state_id=${districtId}`;
  const final = await db.get(getquerydetails);
  response.send(functiondetails(final));
});

module.exports = app;
