const Promise = require("bluebird");
const Lifx = require("node-lifx-lan");

const lights = [
  {
    color: "f6019d",
    address: {
      mac: "D0:73:D5:2D:5D:36",
      ip: "192.168.1.9",
    },
  },
  {
    color: "023788",
    address: {
      mac: "D0:73:D5:2D:73:31",
      ip: "192.168.1.8",
    },
  },
];

const express = require("express");
const app = express();
const port = 8888;

let state = false;

async function main() {
  console.log("lights", lights);

  const devices = await Promise.mapSeries(lights, (light) => Lifx.createDevice(light.address));

  console.log("devices", devices);

  const turnOn = async () => {
    console.log("turn on");

    await Promise.each(devices, (device) => device.turnOn());
  };

  const turnOff = async () => {
    console.log("turn off");

    await Promise.each(devices, (device) => device.turnOff());
  };

  const resetColors = async (device) => {
    console.log("reset colors");

    await Promise.each(devices, (device, index) => device.setColor({ color: { css: `#${lights[index].color}` }}));
  };

  const setColor = async (index, color) => {
    console.log("set color", index, color);

    await devices[index].setColor({ color: { css: `#${color}` }});
  };

  const flip = async () => {
    state = !state;

    if (state === true) {
      turnOn();
    } else if (state === false) {
      turnOff();
    }
  };

  app.get("/", (req, res) => {
    flip();
    res.end();
  });

  app.get("/reset", async (req, res) => {
    resetColors();
    res.end();
  });

  app.get("/set/:index/:color", async (req, res) => {
    const { index, color } = req.params;
    setColor(index, color);
    res.end();
  });

  app.get("/on", async (req, res) => {
    turnOn();
    res.end();
  });

  app.get("/off", async (req, res) => {
    turnOff();
    res.end();
  });

  app.listen(port, () => {
    console.log(`lajfex app listening on port ${port}`);
  });
}

main();

