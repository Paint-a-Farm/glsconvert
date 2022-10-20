const fs = require("fs");
const path = require("path");
const Gls = require("./Gls");
const KaitaiStream = require("kaitai-struct/KaitaiStream");
const { create } = require("xmlbuilder2");
const WaveFile = require('wavefile').WaveFile;

if (process.argv[2] === undefined) {
    console.log('No input file specified. Aborting...')
    process.exit(-1)
}

let fileContent;
try {
    fileContent = fs.readFileSync(process.argv[2]);

}
catch (error) {
    if (error.code && error.code === "ENOENT") {
        console.log('File not found. Provide a valid path to a gls sound file. Aborting...')
        process.exit(-1)
    }
}

let parsedGls;
try {
    parsedGls = new Gls(new KaitaiStream(fileContent));
} catch (error) {
    if (error.message && error.message.startsWith('not equal, expected [32,115,108,103]')) {
        console.log('Wrong file format. Expected a gls sound file. Aborting...')
        process.exit(-1)
    }
}

function getLoadElement(load) {
    return {
        lfo: {
            "@waveform": Gls.Waveforms[load.waveform],
            "@harmonic": load.loadLfoHarmonic,
            "@fadeStartRpm": load.loadLfoFadeStartRpm,
            "@fadeEndRpm": load.loadLfoFadeEndRpm,
            "@fadeMinScale": Math.round(load.loadLfoFadeMinScale * 100) / 100,
        },
        order: {
            "@distortionBeforeEqualizer": !!load.loadOrderDistortionBeforeEq,
        },
        invertWet: {
            "@value": !!load.loadInvertwetValue,
        },
        gain: {
            "@inputDb": load.inputGain,
            "@outputDb": load.outputGain,
        },
        equalizer: {
            "#": load.loadpoints[0].band.map((band) => ({
                band: {
                    "@frequency": band.frequency,
                    "@qualityFactor": Math.round(band.qualityFactor * 100) / 100, 
                }
            }))
        },
        bandDistortion: {
            "#": [
                { 
                    "band": { 
                        "@type": Gls.BandTypes[load.banddistortionLowType],
                        "@maxFrequency": load.banddistortionLowMaxfrequency,
                    }
                },
                { 
                    "band": { 
                        "@type": Gls.BandTypes[load.banddistortionMidType],
                        "@maxFrequency": load.banddistortionMidMaxfrequency,
                    }
                },
                { 
                    "band": { 
                        "@type": Gls.BandTypes[load.banddistortionHighType],
                    }
                },
            ]

        },
        loadPoints: {
            "#": load.loadpoints.map((loadpoint) => ({
                loadPoint: {
                    "@load": Math.round(loadpoint.load * 100) / 100,
                    "@wet": Math.round(loadpoint.wet * 100) / 100,
                    "@dry": Math.round(loadpoint.dry * 100) / 100,
                    "@gainDb": loadpoint.gainDb,
                    "lfo": {
                        "@amplitudeDb": loadpoint.lfoAmplitudedb,
                        "@offsetDb": loadpoint.lfoOffsetb,
                    },
                    "equalizer": {
                        "#": loadpoint.band.map((band) => ({
                            band: { "@gainDb": band.gaindb }
                        }))
                    },
                    "bandDistortion": {
                        "#": [
                            { band: { "@drive": Math.round(loadpoint.banddistortionLowDrive * 100) / 100}},
                            { band: { "@drive": Math.round(loadpoint.banddistortionMidDrive * 100) / 100}},
                            { band: { "@drive": Math.round(loadpoint.banddistortionHighDrive * 100) / 100}},
                        ]
                    }
                }
            }))
        }
    }
}

