const Lifx = require('node-lifx-lan');

const l1 = {
    mac: 'D0:73:D5:2D:5D:36',
    ip: '192.168.1.7'
}

const l2 = {
    mac: 'D0:73:D5:2D:73:31',
    ip: '192.168.1.8'

};

const express = require('express');
const app = express();
const port = 8888;

let state = false;

async function main() {
    const d1 = await Lifx.createDevice(l1);
    const d2 = await Lifx.createDevice(l2);

    const turnOn = async (req, res) => {
        console.log('turn on');

        await d1.turnOn({ color: { css: '#f6019d' } });
        await d2.turnOn({ color: { css: '#023788' } });
    };

    const turnOff = async (req, res) => {
        console.log('turn off');

        await d1.turnOff();
        await d2.turnOff();
    };

    app.get('/', (req, res) => {
        state = !state;

        if (state === true) {
            turnOn();
        }
        else if (state === false) {
            turnOff();
        }

        res.end();
    });

    app.get('/on', async (req, res) => {
        turnOn();
        res.end();
    });

    app.get('/off', async (req, res) => {
        turnOff();
        res.end();
    });

    app.listen(port, () => {
        console.log(`lajfex app listening on port ${port}`)
    });
}

main();