const obj = {
    giantsLoopSynthesis: {
        source: {
            loops: {
                "#": parsedGls.engineloopfiles.map((loop) => ({
                    loop: {
                        "@filename": `engine_${loop.rpmRoot}.${Gls.FileFormats[loop.file.fileFormat].toLowerCase()}`,
                        "@rpmMin": loop.rpmMin,
                        "@rpmMax": loop.rpmMax,
                        "@rpmRecorded": loop.rpmRoot,
                    }
                })),
            },
            start: {
                ...(parsedGls.startfile.file.filelength > 0 ? { "@filename": `start.${Gls.FileFormats[parsedGls.startfile.file.fileFormat].toLowerCase()}` } : {}),
                "@gainDb": Math.round(20 * Math.log10(parsedGls.startfile.gainVoltage)),
                "@fadeMs": parsedGls.startFadems,
                "@rpm": parsedGls.startRpm,
                "@useEqualPowerFade": !!parsedGls.startUseEqualPowerFade,
            },
            stop: {
                ...(parsedGls.stopfile.file.filelength > 0 ? { "@filename": `stop.${Gls.FileFormats[parsedGls.stopfile.file.fileFormat].toLowerCase()}` } : {}),
                "@gainDb": Math.round(20 * Math.log10(parsedGls.stopfile.gainVoltage)),
                "@fadeMs": parsedGls.stopFadems,
            },
            rpm: {
                "@fadeMaxTimeMs": parsedGls.rpmFadeMaxTimeMs,
            },
            loopsExhaust: {
                "#": parsedGls.exhaustLoops.map((loop) => ({
                    loop: {
                        "@filename": `exhaust_${loop.rpmRoot}.${Gls.FileFormats[loop.file.fileFormat].toLowerCase()}`,
                        "@rpmMin": loop.rpmMin,
                        "@rpmMax": loop.rpmMax,
                        "@rpmRecorded": loop.rpmRoot,
                    }
                })),
            }
        },
        load: getLoadElement(parsedGls.engineLoad),
        loadExhaust: getLoadElement(parsedGls.exhaustLoad)
    }
}

const outputFilename = process.argv[3] ?? `${process.argv[2].replace('_loop', '')}p`
fs.mkdirSync(path.dirname(outputFilename), { recursive: true })

const doc = create({ version: "1.0", encoding: 'utf-8', standalone: false }).ele(obj);

console.log('Writing engine loop audio files...')
for (const loop of parsedGls.engineloopfiles) {
    let contents;
    if (loop.file.fileFormat === 0) {
        let wav = new WaveFile();
        wav.fromScratch(1, 44100, '16', loop.file.filecontentswav);
        contents = wav.toBuffer()
    } else {
        contents = loop.file.filecontents
    }
    fs.writeFileSync(path.join(path.dirname(outputFilename), `engine_${loop.rpmRoot}.${Gls.FileFormats[loop.file.fileFormat].toLowerCase()}`), contents, { encoding: 'binary'})
}

if (parsedGls.numberOfExhaustLoops > 0) {
    console.log('Writing exhaust loop audio files...')
    for (const loop of parsedGls.exhaustLoops) {
        let contents;
        if (loop.file.fileFormat === 0) {
            let wav = new WaveFile();
            wav.fromScratch(1, 44100, '16', loop.file.filecontentswav);
            contents = wav.toBuffer()
        } else {
            contents = loop.file.filecontents
        }

        fs.writeFileSync(path.join(path.dirname(outputFilename), `exhaust_${loop.rpmRoot}.${Gls.FileFormats[loop.file.fileFormat].toLowerCase()}`), contents, { encoding: 'binary'})
    }
}

if (parsedGls.startfile.file.filelength > 0) {
console.log('Writing start/stop audio files...')
    {
        let contents
        if (parsedGls.startfile.file.fileFormat === 0) {
            let wav = new WaveFile();
            wav.fromScratch(1, 44100, '16', parsedGls.startfile.file.filecontentswav);
            contents = wav.toBuffer()
        } else {
            contents = parsedGls.startfile.file.filecontents
        }
        fs.writeFileSync(path.join(path.dirname(outputFilename), `start.${Gls.FileFormats[parsedGls.startfile.file.fileFormat].toLowerCase()}`), contents, { encoding: 'binary'})
    }
    {
        let contents
        if (parsedGls.stopfile.file.fileFormat === 0) {
            let wav = new WaveFile();
            wav.fromScratch(1, 44100, '16', parsedGls.stopfile.file.filecontentswav);
            contents = wav.toBuffer()
        } else {
            contents = parsedGls.stopfile.file.filecontents
        }
        fs.writeFileSync(path.join(path.dirname(outputFilename), `stop.${Gls.FileFormats[parsedGls.stopfile.file.fileFormat].toLowerCase()}`), contents, { encoding: 'binary'})
    }
}

console.log(`Writing project file ${outputFilename}...`)
fs.writeFileSync(outputFilename, doc.end({ prettyPrint: true }))
